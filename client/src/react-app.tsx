import { StrictMode } from "react";
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';


const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
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
            <RouterProvider router={router} />
        </StrictMode>
    );
}