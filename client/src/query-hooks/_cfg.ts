import { UseQueryOptions } from "react-query";

export const defaultAnimejoyQueryOptions = {
    retry: 1,
    refetchInterval: 12 * 60 * 60 * 1000,
    staleTime: 12 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retryOnMount: false,
} as const satisfies UseQueryOptions;