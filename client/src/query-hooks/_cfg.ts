import { UseQueryOptions } from "react-query";

export const defaultAnimejoyQueryOptions = {
    retry: 2,
    refetchOnWindowFocus: false,
} satisfies UseQueryOptions;