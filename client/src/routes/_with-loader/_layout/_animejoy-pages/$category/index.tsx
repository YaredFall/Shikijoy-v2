import CategoryPage from "@client/pages/category";
import { KnownCategorySchema } from "@client/shared/routing/category";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/$category/",
)({
    component: () => <CategoryPage />,
    parseParams: z.object({ category: KnownCategorySchema }).parse,
    onError: (error) => {
        console.log({ error });
        throw notFound();
    },
});