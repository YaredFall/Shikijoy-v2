// import CategoryPage from "@client/pages/category";
import { SHOW_CATEGORIES } from "@client/shared/routing/category";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const paramsSchema = z.object({
    category: z.enum(SHOW_CATEGORIES),
});

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/$category",
)({
    params: {
        parse: paramsSchema.parse,
        stringify: params => params,
    },
    loader: async ({ context: { animejoyClientUtils }, location }) => {
        await animejoyClientUtils.page.ensureData(location.pathname);
    },
});