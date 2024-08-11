import { animejoyPageQueryOptions } from "@/animejoy/shared/api";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages")({
    component: () => <Outlet />,
    loader: async ({ context: { queryClient } }) => {
        const data = await queryClient.ensureQueryData(animejoyPageQueryOptions());

        document.title = data.document.title;
        if (data.status === 404) {
            throw notFound();
        }
    },
});