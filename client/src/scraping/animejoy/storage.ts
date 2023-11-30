import { PlaylistFile } from "../../types/animejoy";

export function getStoredWatchedEpisodes(animejoyID: string, files?: PlaylistFile[]) {

  return files?.filter(file => localStorage.getItem(`playlists-${animejoyID}-playlist-${file.src}`) === "1");
}

export function toggleStoredWatchedEpisode(animejoyID: string, file: PlaylistFile) {
  const key = `playlists-${animejoyID}-playlist-${file.src}`;
  const stored = localStorage.getItem(key) === "1";
  if (stored) localStorage.removeItem(key);
  else localStorage.setItem(key, "1");
}