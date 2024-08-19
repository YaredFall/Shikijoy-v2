import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import cookie, { CookieSerializeOptions } from "cookie";
import { AccessToken, client } from "node-shikimori";

export type Context = {
    req: Request;
    resHeaders: Headers;
    cookies: {
        get: ((name: string) => string | undefined) | (() => Record<string, string>);
        set: (name: string, value: string, options?: CookieSerializeOptions) => void;
    };
    setAuthCookies: (token: AccessToken) => void;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    shikimoriClient: ReturnType<typeof client>;
};

export async function createContext(
    { req, resHeaders }: FetchCreateContextFnOptions,
): Promise<Context> {

    function getReqCookie(): Record<string, string>;
    function getReqCookie(name: string): string | undefined;
    function getReqCookie(name?: string) {
        if (typeof name !== "undefined") return getCookie(req, name);
        else return getCookies(req);
    }

    const accessToken = getCookie(req, "shikimori_at");
    const refreshToken = getCookie(req, "shikimori_rt");

    const shikimoriClient = client({
        clientName: process.env.SHIKIMORI_CLIENT_NAME,
        token: accessToken,
    });

    const cookies: Context["cookies"] = {
        get: getReqCookie,
        set: (name, value, options) => {
            setCookie(resHeaders, name, value, options);
        },
    };

    const setAuthCookies = (token: AccessToken) => {
        // `${data.token_type} ${data.access_token}`
        cookies.set("shikimori_at", token.access_token!, {
            maxAge: token.expires_in,
            path: "/",
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });
        cookies.set("shikimori_rt", token.refresh_token, {
            maxAge: 31_536_000,
            path: "/",
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });
    };


    return {
        req,
        resHeaders,
        cookies,
        setAuthCookies,
        accessToken,
        refreshToken,
        shikimoriClient,
    };
}

export function getCookies(req: Request) {
    const cookieHeader = req.headers.get("Cookie");
    if (!cookieHeader) return {};
    return cookie.parse(cookieHeader);
}

export function getCookie(req: Request, name: string) {
    const cookieHeader = req.headers.get("Cookie");
    if (!cookieHeader) return;
    const cookies = cookie.parse(cookieHeader);
    return cookies[name];
}

export function setCookie(
    resHeaders: Headers,
    name: string,
    value: string,
    options?: CookieSerializeOptions,
) {
    resHeaders.append("Set-Cookie", cookie.serialize(name, value, options));
}