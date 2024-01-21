import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./components/nav/header";
import CategoryPage from "./components/pages/category/category-page";
import ShowPage from "./components/pages/show/show-page";
import "./index.css";
import DevHelperPanel from "./components/dev-helper-panel";
import { HOME_AS_CATEGORY, SHOW_CATEGORIES } from "./utils";


const router = createBrowserRouter([
    {
        path: "/",
        element: <><Header /><Outlet /><DevHelperPanel /></>,
        children: [
            {
                index: true,
                element: <CategoryPage category={HOME_AS_CATEGORY} />
            },
            {
                path: "page/:pageIndex",
                element: <CategoryPage category={HOME_AS_CATEGORY} />
            },
            ...SHOW_CATEGORIES.map(category => ({
                path: category.path,
                children: [
                    {
                        index: true,
                        element: <CategoryPage category={category} />
                    },
                    {
                        path: "page/:pageIndex",
                        element: <CategoryPage category={category} />
                    },
                    {
                        path: ":animeID",
                        element: <ShowPage />
                    }
                ]
            })),
        ]
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