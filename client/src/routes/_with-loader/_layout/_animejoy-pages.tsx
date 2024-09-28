import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_with-loader/_layout/_animejoy-pages")({
    component: () => <Outlet />,
    loader: async ({ context: { animejoyClientUtils, trpcUtils }, location }) => {
        const data = await animejoyClientUtils.page.ensureData(location.pathname);

        document.title = data.document.title;
        if (data.status === 404) {
            throw notFound();
        }

        try {
            await trpcUtils.shikimori.users.whoami.ensureData();
        } catch {
            // TODO: ?
            console.warn("No auth");
        }
    },
});