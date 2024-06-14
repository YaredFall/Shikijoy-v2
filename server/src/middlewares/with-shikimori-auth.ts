import { AuthResponse, fetchShikimoriAPI } from "@/app/api/shikimori/_utils";
import { LINKS, ServerError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function withShikimoriAuth(request: NextRequest, response: NextResponse, newRequestHeaders: Headers) {

    console.log("trying to get shikimori auth on route", request.nextUrl.pathname);

    const accessToken = request.cookies.get("shikimori_at")?.value;
    const refreshToken = request.cookies.get("shikimori_rt")?.value;
    if (!accessToken && !refreshToken) {
        return NextResponse.json(new ServerError("ClientError", "Not authorized"), { status: 401 });
    }


    if (!accessToken) {
        const formData = {
            grant_type: "refresh_token",
            client_id: process.env.SHIKIMORI_OAUTH_CLIENT_ID!,
            client_secret: process.env.SHIKIMORI_OAUTH_CLIENT_SECRET!,
            refresh_token: refreshToken,
        };

        try {
            const data = await fetchShikimoriAPI<AuthResponse>(`${LINKS.shikimori}/oauth/token`, { method: "POST", body: formData });

            const accessToken = `${data.token_type} ${data.access_token}`;
            response.cookies.set("shikimori_at", accessToken, {
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
            console.log("successful token refresh", data);

            newRequestHeaders.set("Authorization", accessToken);
            
            return response;
        } catch (error) {
            console.error(error);
            return NextResponse.json(new ServerError("UnhandledError", "Unhandled error", error), { status: 500 });
        }
    } else {
        console.log("request has access token data, skipped refresh");
    }

    newRequestHeaders.set("Authorization", accessToken);
    return response;
}