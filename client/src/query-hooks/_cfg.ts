import { UseQueryOptions } from "react-query";

export const defaultAnimejoyQueryOptions = {
    retry: 1,
    refetchOnWindowFocus: false,
} satisfies UseQueryOptions;