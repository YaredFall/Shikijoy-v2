import { getShikimoriID, getShikimoriLink } from "@/animejoy/entities/show/scraping";
import { animejoyClient } from "@/animejoy/shared/api/client";
import { getAlertMessage } from "@/animejoy/shared/scraping";
import ShowPage from "@/pages/show";
import isNullish from "@/shared/lib/isNullish";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/$category/$showId/")({
    component: RouteComponent,
    loader: async ({ context: { animejoyClientUtils, trpcUtils }, params: { showId } }) => {
        const [pageData] = await Promise.all([animejoyClientUtils.page.ensureData(undefined), animejoyClientUtils.show.playlist.ensureData({ id: showId })]);
        const shikimoriAnimeId = getShikimoriID(getShikimoriLink(pageData.document));

        if (!isNullish(shikimoriAnimeId)) await trpcUtils.shikimori.anime.byId.ensureData({ id: +shikimoriAnimeId });

        return {
            shikimoriAnimeId,
        };
    },
});

function RouteComponent() {
    const [{ alert }] = animejoyClient.page.useSuspenseQuery(undefined, {
        select: data => ({
            alert: getAlertMessage(data.document),
        }),
    });

    if (!isNullish(alert)) return JSON.stringify(alert);

    return (
        <ShowPage />
    );
}