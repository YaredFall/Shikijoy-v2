import { getAccessToken } from "@/app/api/shikimori/_utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsedParams = z.object({
        code: z.string().min(1),
    }).safeParse(searchParams);

    if (!parsedParams.success) {
        return new NextResponse("<h1>Bad request! Enter 'code' param!</h1>", {
            status: 400,
        });
    }

    try {
        const data = await getAccessToken(parsedParams.data.code);

        // const response = NextResponse.redirect(`http://localhost:5173/shikijoy/auth-callback?code=${code}`);
        const response = NextResponse.json({ success: true });
        response.cookies.set("shikimori_at", `${data.token_type} ${data.access_token}`, {
            maxAge: data.expires_in,
            path: "/",
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });
        response.cookies.set("shikimori_rt", data.refresh_token, {
            maxAge: 31_536_000,
            path: "/",
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });
        console.log("successful auth", data);

        return response;
    } catch (err) {
        console.error(err);
        return new NextResponse("<h1>Bad request!</h1>", { status: 400 });
    }
}