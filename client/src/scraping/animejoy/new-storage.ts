import { WatchStamp, db } from "@/lib/dexie";

export async function createOrDeleteWatchStamp(watchstamp: WatchStamp) {

    // const filter = Object.fromEntries(Object.entries(episode).filter(entry => entry[1] != undefined));
    const filter = {
        animejoyID: watchstamp.animejoyID,
        src: watchstamp.src,
    } satisfies Partial<WatchStamp>;

    const deleted = await db.episodes.where(filter).delete();
    if (!deleted) await db.episodes.put(watchstamp);
}

export async function getLastWatched(animejoyID: string) {
    const watched = await db.episodes.where({ animejoyID }).sortBy("timestamp");
    return watched.at(-1);
}