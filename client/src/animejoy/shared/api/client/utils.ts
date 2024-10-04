import { defaultAnimejoyQueryOptions } from "@client/animejoy/shared/api/defaults";
import anyOfSignals from "@client/shared/lib/any-of-signals";
import { FetchQueryOptions, QueryClient, RefetchOptions, Updater, useQuery, UseQueryOptions, useSuspenseQuery, UseSuspenseQueryOptions } from "@tanstack/react-query";
import { FetchOptions } from "ofetch";

export function getOriginalPathname(url: string) {
    const urlObject = new URL(url);

    return process.env.NODE_ENV === "production" ? urlObject.pathname + urlObject.search : urlObject.search.replace("?url=", "");
}
type CleanOptions<T, TFetchOptions extends FetchOptions> = Omit<T, "queryKey" | "queryFn"> & {
    fetch?: TFetchOptions;
};

type FetchClientQueryOptions<TFnData, TFetchOptions extends FetchOptions, TData = TFnData> = CleanOptions<FetchQueryOptions<TFnData, Error, TData, string[]>, TFetchOptions>;
type RefetchClientQueryOptions<TFetchOptions extends FetchOptions> = CleanOptions<RefetchOptions, TFetchOptions>;
type ResetClientQueryOptions<TFetchOptions extends FetchOptions> = CleanOptions<RefetchOptions, TFetchOptions>;

export const fetchQueryOptions = <TFnData, TFetchOptions extends FetchOptions, TData = TFnData, TInput = void>({ queryKey, queryFn, input, options }: {
    queryKey: (input: TInput) => string[];
    queryFn: (input: TInput, options?: TFetchOptions) => TFnData | Promise<TFnData>;
    input: TInput;
    options?: FetchClientQueryOptions<TFnData, TFetchOptions, TData>;
}): FetchQueryOptions<TFnData, Error, TData, string[]> => ({
    ...defaultAnimejoyQueryOptions,
    ...options,
    queryKey: queryKey(input),
    queryFn: ({ signal }: { signal: AbortSignal; }) => queryFn(input, {
        ...options?.fetch,
        signal: anyOfSignals(signal, options?.fetch?.signal),
    } as TFetchOptions),
});

export const routeUtils = <TData, TFetchOptions extends FetchOptions, TInput = void>({ queryFn, queryKey }: {
    queryFn: (input: TInput, options?: TFetchOptions) => TData;
    queryKey: (input: TInput) => string[];
}) => (queryClient: QueryClient) => ({
    cancel: (input: TInput) => queryClient.cancelQueries(fetchQueryOptions({ queryKey, queryFn, input })),
    ensureData: (input: TInput, options?: FetchClientQueryOptions<TData, TFetchOptions>) => queryClient.ensureQueryData(fetchQueryOptions({ queryKey, queryFn, input, options })),
    fetch: (input: TInput, options?: FetchClientQueryOptions<TData, TFetchOptions>) => queryClient.fetchQuery(fetchQueryOptions({ queryKey, queryFn, input, options })),
    getData: (input: TInput) => queryClient.getQueryData(queryKey(input)),
    prefetch: (input: TInput, options?: FetchClientQueryOptions<TData, TFetchOptions>) => queryClient.prefetchQuery(fetchQueryOptions({ queryKey, queryFn, input, options })),
    refetch: (input: TInput, options?: RefetchClientQueryOptions<TFetchOptions>) => queryClient.refetchQueries(fetchQueryOptions({ queryKey, queryFn, input, options })),
    reset: (input: TInput, options?: ResetClientQueryOptions<TFetchOptions>) => queryClient.refetchQueries({
        ...options,
        queryKey: queryKey(input),
    }),
    setData: (input: TInput, updater?: Updater<TData, TData>) => queryClient.setQueryData(queryKey(input), updater),
});


export type ClientQueryOptions<TFnData, TFetchOptions extends FetchOptions, TData = TFnData> = CleanOptions<UseQueryOptions<TFnData, Error, TData, string[]>, TFetchOptions>;

export type ClientSuspenseQueryOptions<TFnData, TFetchOptions extends FetchOptions, TData = TFnData> = CleanOptions<UseSuspenseQueryOptions<TFnData, Error, TData, string[]>, TFetchOptions>;

const useQueryOptions = <TFnData, TFetchOptions extends FetchOptions, TData = TFnData, TInput = void>(params: {
    queryKey: (input: TInput) => string[];
    queryFn: (input: TInput, options?: TFetchOptions) => TFnData | Promise<TFnData>;
    input: TInput;
    options?: ClientQueryOptions<TFnData, TFetchOptions, TData>;
}): UseQueryOptions<TFnData, Error, TData, string[]> => fetchQueryOptions(params);

export const routeQuery = <TFnData, TFetchOptions extends FetchOptions, TInput = void>({
    queryKey,
    queryFn,
}: {
    queryKey: (input: TInput) => string[];
    queryFn: (input: TInput, options?: TFetchOptions) => TFnData | Promise<TFnData>;
}) => ({
    useQuery: <TData = TFnData>(input: TInput, options?: ClientQueryOptions<TFnData, TFetchOptions, TData>) => useQuery(useQueryOptions({ queryKey, queryFn, input, options })),
    useSuspenseQuery: <TData = TFnData>(input: TInput, options?: ClientSuspenseQueryOptions<TFnData, TFetchOptions, TData>) => {
        const query = useSuspenseQuery(useQueryOptions({ queryKey, queryFn, input, options }));
        return [query.data, query] as const;
    },
});