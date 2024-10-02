import ShikijoyLogoLoader from "@/shared/ui/kit/loaders/shikijoy-logo-loader";
import { useGlobalLoading } from "@/stores/global-loading";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_with-loader")({
    component: RouteComponent,
    pendingComponent: () => <ShikijoyLogoLoader className={"fixed"} />,
});

function RouteComponent() {

    const isLoading = useGlobalLoading(state => state.isLoading());

    return (
        <>
            <Outlet />
            {isLoading && <ShikijoyLogoLoader className={"fixed"} />}
        </>
    );
}