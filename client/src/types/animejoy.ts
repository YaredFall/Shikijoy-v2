import { getPlaylistsData } from "@/scraping/animejoy/playlists";
import { SHOW_CATEGORIES } from "@/utils/routing";

// Playlists related

export type PlaylistsResponse = {
    success: true;
    response: string;
} | {
    success: false;
    message: string;
};

export interface PlaylistGroupItem {
    id: string;
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

//Shows related

export type ShowTitle = {
    ru: string;
    romanji: string;
};

export type FranchiseData = {
    label: string;
    type: "AVAILABLE" | "CURRENT" | "BLOCKED" | "NOT_AVAILABLE";
    url?: string;
}[];

export type StoryData = {
    title: ShowTitle;
    url: string;
    poster: string;
    status?: "FULL" | "ONGOING";
    description?: string;
    info: Array<{ label?: string; value: Array<{ text: string; url?: string }> }>;
    editDate?: string;
    categories: ShowCategory[];
    comments?: number;
};

export type ShowCategory = typeof SHOW_CATEGORIES[number];