import { useAnimejoyClientUtils } from "@client/animejoy/shared/api/client";
import "@client/app/index.css";
import { useTRPCUtils } from "@client/shared/api/trpc";
import { ProgressBar } from "@client/shared/ui/progress-bar";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, ScrollRestoration } from "@tanstack/react-router";

interface MyRouterContext {
    queryClient: QueryClient;
    trpcUtils: ReturnType<typeof useTRPCUtils>;
    animejoyClientUtils: ReturnType<typeof useAnimejoyClientUtils>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
    loader: ({ location }) => {
        return { location };
    },
});

function RootComponent() {

    return (
        <>
            <ProgressBar />
            <ScrollRestoration />
            <Outlet />
        </>
    );
}