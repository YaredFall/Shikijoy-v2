import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getOriginalPathname } from "@/shared/api/animejoy/utils";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { defaultAnimejoyQueryOptions } from "../defaults";

const parser = new DOMParser();

export type PageData = { document: Document; pathname: string; status: number; ok: boolean; };

export const animejoyPageQueryKey = (pathname?: string) => ["animejoy", "page", pathname ?? location.pathname];
export const fetchAnimejoyPage = async (pathname?: string, init?: RequestInit): Promise<PageData> => {
    const url = EXTERNAL_LINKS.animejoy + (pathname ?? location.pathname);

    const response = await fetch(url, { credentials: "include", ...init });
    const htmlString = await response.text();

    return ({
        document: parser.parseFromString(htmlString, "text/html"),
        pathname: getOriginalPathname(response.url),
        status: response.status,
        ok: response.ok,
    });
};

export function useAnimejoyPage<TData = PageData>(
    pathname?: string,
    options?: Omit<UseQueryOptions<PageData, Error, TData, string[]>, "queryFn" | "queryKey">,
) {

    const query = useQuery<PageData, Error, TData, string[]>(
        {
            queryKey: animejoyPageQueryKey(pathname),
            queryFn: async () => await fetchAnimejoyPage(pathname),
            ...defaultAnimejoyQueryOptions,
            ...options,
        },
    );

    return query;
}