import {
    getShikimoriID,
    getShikimoriLink,
} from "@client/animejoy/entities/show/scraping";
import { animejoyClient } from "@client/animejoy/shared/api/client";
import { showTransformer } from "@client/animejoy/shared/api/client/page";
import { getAlertMessage, getAnimeIdFromPathname } from "@client/animejoy/shared/scraping";
import ShowPage from "@client/pages/show";
import { preloadPallete } from "@client/shared/hooks/useImagePallete";
import isNullish from "@client/shared/lib/isNullish";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/$category/$showId/",
)({
    component: RouteComponent,
    loader: async ({
        context: { animejoyClientUtils, trpcUtils, queryClient },
        params: { showId },
        location,
    }) => {
        const [page] = await Promise.all([
            animejoyClientUtils.page.ensureData(location.pathname),
            animejoyClientUtils.show.playlist.ensureData({ id: showId }),
        ]);
        const shikimoriAnimeId = getShikimoriID(getShikimoriLink(page.document));
        const animejoyAnimeId = getAnimeIdFromPathname(showId);

        const { info } = showTransformer(page);
        preloadPallete(info.poster, queryClient);

        if (!isNullish(shikimoriAnimeId))
            await Promise.all([
                trpcUtils.shikimori.anime.byId.ensureData({ id: +shikimoriAnimeId }),
                trpcUtils.shikimori.anime.roles.ensureData({ id: +shikimoriAnimeId }),
            ]);

        return {
            shikimoriAnimeId,
            animejoyAnimeId,
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