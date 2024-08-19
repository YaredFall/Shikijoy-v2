import AppRouter from "@/app/router";
import { trpc, trpcClient } from "@/shared/api/trpc/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3_600_000,
            retry: 1,
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