import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { HTTPResponse, Protocol, ProtocolError } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const headersToRemove = [
    "host", "user-agent", "accept", "accept-encoding", "content-length",
    "forwarded", "x-forwarded-proto", "x-forwarded-for", "x-cloud-trace-context",
];
const responseHeadersToRemove = ["Accept-Ranges", "Content-Length", "Keep-Alive", "Connection", "content-encoding", "set-cookie"];


(async () => {

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        pipe: true,
    });
    console.log("opened puppeteer browser instance");


    const app = new Hono();

    app.all("/", async (ctx) => {

        const target = ctx.req.url.split("?url=")[1];
        console.log("hono got request with url param:", target);

        if (!target) return ctx.json({
            message: "'url' query parameter was not provided",
        }, 400);

        const page = await browser.newPage();
        console.log("opened new page");

        page.removeAllListeners("request");
        await page.setRequestInterception(true);

        const reqHeaders = Object.fromEntries(ctx.req.raw.headers.entries());
        headersToRemove.forEach((header) => {
            delete reqHeaders[header];
        });

        let response: HTTPResponse | null;

        let responseBody;
        let responseData;
        let responseHeaders: Record<string, string>;
        let responseStatus: number;
        let responseCookies: Protocol.Network.Cookie[];

        page.on("request", async (interceptedRequest) => {
            if (ctx.req.method == "POST") {
                const form = await ctx.req.formData();
                const postData = Array.from(form.entries()).reduce((s, [key, val], i) => {
                    s += `${i ? "&" : ""}${key}=${val}`;
                    return s;
                }, "");
                console.log("intercepted POST request with postData", postData);

                const data = {
                    method: "POST",
                    postData,
                    headers: {
                        ...interceptedRequest.headers,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                };
                interceptedRequest.continue(data);
            } else {
                interceptedRequest.continue({ headers: reqHeaders });
            }
        });
        const client = await page.target().createCDPSession();
        await client.send("Network.setRequestInterception", {
            patterns: [{
                urlPattern: "*",
                resourceType: "Document",
                interceptionStage: "HeadersReceived",
            }],
        });
        await client.on("Network.requestIntercepted", async (e) => {
            const obj: { interceptionId: string; errorReason?: Protocol.Network.ErrorReason; } = { interceptionId: e.interceptionId };
            if (e.isDownload) {
                await client.send("Network.getResponseBodyForInterception", {
                    interceptionId: e.interceptionId,
                }).then((result) => {
                    if (result.base64Encoded) {
                        responseData = Buffer.from(result.body, "base64");
                    }
                });
                obj["errorReason"] = "BlockedByClient";
                responseHeaders = e.responseHeaders ?? {};
            }
            await client.send("Network.continueInterceptedRequest", obj);
            if (e.isDownload)
                await page.close();
        });


        await page.setExtraHTTPHeaders(reqHeaders);

        try {
            response = await page.goto(target, { timeout: 30000, waitUntil: "domcontentloaded" });
            if (!response) throw new ProtocolError("No response");

            responseBody = await response.text();

            let tryCount = 0;
            while (responseBody.includes(process.env.CHALLENGE_MATCH || "challenge-running") && tryCount <= 10) {
                tryCount++;
                console.log("solving challenge", tryCount);
                const newResponse = await page.waitForNavigation({ timeout: 30000, waitUntil: "domcontentloaded" });
                if (newResponse) {
                    response = newResponse;
                    responseBody = await response.text();
                }
            }

            responseData = await response.buffer();
            responseStatus = response.status();
            responseHeaders = await response.headers();
            responseCookies = await page.cookies();

            responseHeadersToRemove.forEach(header => delete responseHeaders[header]);

            Object.keys(responseHeaders).forEach(header => ctx.res.headers.append(header, responseHeaders[header]));

            responseCookies.forEach((cookie) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { name, value, secure, domain, ...options } = cookie;
                setCookie(ctx, name, value, { ...options, expires: new Date(options.expires) });
            });
            return ctx.body(responseData, responseStatus);
        } catch (err) {
            if (err instanceof ProtocolError)
                return ctx.json({
                    message: "'url' query parameter is invalid",
                }, 400);

            console.log(err);
            return ctx.json({
                message: "unhandled error",
                details: JSON.stringify(err),
            }, 500);
        } finally {
            await page.close();
            console.log("closed page");
        }
    });

    const port = process.env.PORT || 3000;
    console.log(`Server is running on port ${port}`);

    serve({
        fetch: app.fetch,
        port: +port,
    });

    ["SIGHUP", "SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, async () => {
            console.log("Got", signal);

            await browser.close();
            console.log("closed puppeteer browser instance");
        });
    });

})();