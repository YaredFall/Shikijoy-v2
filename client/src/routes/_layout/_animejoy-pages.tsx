import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages")({
    component: () => <Outlet />,
    loader: async ({ context: { animejoyClientUtils } }) => {
        const data = await animejoyClientUtils.page.ensureData();

        document.title = data.document.title;
        if (data.status === 404) {
            throw notFound();
        }
    },
});