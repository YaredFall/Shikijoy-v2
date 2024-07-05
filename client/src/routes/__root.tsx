import "@/app/index.css";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useGlobalLoading } from "@/stores/global-loading";
import { useEffect, useLayoutEffect } from "react";
import ShikijoyLogoLoader from "@/shared/ui/kit/loaders/shikijoy-logo-loader";
import { QueryClient } from "@tanstack/react-query";


interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,

});

function RootComponent() {
    const { isLoading, decrease } = useGlobalLoading(state => ({ isLoading: state.isLoading(), decrease: state.decrease }));

    useEffect(() => {
        decrease();
    }, [decrease]);

    useLayoutEffect(() => {
        if (isLoading) document.body.setAttribute("data-global-loading", "true");
        else document.body.removeAttribute("data-global-loading");
    }, [isLoading]);

    return (
        <>
            {isLoading && <ShikijoyLogoLoader className={"fixed"} />}
            <div className={"flex gap-2 p-2"}>
                <Link to={"/"} className={"[&.active]:font-bold"}>
                    Home
                </Link>
            </div>
            <hr />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    );
}