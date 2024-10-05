import CategoryPage from "@client/pages/category";
import { KnownCategorySchema } from "@client/shared/routing/category";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/$category/",
)({
    params: {
        parse: z.object({ category: KnownCategorySchema }).parse,
        stringify: params => params,
    },
    component: () => <CategoryPage />,
    loader: async ({ context: { animejoyClientUtils }, location }) => {
        await animejoyClientUtils.page.ensureData(location.pathname);
    },
    onError: (error) => {
        console.log({ error });
        throw notFound();
    },
});