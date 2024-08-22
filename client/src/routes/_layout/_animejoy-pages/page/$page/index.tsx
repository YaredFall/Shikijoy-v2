import CategoryPage from "@/pages/category";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/page/$page/")({
    component: () => <CategoryPage />,
});