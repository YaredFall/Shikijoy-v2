import { EXTERNAL_LINKS } from "@client/shared/api/utils";
import anyOfSignals from "@client/shared/lib/any-of-signals";
import { UseSuspenseQueryOptions } from "@tanstack/react-query";
import { FetchOptions, ofetch } from "ofetch";
import { defaultShikijoyQueryOptions } from "../defaults";

// export function useShikijoyApi<TData>(
//     pathname: string,
//     options?: Omit<UseQueryOptions<TData, unknown, TData, string[]>, "queryKey" | "queryFn">,
// ) {

//     return useQuery(
//         {
//             queryKey: ["shikijoy-api", pathname],
//             queryFn: async () => {
//                 const data = await ofetch<TData>(pathname, {
//                     baseURL: EXTERNAL_LINKS.shikijoyApi,
//                 });

//                 return data;
//             },
//             ...defaultShikijoyQueryOptions,
//             ...options,
//         },
//     );
// }

export type ShikijoyApiQueryOptions = <TFnData, TData = TFnData>(
    params: {
        path: string;
        fetchOptions?: FetchOptions | undefined;
    }) => UseSuspenseQueryOptions<TFnData, Error, TData, string[]>;


export const shikijoyApiQueryOptions: ShikijoyApiQueryOptions = ({ path, fetchOptions }) => ({
    queryKey: ["shikijoy", "api", path],
    queryFn: async ({ signal }) => {

        const response = await ofetch(path, {
            baseURL: EXTERNAL_LINKS.shikijoyApi,
            credentials: "include",
            ...fetchOptions,
            signal: anyOfSignals(signal, fetchOptions?.signal),
        });

        return response;
    },
    ...defaultShikijoyQueryOptions,
});