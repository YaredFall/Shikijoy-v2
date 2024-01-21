import { LINKS } from "@/utils";
import { Cache } from "@yaredfall/memcache";
import { got, type Response as GotResponse } from "got";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = "force-dynamic";
export const revalidate = 60 * 60 * 12;

const cache = new Cache<GotResponse<string>>({ defaultTtl: revalidate * 1000 });

export async function GET(request: NextRequest) {
    const search = request.nextUrl.search;
    if (!search.toString().includes("?url=")) {
        return new Response("Please specify the URL in the 'url' query string.", { status: 400 });
    }
    const AJPath = decodeURIComponent(search.replace("?url=", ""));

    let response = cache.get(AJPath);

    if (!response) {
        response = (await got(`${LINKS.pupflare}/?url=${LINKS.animejoy}${AJPath}`, {
            throwHttpErrors: false
        }));
        cache.set(AJPath, response);
    }
    const finalAJUrl = new URL(response.url).search.replace("?url=", "");

    const finalAJPath = finalAJUrl ? decodeURIComponent(((url: URL) => url.pathname + url.search)(new URL(finalAJUrl))) : undefined;

    if (finalAJPath && finalAJPath !== AJPath) {
        console.log({ finalAJPath });
        cache.set(finalAJPath, response);
        const newUrl = request.nextUrl.clone();
        newUrl.searchParams.set("url", finalAJPath);
        return NextResponse.redirect(decodeURIComponent(newUrl.toString()));
    }

    const { headers, body, statusCode } = response;

    return new NextResponse(body, { headers: { "Content-Type": headers["content-type"]! }, status: statusCode });
}