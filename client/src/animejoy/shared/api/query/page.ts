import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { UseSuspenseQueryOptions } from "@tanstack/react-query";
import { FetchOptions, ofetch } from "ofetch";
import { defaultAnimejoyQueryOptions } from "../defaults";
import anyOfSignals from "@/shared/lib/any-of-signals";

function getOriginalPathname(url: string) {
    const urlObject = new URL(url);

    return process.env.NODE_ENV === "production" ? urlObject.pathname + urlObject.search : urlObject.search.replace("?url=", "");
}

const parser = new DOMParser();

export type PageData = { document: Document; pathname: string; status: number; ok: boolean; };

export const animejoyPageQueryKey = (pathname?: string) => ["animejoy", "page", pathname ?? location.pathname];
// export const fetchAnimejoyPage = async (pathname?: string, init?: RequestInit): Promise<PageData> => {
//     const url = EXTERNAL_LINKS.animejoy + (pathname ?? location.pathname);

//     const response = await fetch(url, { credentials: "include", ...init });
//     const htmlString = await response.text();

//     return ({
//         document: parser.parseFromString(htmlString, "text/html"),
//         pathname: getOriginalPathname(response.url),
//         status: response.status,
//         ok: response.ok,
//     });
// };

export type AnimejoyPageQueryOptions<TData = PageData> = (params?: {
    pathname?: string;
    fetchOptions?: FetchOptions<"text"> | undefined;
}) => UseSuspenseQueryOptions<PageData, Error, TData, string[]>;

export const animejoyPageQueryOptions: AnimejoyPageQueryOptions = ({ pathname, fetchOptions } = {}) => ({
    queryKey: animejoyPageQueryKey(pathname),
    queryFn: async ({ signal }) => {

        const response = await ofetch.raw(pathname ?? location.pathname, {
            baseURL: EXTERNAL_LINKS.animejoy,
            credentials: "include",
            ignoreResponseError: true,
            ...fetchOptions,
            signal: anyOfSignals(signal, fetchOptions?.signal),
        });

        return ({
            document: parser.parseFromString(response._data, "text/html"),
            pathname: getOriginalPathname(response.url),
            status: response.status,
            ok: response.ok,
        });
    },
    ...defaultAnimejoyQueryOptions,
});

// export function useAnimejoyPage<TData = PageData>(
//     pathname?: string,
//     options?: Omit<UseQueryOptions<PageData, Error, TData, string[]>, "queryFn" | "queryKey">,
// ) {

//     return useQuery<PageData, Error, TData, string[]>(
//         {
//             queryKey: animejoyPageQueryKey(pathname),
//             queryFn: async () => await fetchAnimejoyPage(pathname),
//             ...defaultAnimejoyQueryOptions,
//             ...options,
//         },
//     );
// }

// export function usePreloadedAnimejoyPage<TData = PageData>(
//     pathname?: string,
//     options?: Omit<UseSuspenseQueryOptions<PageData, Error, TData, string[]>, "queryFn" | "queryKey">,
// ) {

//     return useSuspenseQuery<PageData, Error, TData, string[]>(
//         {
//             queryKey: animejoyPageQueryKey(pathname),
//             queryFn: async () => await fetchAnimejoyPage(pathname),
//             ...defaultAnimejoyQueryOptions,
//             ...options,
//         },
//     );
// }