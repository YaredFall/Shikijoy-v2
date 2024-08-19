import { trpc } from "@/shared/api/trpc";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/")({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.animejoyClientUtils.page()
    },
});

function RouteComponent() {

    const [data] = trpc.shikimori.anime.byId.useSuspenseQuery({ id: 54632 });

    return (
        <div>
            <div>Homepage</div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}