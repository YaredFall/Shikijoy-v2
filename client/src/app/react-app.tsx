import AppRouter from "@client/app/router";
import { trpc, trpcClient } from "@client/shared/api/trpc/index";
import type { AppRouter as TRPCAppRouter } from "@server/trpc/routers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { StrictMode } from "react";

const shouldRetry = (error: unknown) => {
    if (error instanceof TRPCClientError) {
        const code = (error as TRPCClientError<TRPCAppRouter>).data?.httpStatus;
        if (code && (code === 429 || code >= 500)) return true;
    }
    return false;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3_600_000,
            retry: false,
            refetchOnMount: (query) => {
                const error = query.state.error;
                if (shouldRetry(error)) return true;
                return false;
            },
            refetchOnWindowFocus: (query) => {
                const error = query.state.error;
                if (shouldRetry(error)) return true;
                return false;
            },
            // retryOnMount: false,
        },
    },
});

export default function App() {

    return (
        <StrictMode>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <AppRouter />
                </QueryClientProvider>
            </trpc.Provider>
        </StrictMode>
    );
}