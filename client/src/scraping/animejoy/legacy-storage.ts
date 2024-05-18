import { PlaylistFile } from "@/types/animejoy";

export function getStoredWatchedEpisodes(animejoyID: string, files?: PlaylistFile[]) {

    return files?.filter(file => localStorage.getItem(`playlists-${animejoyID}-playlist-${file.src}`) === "1");
}

export function toggleStoredWatchedEpisode(animejoyID: string, file: PlaylistFile, force?: boolean) {
    const key = `playlists-${animejoyID}-playlist-${file.src}`;
    const stored = localStorage.getItem(key) === "1";

    if (force ?? !stored) localStorage.setItem(key, "1");
    else if (force === false || stored) localStorage.removeItem(key);
}

export function isWatched(file: PlaylistFile, watchedEpisodes: PlaylistFile[] | undefined) {
    // ? Potential user preference (only current player / any player)
    return watchedEpisodes?.some(watched => watched.label === file.label);
}

export function getWatchedEpisodeWithHighestIndex(watchedEpisodes: PlaylistFile[] | undefined): PlaylistFile | undefined {
    let maxIndex = -1;
    let result: PlaylistFile | undefined = undefined;

    watchedEpisodes?.forEach((we) => {
        if (we.index > maxIndex) {
            maxIndex = we.index;
            result = we;
        }
    });

    return result;
}