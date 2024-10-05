import CategoryPage from "@client/pages/category";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/$category/page/$page/",
)({
    component: () => <CategoryPage />,
    loader: async ({ context: { animejoyClientUtils }, location }) => {
        await animejoyClientUtils.page.ensureData(location.pathname);
    },
});