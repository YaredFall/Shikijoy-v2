import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {

    const referrer = request.headers.get("referer");

    if (!referrer) {
        return new NextResponse("<h1>Bad request! This route can only be accessed through redirect", {
            status: 400,
        });
    }

    const code = request.nextUrl.searchParams.get("code");

    if ((!code) || Array.isArray(code)) {
        return new NextResponse("<h1>Bad request! Enter 'code' param!</h1>", {
            status: 400,
        });
    }

    return NextResponse.redirect(`${referrer}shikijoy/auth-callback?code=${code}`);

}