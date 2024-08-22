import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages")({
    component: () => <Outlet />,
    loader: async ({ context: { animejoyClientUtils }, location }) => {
        const data = await animejoyClientUtils.page.ensureData(location.pathname);

        document.title = data.document.title;
        if (data.status === 404) {
            throw notFound();
        }
    },
});