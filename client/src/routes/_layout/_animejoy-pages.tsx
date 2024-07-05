import { animejoyPageQueryKey, fetchAnimejoyPage } from "@/shared/api/animejoy";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages")({
    component: () => <div><p>AJ Pages</p><Outlet /></div>,
    loader: async ({ context: { queryClient } }) => {
        const data = await queryClient.ensureQueryData({
            queryKey: animejoyPageQueryKey(),
            queryFn: ({ signal }) => fetchAnimejoyPage(undefined, { signal }),
        });

        document.title = data.document.title;
        if (data.status === 404) {
            throw notFound();
        }
    },
});