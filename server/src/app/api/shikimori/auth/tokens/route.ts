import { AuthResponse, fetchShikimoriAPI } from "@/app/api/shikimori/_utils";
import { LINKS } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if ((!code) || Array.isArray(code)) {
        return new NextResponse("<h1>Bad request! Enter 'code' param!</h1>", {
            status: 400,
        });
    }
    const formData = {
        grant_type: "authorization_code",
        client_id: process.env.SHIKIMORI_OAUTH_CLIENT_ID!,
        client_secret: process.env.SHIKIMORI_OAUTH_CLIENT_SECRET!,
        code: code,
        redirect_uri: process.env.SHIKIMORI_OAUTH_REDIRECT_URL!,
    };

    try {
        const data = await fetchShikimoriAPI<AuthResponse>(`${LINKS.shikimori}/oauth/token`, { method: "POST", body: formData });

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
        console.log(err);
        return new NextResponse("<h1>Bad request!</h1>", { status: 400 });
    }


    // try {


    //     return NextResponse.json({ ...data }, { status: 200 });
    // } catch (err) {
    //     if (err instanceof FetchError) {
    //         return NextResponse.json(
    //             new ServerError(err.name, err.message, err.data),
    //             { status: err.status },
    //         );
    //     }

    //     return NextResponse.json(
    //         new ServerError("UnhandledError", "Was not able to fetch shikimori people with id " + id),
    //         { status: 500 },
    //     );
    // }
}