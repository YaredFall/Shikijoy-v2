import "@/app/index.css";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";


interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
});

function RootComponent() {

    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    );
}