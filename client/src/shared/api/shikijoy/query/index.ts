import { ShikijoyAnimeData } from "@/shared/api/shikijoy/types/anime";
import { ShikimoriCharacter, ShikimoriPerson, ShikimoriUser } from "@/shared/api/shikimori/types";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import anyOfSignals from "@/shared/lib/any-of-signals";
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

        const response = await ofetch(path ?? location.pathname, {
            baseURL: EXTERNAL_LINKS.shikijoyApi,
            credentials: "include",
            ...fetchOptions,
            signal: anyOfSignals(signal, fetchOptions?.signal),
        });

        return response;
    },
    ...defaultShikijoyQueryOptions,
});

export const SHIKIJOY_API_QUERY_OPTIONS = {
    shikimori_whoami: <TData = ShikimoriUser | null>() => shikijoyApiQueryOptions<ShikimoriUser | null, TData>({
        path: "/shikimori/users/whoami",
    }),
    shikimori_anime: <TData = ShikijoyAnimeData>(id: number | string) => shikijoyApiQueryOptions<ShikijoyAnimeData, TData>({
        path: `/shikimori/animes/${id}`,
    }),
    shikimori_character: <TData = ShikimoriCharacter>(id: number | string) => shikijoyApiQueryOptions<ShikimoriCharacter, TData>({
        path: `/shikimori/characters/${id}`,
    }),
    shikimori_person: <TData = ShikimoriPerson>(id: number | string) => shikijoyApiQueryOptions<ShikimoriPerson, TData>({
        path: `/shikimori/people/${id}`,
    }),
};

// export const SHIKIJOY_API_ROUTES = {
//     shikimori_anime: (id: number | string) => `/shikimori/animes/${id}`,
//     shikimori_character: (id: number | string) => `/shikimori/characters/${id}`,
//     shikimori_person: (id: number | string) => `/shikimori/people/${id}`,
// } as const;