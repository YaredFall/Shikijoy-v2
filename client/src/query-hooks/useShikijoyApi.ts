import ky from "ky";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { EXTERNAL_LINKS } from "@/utils/fetching";

export function useShikijoyApi<TData>(pathname: string, options: Omit<UseQueryOptions<TData, unknown, TData, string[]>, "queryKey" | "queryFn"> = {}) {

    return useQuery(
        {
            queryKey: ["shikijoy-api", pathname],
            queryFn: async () => {
                const url = EXTERNAL_LINKS.shikijoyApi + pathname;
                const data = await ky(url).json<TData>();

                return data;
            },
            retry: false,
            refetchInterval: 12 * 60 * 60 * 1000,
            refetchOnWindowFocus: false,
            ...options,
        },
    );
}