import { getShikimoriID, getShikimoriLink } from "@/animejoy/entities/show/scraping";
import { animejoyPageQueryKey } from "@/animejoy/shared/api";
import { PageData } from "@/animejoy/shared/api/query/page";
import { animejoyShowPlaylistQueryOptions } from "@/animejoy/shared/api/query/playlist";
import { getAlertMessage } from "@/animejoy/shared/scraping";
import ShowPage from "@/pages/show";
import { SHIKIJOY_API_QUERY_OPTIONS } from "@/shared/api/shikijoy/query";
import isNullish from "@/shared/lib/isNullish";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/$category/$showId/")({
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params: { showId } }) => {
        const pageData = await queryClient.ensureQueryData<PageData>({ queryKey: animejoyPageQueryKey() });
        console.log("awaited", pageData);

        const alert = getAlertMessage(pageData.document);

        // TODO: parallel fetches
        await queryClient.ensureQueryData(animejoyShowPlaylistQueryOptions({
            id: showId,
        }));
        const shikimoriAnimeId = getShikimoriID(getShikimoriLink(pageData.document));

        if (!isNullish(shikimoriAnimeId)) await queryClient.ensureQueryData(SHIKIJOY_API_QUERY_OPTIONS.shikimori_anime(shikimoriAnimeId));

        return {
            shikimoriAnimeId,
            alert,
        };
    },
});

function RouteComponent() {
    const { alert } = Route.useLoaderData();

    if (!isNullish(alert)) return JSON.stringify(alert);

    return (
        <ShowPage />
    );
}