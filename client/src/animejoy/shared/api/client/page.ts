import { getOriginalPathname, routeQuery, routeUtils } from "@/animejoy/shared/api/client/utils";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { FetchOptions, ofetch } from "ofetch";

const parser = new DOMParser();
export type PageData = { document: Document; pathname: string; status: number; ok: boolean; };

type PageDataTransformer = (data: PageData) => unknown;
export const pageData = {
    "index": {
        200: data => ({}),
    },
    "index.$page": {
        200: data => ({}),
    },
    "$category": {
        200: data => ({}),
    },
    "$category.$page": {
        200: data => ({}),
    },
} satisfies Record<string, Partial<Record<200 | 403 | 404, PageDataTransformer>>>;


const queryKey = (pathname?: string) => ["animejoy", "page", pathname ?? location.pathname];
const queryFn = async (pathname?: string, fetchOptions?: FetchOptions<"text">) => {
    const response = await ofetch.raw(pathname ?? location.pathname, {
        baseURL: EXTERNAL_LINKS.animejoy,
        credentials: "include",
        ignoreResponseError: true,
        ...fetchOptions,
    });

    return ({
        document: parser.parseFromString(response._data, "text/html"),
        pathname: getOriginalPathname(response.url),
        status: response.status,
        ok: response.ok,
    });
};

export const query = routeQuery({
    queryKey,
    queryFn,
});

export const utils = routeUtils({
    queryKey,
    queryFn,
});