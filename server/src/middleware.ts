import { NextResponse, NextRequest } from "next/server";
import { allowCORS } from "@/middlewares/allow-cors";
// import { withShikimoriAuth } from "@/middlewares/with-shikimori-auth";

export default async function middleware(request: NextRequest) {
    // console.log(request.nextUrl.pathname);

    const response = NextResponse.next();
    const requestHeaders = new Headers(request.headers);

    if (request.nextUrl.pathname.startsWith("/api")) {
        allowCORS(request, response);
    }
    // if (request.nextUrl.pathname.startsWith("/api/shikimori/users") || request.nextUrl.pathname.startsWith("/api/shikijoy")) {
    //     await withShikimoriAuth(request, response, requestHeaders);
    // }
    if (request.method === "OPTIONS") return response;

    return NextResponse.next(Object.assign(response, { request: { headers: requestHeaders } }));
}