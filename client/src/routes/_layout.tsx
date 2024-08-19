import Aside from "@/animejoy/widgets/aside/ui";
import Container from "@/shared/ui/kit/container";
import ShikijoyLogoLoader from "@/shared/ui/kit/loaders/shikijoy-logo-loader";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useShikimoriLogIn } from "../features/auth/shikimoriLogIn";
import { trpc } from "@/shared/api/trpc";

export const Route = createFileRoute("/_layout")({
    component: RouteComponent,
    pendingComponent: () => <ShikijoyLogoLoader className={"fixed"} />,
    // pendingMs: 2000,
    // pendingMinMs: 1000,
});


function RouteComponent() {

    const { data: user } = trpc.shikimori.users.whoami.useQuery();
    const { logIn, logOut } = useShikimoriLogIn();

    return (
        <>
            <div className={"fixed inset-y-0 left-0 w-header-width p-1.5"}>
                <Container className={"flex size-full flex-col gap-2 p-2"}>
                    <Link to={"/"} className={"[&.active]:font-bold"}>
                        Home
                    </Link>
                    <button onClick={() => user ? logOut() : logIn()} className={"[&.active]:font-bold"}>
                        {user ? "Sing Out" : "Sign In"}
                    </button>
                </Container>
            </div>
            <main className={"mb-1.5 flex min-h-full flex-col"}>
                <nav className={"h-breadcrumbs-height"}>
                    breadcrumbs
                </nav>
                <Outlet />
            </main>
            <Aside />
        </>
    );
}