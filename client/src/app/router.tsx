import { useAnimejoyClientUtils } from "@client/animejoy/shared/api/client";
import { useTRPCUtils } from "@client/shared/api/trpc/index";
import { useQueryClient } from "@tanstack/react-query";
import { Link, RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";

const router = createRouter({
    routeTree,
    trailingSlash: "always",
    context: {
        queryClient: undefined!,
        trpcUtils: undefined!,
        animejoyClientUtils: undefined!,
    },
    defaultNotFoundComponent: () => {
        return (
            <div>
                <p className={"text-red-600"}>Not found!</p>
                <Link to={"/"}>Go home</Link>
            </div>
        );
    },
    defaultPendingMs: 0,
    defaultPendingMinMs: 0,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default function AppRouter() {

    const trpcUtils = useTRPCUtils();
    const queryClient = useQueryClient();
    const animejoyClientUtils = useAnimejoyClientUtils();

    return (
        <RouterProvider router={router} context={{ queryClient, trpcUtils, animejoyClientUtils }} />
    );
}