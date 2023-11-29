import { getPlaylistsData } from "../scraping/animejoy/playlists";

// Playlists related

export type PlaylistsResponse = {
  success: true;
  response: string;
} | {
  success: false;
  message: string;
};

export interface PlaylistGroupItem {
  id: string,
  label: string;
}

export type PlaylistGroup = PlaylistGroupItem[];

export interface PlaylistStudio extends PlaylistGroupItem { }

export interface PlaylistPlayer extends PlaylistGroupItem {
  studio?: PlaylistStudio;
}

export interface PlaylistFile extends PlaylistGroupItem {
  player?: PlaylistPlayer;
  src: string;
}

export type Playlists = ReturnType<typeof getPlaylistsData>;
