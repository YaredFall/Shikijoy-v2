import { useTRPCUtils } from "@client/shared/api/trpc/index";
import { Link, RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { useQueryClient } from "@tanstack/react-query";
import { useAnimejoyClientUtils } from "@client/animejoy/shared/api/client";

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


// const router = createBrowserRouter([
//     {
//         path: "shikijoy/auth-callback",
//         element: <AuthCallbackPage />,
//     },
//     {
//         path: "/",
//         element: (
//             <>
//                 <Header />
//                 <Outlet />
//                 <DevHelperPanel />
//             </>
//         ),
//         children: [
//             ...[HOME_AS_CATEGORY, ...SHOW_CATEGORIES].map(category => ({
//                 path: category.path,
//                 children: [
//                     {
//                         index: true,
//                         element: <CategoryPage category={category} />,
//                     },
//                     {
//                         path: "page/:pageIndex",
//                         element: <CategoryPage category={category} />,
//                     },
//                     {
//                         path: ":animeID",
//                         element: <ShowPage category={category} />,
//                     },

//                 ],
//             })),
//         ],
//     },
// ]);

export default function AppRouter() {

    const trpcUtils = useTRPCUtils();
    const queryClient = useQueryClient();
    const animejoyClientUtils = useAnimejoyClientUtils();

    return (
        <RouterProvider router={router} context={{ queryClient, trpcUtils, animejoyClientUtils }} />
    );
}