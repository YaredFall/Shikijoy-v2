import { SetIsWatchedParams, WatchHistoryStorage } from "@/entities/animejoy/playlist/api";
import { PlaylistEpisode } from "@/entities/animejoy/playlist/model";

export function createWatchHistoryStorage(animejoyAnimeId: string): WatchHistoryStorage {
    function constructLocalStorageKey(src: string) {
        return `playlists-${animejoyAnimeId}-playlist-${src}`;
    }

    function setIsWatched({ episode, value, timestamp }: SetIsWatchedParams) {
        const key = constructLocalStorageKey(episode.src);
        if (value) localStorage.setItem(key, timestamp ?? new Date().toISOString());
        else localStorage.removeItem(key);
    }

    function getWatchedEpisodes(episodes: PlaylistEpisode[] | undefined) {
        return episodes?.reduce((acc, episode) => {
            const timestamp = localStorage.getItem(constructLocalStorageKey(episode.src));
            if (timestamp) acc.set(episode.src, timestamp);
            return acc;
        }, new Map<string, string>()) ?? new Map<string, string>();

    }

    return {
        setIsWatched,
        getWatchedEpisodes,
    };
}