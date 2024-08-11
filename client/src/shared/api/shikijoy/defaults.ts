import { UseQueryOptions } from "@tanstack/react-query";

export const defaultShikijoyQueryOptions = {
    retry: false,
    retryOnMount: false,
    refetchInterval: 12 * 60 * 60 * 1000,
    staleTime: 12 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
} as const satisfies Partial<UseQueryOptions>;