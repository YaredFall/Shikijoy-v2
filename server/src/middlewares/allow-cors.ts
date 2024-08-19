import { NextRequest, NextResponse } from "next/server";

export function allowCORS(request: NextRequest, response: NextResponse) {

    const origin = request.headers.get("origin");
    const allowHeaders = request.headers.get("Access-Control-Request-Headers");
    response.headers.append("Access-Control-Allow-Origin", origin ?? "*");
    response.headers.append("Access-Control-Allow-Credentials", "true");
    response.headers.append("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    response.headers.append("Access-Control-Allow-Headers", allowHeaders ?? "*");
    console.log(`allowed ${request.method} request from origin ${origin}`);

    return response;
}