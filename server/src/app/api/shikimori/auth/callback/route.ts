import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if ((!code) || Array.isArray(code)) {
        return new NextResponse("<h1>Bad request! Enter 'code' param!</h1>", {
            status: 400,
        });
    }

    return NextResponse.redirect(`http://localhost:5173/shikijoy/auth-callback?code=${code}`);
}