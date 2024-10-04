import Aside from "@client/animejoy/widgets/aside/ui";
import Navbar from "@client/animejoy/widgets/navbar/ui";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_with-loader/_layout")({
    component: RouteComponent,
    loader: async ({ context: { trpcUtils } }) => {
        try {
            await trpcUtils.shikimori.users.whoami.ensureData();
        } catch {
            // TODO: ?
            console.warn("No auth");
        }
    },
});

function RouteComponent() {


    return (
        <>
            <Navbar />
            <main className={"mb-1.5 flex min-h-full flex-col"}>
                <nav className={"h-breadcrumbs-height"}>breadcrumbs</nav>
                <Outlet />
            </main>
            <Aside />
        </>
    );
}