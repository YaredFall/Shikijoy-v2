const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const jsesc = require('jsesc');
const { Cache } = require('@yaredfall/memcache');

const cache = new Cache({defaultTtl: 1000 * 60});

puppeteer.use(StealthPlugin());
const app = new Koa();
app.use(bodyParser());

const headersToRemove = [
    "host", "user-agent", "accept", "accept-encoding", "content-length",
    "forwarded", "x-forwarded-proto", "x-forwarded-for", "x-cloud-trace-context"
];
const responseHeadersToRemove = ["Accept-Ranges", "Content-Length", "Keep-Alive", "Connection", "content-encoding", "set-cookie"];

(async () => {
    let options = {
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        pipe: true
    };
    if (process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD)
        options.executablePath = '/usr/bin/chromium-browser';
    if (process.env.PUPPETEER_HEADFUL)
        options.headless = false;
    if (process.env.PUPPETEER_USERDATADIR)
        options.userDataDir = process.env.PUPPETEER_USERDATADIR;
    if (process.env.PUPPETEER_PROXY)
        options.args.push(`--proxy-server=${process.env.PUPPETEER_PROXY}`);
    const browser = await puppeteer.launch(options);
    app.use(async ctx => {
        if (ctx.query.url) {
            const url = ctx.url.replace("/?url=", "");
            let responseBody;
            let responseData;
            let responseHeaders;
            const page = await browser.newPage();
            if (ctx.method == "POST") {
                await page.removeAllListeners('request');
                await page.setRequestInterception(true);
                page.on('request', interceptedRequest => {
                    var data = {
                        'method': 'POST',
                        'postData': ctx.request.rawBody
                    };
                    interceptedRequest.continue(data);
                });
            }
            const client = await page.target().createCDPSession();
            await client.send('Network.setRequestInterception', {
                patterns: [{
                    urlPattern: '*',
                    resourceType: 'Document',
                    interceptionStage: 'HeadersReceived'
                }],
            });

            await client.on('Network.requestIntercepted', async e => {
                let obj = { interceptionId: e.interceptionId };
                if (e.isDownload) {
                    await client.send('Network.getResponseBodyForInterception', {
                        interceptionId: e.interceptionId
                    }).then((result) => {
                        if (result.base64Encoded) {
                            responseData = Buffer.from(result.body, 'base64');
                        }
                    });
                    obj['errorReason'] = 'BlockedByClient';
                    responseHeaders = e.responseHeaders;
                }
                await client.send('Network.continueInterceptedRequest', obj);
                if (e.isDownload)
                    await page.close();
            });
            let headers = ctx.headers;
            headersToRemove.forEach(header => {
                delete headers[header];
            });
            let cookies;
            await page.setExtraHTTPHeaders(headers);
            try {
                console.log("pupflare got request with url: " + url);

                let cached = cache.get(url);
                let completeUrl;
                if (!cached) {
                    console.log("pupflare cache miss");
                    let tryCount = 0;
                    response = await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });

                    completeUrl = response.request().url();

                    responseBody = await response.text();
                    responseData = await response.buffer();
                    while (responseBody.includes("challenge-running") && tryCount <= 10) {
                        newResponse = await page.waitForNavigation({ timeout: 30000, waitUntil: 'domcontentloaded' });
                        if (newResponse) response = newResponse;
                        responseBody = await response.text();
                        responseData = await response.buffer();
                        tryCount++;
                    }
                    responseHeaders = await response.headers();
                    cookies = await page.cookies();

                    responseHeadersToRemove.forEach(header => delete responseHeaders[header]);

                    cache.set(url, { responseHeaders, responseData, cookies, completeUrl });

                } else {
                    console.log("pupflare cache hit");
                    ({ responseHeaders, responseData, cookies, completeUrl } = cached);
                }

                if (url !== completeUrl) {
                    console.log("redirecting to " + completeUrl)
                    cache.set(completeUrl, { responseHeaders, responseData, cookies, completeUrl });
                    ctx.redirect("/?url=" + completeUrl);
                    ctx.body = "Redirected"
                } else {
                    cookies?.forEach(cookie => {
                        const { name, value, secure, expires, domain, ...options } = cookie;
                        ctx.cookies.set(cookie.name, cookie.value, options);
                    });

                    Object.keys(responseHeaders).forEach(header => ctx.set(header, jsesc(responseHeaders[header])));

                    ctx.body = responseData;
                }
            } catch (error) {
                console.log(error);
                ctx.status = error.name === "ProtocolError" ? 400 : 500;
                ctx.body = error.toString();
            }

            await page.close();
        }
        else {
            ctx.body = "Please specify the URL in the 'url' query string.";
        }
    });

    app.listen(process.env.PORT || 8080);
    console.log("listening on port " + (process.env.PORT || 8080));

})();
