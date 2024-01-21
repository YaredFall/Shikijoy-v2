import { NextResponse, NextRequest } from "next/server";
import { allowCORS } from "@/middlewares/allow-cors";

export default function middleware(request: NextRequest) {
    // console.log(request.nextUrl.pathname);

    let response = NextResponse.next();

    if (request.nextUrl.pathname.startsWith("/api")) {
        response = allowCORS(request, response);
    }

    return response;
}