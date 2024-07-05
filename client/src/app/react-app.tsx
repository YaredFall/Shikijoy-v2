import { StrictMode } from "react";
import { Link, RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "../routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    trailingSlash: "always",
    context: {
        queryClient,
    },
    defaultNotFoundComponent: () => {
        return (
            <div>
                <p className={"text-red-600"}>Not found!</p>
                <Link to={"/"}>Go home</Link>
            </div>
        );
    },
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

export default function App() {

    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </StrictMode>
    );
}