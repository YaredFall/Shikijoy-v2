import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { AsyncOrSync } from "ts-essentials";
import { createWatchHistoryStorage as createLegacyWatchHistoryStorage } from "./localStorage";
import { createWatchHistoryStorage as createRemoteWatchHistoryStorage } from "./remote";
import { PlaylistEpisode } from "@/animejoy/entities/show/playlist/model";
import { SHIKIJOY_API_QUERY_OPTIONS } from "@/shared/api/shikijoy/query/index";

export interface WatchHistoryStorage {
    setIsWatched: ({ episode, value }: SetIsWatchedParams) => AsyncOrSync<void>;
    getWatchedEpisodes: (episodes: PlaylistEpisode[] | undefined) => AsyncOrSync<Map<string, string>>;

}

function getLastWatchedEpisodeByIndex(watchedEpisodes: PlaylistEpisode[] | undefined): PlaylistEpisode | undefined {
    let maxIndex = -1;
    let result: PlaylistEpisode | undefined = undefined;

    watchedEpisodes?.forEach((we) => {
        if (we.index > maxIndex) {
            maxIndex = we.index;
            result = we;
        }
    });

    return result;
}

export type WatchedEpisodeQueryReturn = {
    watchMap: Map<string, string>;
    watched: PlaylistEpisode[] | undefined;
    watchedIndexes: Set<number> | undefined;
    last: PlaylistEpisode | undefined;
};

export type SetIsWatchedParams = { episode: PlaylistEpisode; value: boolean; timestamp?: string; };

export function useWatchedEpisodeStorage(animejoyAnimeId: string, episodes: PlaylistEpisode[] | undefined) {

    // const { data: shikimoriUser, isLoading: isLoadingShikimoriUser } = useShikimoriUser();
    const { data: shikimoriUser } = useSuspenseQuery(SHIKIJOY_API_QUERY_OPTIONS.shikimori_whoami());

    const legacyWatchHistoryStorage = createLegacyWatchHistoryStorage(animejoyAnimeId);
    const remoteWatchHistoryStorage = createRemoteWatchHistoryStorage(animejoyAnimeId);

    const watchedEpisodesQuery = useQuery<WatchedEpisodeQueryReturn>({
        queryKey: ["watched-episodes", animejoyAnimeId],
        queryFn: async () => {
            const watchMap = await legacyWatchHistoryStorage.getWatchedEpisodes(episodes);

            try {
                if (shikimoriUser) {
                    const remoteWatched = await remoteWatchHistoryStorage.getWatchedEpisodes(episodes);
                    remoteWatched.forEach((timestamp, src) => {
                        const existent = watchMap.get(src);
                        if (!existent) {
                            // remote has more info
                            watchMap.set(src, timestamp);
                            legacyWatchHistoryStorage.setIsWatched({
                                episode: {
                                    src,
                                } as PlaylistEpisode, value: true, timestamp,
                            });

                        } else if (existent !== timestamp) {
                            // timestamps are different
                            console.warn("timestamps are different for ", src);
                        }
                    });

                    if (watchMap.size > remoteWatched.size) {
                        console.warn("some watchstamps not synced with remote storage");
                    }
                }
            } catch {
                console.error("failed to load remote watch history");
                // TODO
            }

            const watched = episodes?.filter(e => watchMap.has(e.src));
            const watchedIndexes = watched && new Set(watched.map(e => e.index));

            return {
                watchMap,
                watched,
                watchedIndexes,
                last: getLastWatchedEpisodeByIndex(watched),
            };
        },
        enabled: !!episodes,
    });

    const setIsWatchedMutation = useMutation({
        mutationKey: ["set-is-watched", animejoyAnimeId],
        mutationFn: async ({ episode, value }: SetIsWatchedParams) => {
            const timestamp = new Date().toISOString();
            legacyWatchHistoryStorage.setIsWatched({ episode, value, timestamp });
            try {
                remoteWatchHistoryStorage.setIsWatched({ episode, value, timestamp });
            } catch {
                console.error("failed to mutate remote watch history");
                // TODO
            }
        },
    });

    return { watchedEpisodesQuery, setIsWatchedMutation };

}