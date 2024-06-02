import { SetIsWatchedParams, WatchHistoryStorage } from "@/entities/animejoy/playlist/api";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import type { NewWatchStamp, WatchStampFilter, WatchStamp } from "@server/lib/drizzle/schema/watch-stamp";
import ky from "ky";

async function getWatchStamps(animejoyAnimeId: string) {
    return await ky.get(`${EXTERNAL_LINKS.shikijoyApi}/shikijoy/watchstamps?animejoy_anime_id=${animejoyAnimeId}`, {
        credentials: "include",
    }).json<WatchStamp[]>();
}

async function createWatchStamp(watchstamp: NewWatchStamp) {
    return await ky.post(
        EXTERNAL_LINKS.shikijoyApi + "/shikijoy/watchstamps",
        {
            credentials: "include",
            body: JSON.stringify(watchstamp),
        },
    );
}

async function deleteWatchStamp(watchstamp: WatchStampFilter) {
    return await ky.delete(
        EXTERNAL_LINKS.shikijoyApi + "/shikijoy/watchstamps",
        {
            credentials: "include",
            body: JSON.stringify(watchstamp),
        },
    );
}

export function createWatchHistoryStorage(animejoyAnimeId: string): WatchHistoryStorage {
    async function setIsWatched({ episode, value, timestamp }: SetIsWatchedParams) {
        if (value) createWatchStamp({
            animejoyAnimeId,
            createdAt: timestamp ?? new Date().toISOString(),
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