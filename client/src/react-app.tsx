import DevHelperPanel from "@/components/dev-helper-panel";
import Header from "@/components/layouts/blocks/header/header";
import CategoryPage from "@/components/pages/category/category-page";
import ShowPage from "@/components/pages/show/show-page";
import "@/index.css";
import { HOME_AS_CATEGORY, SHOW_CATEGORIES } from "@/utils/routing";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import { useGlobalLoading } from "@/stores/global-loading";
import LoaderLogo from "@/components/ui/loader-logo";
import AuthCallbackPage from "@/components/pages/auth/auth-callback-page";

const router = createBrowserRouter([
    {
        path: "shikijoy/auth-callback",
        element: <AuthCallbackPage />,
    },
    {
        path: "/",
        element: (
            <>
                <Header />
                <Outlet />
                <DevHelperPanel />
            </>
        ),
        children: [
            ...[HOME_AS_CATEGORY, ...SHOW_CATEGORIES].map(category => ({
                path: category.path,
                children: [
                    {
                        index: true,
                        element: <CategoryPage category={category} />,
                    },
                    {
                        path: "page/:pageIndex",
                        element: <CategoryPage category={category} />,
                    },
                    {
                        path: ":animeID",
                        element: <ShowPage category={category} />,
                    },

                ],
            })),
        ],
    },
]);

const queryClient = new QueryClient();

export default function App() {

    const { isLoading, decrease } = useGlobalLoading(state => ({ isLoading: state.isLoading(), decrease: state.decrease }));

    useEffect(() => {
        decrease();
    }, [decrease]);

    useLayoutEffect(() => {
        if (isLoading) document.body.setAttribute("data-global-loading", "true");
        else document.body.removeAttribute("data-global-loading");
    }, [isLoading]);

    return (
        <QueryClientProvider client={queryClient}>
            {isLoading && <LoaderLogo className={"fixed"} />}
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}