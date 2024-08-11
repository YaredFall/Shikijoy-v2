
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

export interface PlaylistEpisode extends PlaylistGroupItem {
    player?: PlaylistPlayer;
    src: string;
    index: number;
}

export type Playlists = {
    studios: PlaylistStudio[] | undefined;
    players: PlaylistPlayer[] | undefined;
    episodes: PlaylistEpisode[] | undefined;
};

export interface WatchedEpisode extends PlaylistEpisode {
    timestamp: string;
}