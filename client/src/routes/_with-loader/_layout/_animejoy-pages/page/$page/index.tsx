import CategoryPage from "@/pages/category";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/page/$page/",
)({
    component: () => <CategoryPage />,
    loader: async ({ context: { animejoyClientUtils }, location }) => {
        await animejoyClientUtils.page.ensureData(location.pathname);
    },
});