import { getNavigationPagesCount, getShowsList } from "@/animejoy/entities/category/scraping";
import { getExternalLinks, getFranchise, getScreenshots, getShowInfo, getShowTitle } from "@/animejoy/entities/show/scraping";
import { ClientQueryOptions, ClientSuspenseQueryOptions, fetchQueryOptions, getOriginalPathname, routeUtils } from "@/animejoy/shared/api/client/utils";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { FetchOptions, ofetch } from "ofetch";
import { useMemo } from "react";

const parser = new DOMParser();
export type PageData = { document: Document; pathname: string; status: number; ok: boolean; };

export const categoryTransformer = (data: PageData) => ({
    stories: getShowsList(data.document),
    pagesCount: getNavigationPagesCount(data.document),
});

export const showTransformer = (data: PageData) => ({
    title: getShowTitle(data.document),
    info: getShowInfo(data.document),
    externalLinks: getExternalLinks(data.document),
    franchise: getFranchise(data.document),
    screenshots: getScreenshots(data.document),
});


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

// export const query = routeQuery({
//     queryKey,
//     queryFn,
// });
type FetchOptionsText = FetchOptions<"text">;
export const query = {
    useQuery: <TFetchOptions extends FetchOptionsText, TData = PageData>(pathname?: string, options?: ClientQueryOptions<PageData, TFetchOptions, TData>) => {
        const input = pathname ?? location.pathname;
        return useQuery<PageData, Error, TData, string[]>(fetchQueryOptions({
            queryKey,
            queryFn,
            input,
            options,
        }));

    },
    useSuspenseQuery: <TFetchOptions extends FetchOptionsText, TData = PageData>(pathname?: string, options?: ClientSuspenseQueryOptions<PageData, TFetchOptions, TData>) => {
        const input = useMemo(() => {
            const input = pathname ?? location.pathname;
            console.log(input);
            return input;
        }, [pathname]);
        const query = useSuspenseQuery<PageData, Error, TData, string[]>(fetchQueryOptions({
            queryKey,
            queryFn,
            input,
            options,
        }));
        return [query.data, query] as const;
    },
};

export const utils = routeUtils({
    queryKey,
    queryFn,
});