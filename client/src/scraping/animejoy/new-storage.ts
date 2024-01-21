import { EpisodeRecord, db } from "@/lib/dexie";

export async function setEpisodeRecord(episode: EpisodeRecord) {

    const filter = Object.fromEntries(Object.entries(episode).filter(entry => entry[1] != undefined));

    await db.episodes.where(filter).delete();
    await db.episodes.put(episode);
}

export async function getLastWatched(animejoyID: string) {
    const watched = await db.episodes.where({ animejoyID }).sortBy("index");
    return watched.at(-1);
}