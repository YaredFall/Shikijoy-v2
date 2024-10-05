import { PlaylistEpisode } from "@client/animejoy/entities/show/playlist/model";
import { useCallback, useMemo } from "react";

export function useLocalWathcstamps(animejoyAnimeId: string, episodes: PlaylistEpisode[] | undefined) {

    const constructLocalStorageKey = useCallback((src: string) => {
        return `playlists-${animejoyAnimeId}-playlist-${src}`;
    }, [animejoyAnimeId]);

    const watchMap = useMemo(() => episodes?.reduce((acc, episode) => {
        const timestamp = localStorage.getItem(constructLocalStorageKey(episode.src));
        if (timestamp) acc.set(episode.src, timestamp);
        return acc;
    }, new Map<string, string>()) ?? new Map<string, string>(), [constructLocalStorageKey, episodes]);

    function createWatchstamp(src: string, timestamp: string) {
        const key = constructLocalStorageKey(src);
        localStorage.setItem(key, timestamp);
    }
    function removeWatchstamp(src: string) {
        const key = constructLocalStorageKey(src);
        localStorage.removeItem(key);
    }

    return {
        watchMap,
        createWatchstamp,
        removeWatchstamp,
    };
}