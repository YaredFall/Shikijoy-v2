import { NextRequest, NextResponse } from "next/server";

export function allowCORS(request: NextRequest, response: NextResponse) {
    const origin = request.headers.get("origin");
    response.headers.append("Access-Control-Allow-Origin", origin ?? "*");
    response.headers.append("Access-Control-Allow-Credentials", "true");
    console.log("allowed origin " + origin);

    return response;
}