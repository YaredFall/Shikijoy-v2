import { refreshAccessToken } from "@server/app/api/shikimori/_utils";
import { TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import { AccessToken, APIError, client, User } from "node-shikimori";

const refreshPromiseMap = new Map<string, Promise<AccessToken>>();

export type Context = {
    req: Request;
    resHeaders: Headers;
    setTokens: (token: AccessToken) => void;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    shikimoriClient: ReturnType<typeof client>;
    user: User | null;
};

export async function createContext(
    { req, resHeaders }: FetchCreateContextFnOptions,
): Promise<Context> {

    const cookie = cookies();

    let accessToken = cookie.get("shikimori_at")?.value;
    let refreshToken = cookie.get("shikimori_rt")?.value;

    const shikimoriClient = client({
        clientName: process.env.SHIKIMORI_CLIENT_NAME,
        token: accessToken,
    });

    const setTokens = (token: AccessToken) => {
        // `${data.token_type} ${data.access_token}`
        cookie.set("shikimori_at", token.access_token!, {
            maxAge: token.expires_in,
            path: "/",
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });
        cookie.set("shikimori_rt", token.refresh_token, {
            maxAge: 31_536_000,
            path: "/",
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });

        accessToken = token.access_token;
        refreshToken = token.refresh_token;

        shikimoriClient.setAccessToken(accessToken);
    };


    function purgeTokens() {
        cookie.set("shikimori_at", "", {
            maxAge: 0,
            path: "/",
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });
        cookie.set("shikimori_rt", "", {
            maxAge: 0,
            path: "/",
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });

        accessToken = undefined;
        refreshToken = undefined;

        shikimoriClient.setAccessToken(undefined);
    }

    async function ensureFreshToken() {
        if (refreshToken) {
            console.log("ensuring fresh token...", new Date().getMilliseconds());
            try {
                let currentRefreshPromise = refreshPromiseMap.get(refreshToken);
                if (!currentRefreshPromise) {
                    const key = refreshToken;
                    currentRefreshPromise = refreshAccessToken(key);
                    refreshPromiseMap.set(key, currentRefreshPromise);

                    // ? I'm not sure about this 1000ms window, but...
                    setTimeout(() => {
                        refreshPromiseMap.delete(key);
                    }, 1000);
                } else {
                    console.log("REFRESH ALREADY IN PROCESS OR JUST HAPPENED, HOOKING INTO IT!");
                }

                const token = await currentRefreshPromise;

                setTokens(token);
            } catch (error) {
                console.log("should purge tokens because of invalid refresh token");
                purgeTokens();
            }
        }
    }

    // returns current user or purges invalid tokens to avoid auth errors
    async function ensureValidAuth() {

        if (!accessToken && !refreshToken) return null;

        if (!accessToken) await ensureFreshToken();

        try {
            const user = await shikimoriClient.users.whoami();
            console.log("auth is fine!", accessToken, refreshToken);
            return user;
        } catch (error) {
            if (error instanceof APIError) {
                if (error.response?.status === 401) {
                    console.log("should purge tokens because of invalid access token");
                    purgeTokens();

                    return null;
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Unexpected Shikimori API error: ${error.message}`,
                    cause: error.cause,
                });
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Unexpected Shikimori API error: ${error}`,
                cause: error,
            });
        }
    }

    const user = await ensureValidAuth();

    return {
        req,
        resHeaders,
        setTokens,
        accessToken,
        refreshToken,
        shikimoriClient,
        user,
    };
}