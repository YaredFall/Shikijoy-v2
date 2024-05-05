import { LINKS } from "@/utils";
import { FetchOptions, ofetch } from "ofetch";

export type AuthResponse = {
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
    refresh_token: string;
    scope: string;
    created_at: number;
};

const baseURL = LINKS.shikimori;
const baseApiURL = baseURL + "/api";
const defaultHeaders = {
    "User-Agent": "ShikiJoy",
};

export async function fetchShikimoriAPI<TData = unknown>(route: string, options?: FetchOptions<"json">) {
    let url = route;
    if (!route.startsWith(baseURL) && !route.startsWith(baseApiURL)) {
        if (!route.startsWith("/")) {
            url = baseApiURL + "/" + route;
        } else {
            url = baseApiURL + route;
        }
    }

    try {
        const reqOptions = {
            timeout: 5000,
            retry: 2,
            ...options,
            headers: {
                ...defaultHeaders,
                ...options?.headers,
            },
        } satisfies FetchOptions<"json">;
        const data = await ofetch<TData>(url, reqOptions);
        return data;
    } catch (err: unknown) {
        console.log("failed to fetch " + url + " with error " + err?.toString());
        throw err;
    }
}