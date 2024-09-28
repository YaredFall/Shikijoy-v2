import CategoryPage from "@/pages/category";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/$category/page/$page/",
)({
    component: () => <CategoryPage />,
});