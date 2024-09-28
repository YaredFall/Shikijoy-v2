import ShikijoyLogoLoader from "@/shared/ui/kit/loaders/shikijoy-logo-loader";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_with-loader")({
    component: () => <Outlet />,
    pendingComponent: () => <ShikijoyLogoLoader className={"fixed"} />,
});