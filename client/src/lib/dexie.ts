import { PlaylistFile } from "@/types/animejoy";
import Dexie, { Table } from "dexie";

export class EpisodeRecord {
//   _id?: number;
    animejoyID: string;
    index: number;
    label: string;
    player: string | undefined;
    studio: string | undefined;
    user?: string;

    constructor(animejoID: string, episodeFile: PlaylistFile, index: number, user?: string) {
        this.animejoyID = animejoID;
        this.index = index;
        this.label = episodeFile.label;
        this.player = episodeFile.player?.label;
        this.studio = episodeFile.player?.studio?.label;
        this.user = user;
    }
}

export class MySubClassedDexie extends Dexie {
    episodes!: Table<EpisodeRecord>;

    constructor() {
        super("WatchedEpisodes");
        this.version(1).stores({
            episodes: "++_id, index, user, animejoyID" // Primary key and indexed props
        });
    }
}

export const db = new MySubClassedDexie();