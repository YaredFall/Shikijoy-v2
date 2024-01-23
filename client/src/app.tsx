import DevHelperPanel from "@/components/dev-helper-panel";
import Aside from "@/components/pages/category/category-aside";
import Header from "@/components/layouts/blocks/header/header";
import CategoryPage from "@/components/pages/category/category-page";
import ShowPage from "@/components/pages/show/show-page";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import "@/index.css";
import { HOME_AS_CATEGORY, SHOW_CATEGORIES } from "@/utils/routing";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import CategoryAside from "@/components/pages/category/category-aside";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Header />
                <Breadcrumbs />
                <Outlet />
                <DevHelperPanel />
            </>
        ),
        children: [
            ...[HOME_AS_CATEGORY, ...SHOW_CATEGORIES].map(category => ({
                path: category.path,
                element: (
                    <>
                        <Outlet />
                        <CategoryAside category={category} />
                    </>
                ),
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
                        element: <ShowPage />,
                    },
                ],
            })),
        ],
    },
]);

const queryClient = new QueryClient();

export default function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}