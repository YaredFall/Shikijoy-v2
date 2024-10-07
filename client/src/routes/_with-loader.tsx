import ShikijoyLogoLoader from "@client/shared/ui/kit/loaders/shikijoy-logo-loader";
import { useGlobalLoading } from "@client/stores/global-loading";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_with-loader")({
    component: RouteComponent,
    pendingComponent: () => <ShikijoyLogoLoader className={"fixed bg-background-primary"} />,
});

function RouteComponent() {

    const isLoading = useGlobalLoading(state => state.isLoading());

    return (
        <>
            <Outlet />
            {isLoading && <ShikijoyLogoLoader className={"fixed bg-background-primary"} />}
        </>
    );
}