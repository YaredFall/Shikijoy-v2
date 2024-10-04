import { SetIsWatchedParams, WatchHistoryStorage } from "@client/animejoy/entities/show/playlist/api";
import { getAnimeIdFromPathname } from "@client/animejoy/shared/scraping";
import { EXTERNAL_LINKS } from "@client/shared/api/utils";
import type { NewWatchStamp, WatchStampFilter, WatchStamp } from "@server/lib/drizzle/schema/watch-stamp";
import { ofetch } from "ofetch";

async function getWatchStamps(animejoyAnimeId: string) {
    return await ofetch<WatchStamp[]>(
        `${EXTERNAL_LINKS.shikijoyApi}/shikijoy/watchstamps?animejoy_anime_id=${getAnimeIdFromPathname(animejoyAnimeId)}`,
        {
            credentials: "include",
        },
    );
}

async function createWatchStamp(watchstamp: NewWatchStamp) {
    return await ofetch(
        EXTERNAL_LINKS.shikijoyApi + "/shikijoy/watchstamps",
        {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(watchstamp),
        },
    );
}

async function deleteWatchStamp(watchstamp: WatchStampFilter) {
    return await ofetch(
        EXTERNAL_LINKS.shikijoyApi + "/shikijoy/watchstamps",
        {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify(watchstamp),
        },
    );
}

export function createWatchHistoryStorage(animejoyAnimeId: string): WatchHistoryStorage {
    async function setIsWatched({ episode, value, timestamp }: SetIsWatchedParams) {
        if (value) createWatchStamp({
            animejoyAnimeId,
            createdAt: timestamp,
            src: episode.src,
        });
        else deleteWatchStamp({
            animejoyAnimeId,
            src: episode.src,
        });
    }

    async function getWatchedEpisodes(/* episodes: PlaylistEpisode[] | undefined */) {
        const watchstamps = await getWatchStamps(animejoyAnimeId);
        return new Map(watchstamps.map(stamp => [stamp.src, stamp.createdAt]));

        // return episodes?.reduce((acc, episode) => {
        //     const timestamp = watchstampsMap.get(episode.src);
        //     if (timestamp) acc.push({ ...episode, timestamp });
        //     return acc;
        // }, new Array<WatchedEpisode>());
    }

    return {
        setIsWatched,
        getWatchedEpisodes,
    };
}