import {
    getShikimoriID,
    getShikimoriLink,
} from "@/animejoy/entities/show/scraping";
import { animejoyClient } from "@/animejoy/shared/api/client";
import { getAlertMessage } from "@/animejoy/shared/scraping";
import ShowPage from "@/pages/show";
import isNullish from "@/shared/lib/isNullish";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/$category/$showId/",
)({
    component: RouteComponent,
    loader: async ({
        context: { animejoyClientUtils, trpcUtils },
        params: { showId },
        location,
    }) => {
        const [page] = await Promise.all([
            animejoyClientUtils.page.ensureData(location.pathname),
            animejoyClientUtils.show.playlist.ensureData({ id: showId }),
        ]);
        const shikimoriAnimeId = getShikimoriID(getShikimoriLink(page.document));

        console.log({ shikimoriAnimeId });

        if (!isNullish(shikimoriAnimeId))
            await Promise.all([
                trpcUtils.shikimori.anime.byId.ensureData({ id: +shikimoriAnimeId }),
                trpcUtils.shikimori.anime.roles.ensureData({ id: +shikimoriAnimeId }),
            ]);

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

    return <ShowPage />;
}