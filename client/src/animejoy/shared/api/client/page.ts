import { getNavigationPagesCount, getShowsList } from "@/animejoy/entities/category/scraping";
import { getOriginalPathname, routeQuery, routeUtils } from "@/animejoy/shared/api/client/utils";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { FetchOptions, ofetch } from "ofetch";

const parser = new DOMParser();
export type PageData = { document: Document; pathname: string; status: number; ok: boolean; };

const categoryTransformer = (data: PageData) => ({
    stories: getShowsList(data.document),
    pagesCount: getNavigationPagesCount(data.document),
});

type PageDataTransformer = (data: PageData) => unknown;
export const pageDataTransformer = {
    "undefined": {
        200: data => data,
    },
    "index": {
        200: categoryTransformer,
    },
    "index.$page": {
        200: categoryTransformer,
    },
    "$category": {
        200: categoryTransformer,
    },
    "$category.$page": {
        200: categoryTransformer,
    },
} satisfies Record<string, Partial<Record<number, PageDataTransformer>>>;


const queryKey = (pathname?: string) => ["animejoy", "page", pathname ?? location.pathname];
const queryFn = async (pathname?: string, fetchOptions?: FetchOptions<"text">) => {
    const response = await ofetch.raw(pathname ?? location.pathname, {
        baseURL: EXTERNAL_LINKS.animejoy,
        credentials: "include",
        ignoreResponseError: true,
        ...fetchOptions,
    });

    return {
        document: parser.parseFromString(response._data, "text/html"),
        pathname: getOriginalPathname(response.url),
        status: response.status,
        ok: response.ok,
    };
};

export const query = routeQuery({
    queryKey,
    queryFn,
});

export const utils = routeUtils({
    queryKey,
    queryFn,
});