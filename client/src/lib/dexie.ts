import Dexie, { Table } from "dexie";

export interface WatchStamp {
    animejoyID: string;
    src: string;
    createdAt: string;
}

export class MySubClassedDexie extends Dexie {
    episodes!: Table<WatchStamp>;

    constructor() {
        super("ShikijoyWatchHistory");
        this.version(1).stores({
            episodes: "++_id, createdAt, animejoyID, [animejoyID+src]", // Primary key and indexed props
        });
    }
}

export const db = new MySubClassedDexie();