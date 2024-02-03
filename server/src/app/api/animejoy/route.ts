import { LINKS } from "@/utils";
import { Cache } from "@yaredfall/memcache";
import { NextRequest, NextResponse } from "next/server";
import { FetchResponse, ofetch } from "ofetch";
import { hash } from "ohash";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 60 * 12;

const cache = new Cache<FetchResponse<string>>({ defaultTtl: revalidate * 1000 });

async function process(request: NextRequest) {
    const search = request.nextUrl.search;
    if (!search.toString().includes("?url=")) {
        return new Response("Please specify the URL in the 'url' query string.", { status: 400 });
    }
    const AJPath = decodeURIComponent(search.replace("?url=", ""));

    let response: FetchResponse<string> | undefined;

    let form: FormData | undefined = undefined;

    if (request.method === "POST") {
        form = await request.formData();
    }

    const cacheKey = hash({
        AJPath,
        form,
    });
    
    response = cache.get(cacheKey);
    console.log(response ? "cache hit -" : "cache miss -", cacheKey)

    if (!response) {
        response = await ofetch.raw<string>(`${LINKS.pupflare}/?url=${LINKS.animejoy}${AJPath}`, {
            method: request.method,
            body: form,
            ignoreResponseError: true,
        });
        cache.set(cacheKey, response);
    }
    const finalAJUrl = new URL(response.url).search.replace("?url=", "");

    const finalAJPath = finalAJUrl ? decodeURIComponent(((url: URL) => url.pathname + url.search)(new URL(finalAJUrl))) : undefined;

    if (finalAJPath && finalAJPath !== AJPath) {
        console.log({ finalAJPath });
        cache.set(cacheKey, response);
        const newUrl = request.nextUrl.clone();
        newUrl.searchParams.set("url", finalAJPath);
        return NextResponse.redirect(decodeURIComponent(newUrl.toString()));
    }

    const { headers, _data, status } = response;

    return new Response(_data, { headers, status });
}

export async function GET(request: NextRequest) {
    return await process(request);
}
export async function POST(request: NextRequest) {
    return await process(request);
}