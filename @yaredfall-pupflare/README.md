# @yaredfall/pupflare

> this is a rewrite of the [unixfox/pupflare](https://github.com/unixfox/pupflare) 
>
> *features:*
> 
> * rewritten in typescript
> * rewritten with hono instead of koa
> * response status propagation
> * fixed post requests with formData

# Description

Pupflare is a small web-server that can help you to solve cloudflare challenges of the given target website using puppeteer

# Usage

For usage notes refer to original [unixfox/pupflare](https://github.com/unixfox/pupflare) readme

***currently you can not disable debug logs***

> you can also run project in dev mode with **`npm run dev`** to get automatic reload on code changes

# Future development
- [ ] implementation of original `DEBUG` and `DEBUG_BODY` flags 
- [ ] sufficient testing
- [ ] caching option
- [ ] redirects propagation
- [ ] docker image
