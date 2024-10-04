import { db } from "@server/lib/drizzle/db";
import { WatchStampFilter, watchStamps } from "@server/lib/drizzle/schema/watch-stamp";
import { and, eq, or } from "drizzle-orm";

export const stampsByAnimeIdAndUserFilter = (data: WatchStampFilter) =>
    and(
        eq(watchStamps.animejoyAnimeId, data.animejoyAnimeId),
        data.animejoyUserId && data.shikimoriUserId
            ? or(
                eq(watchStamps.animejoyUserId, data.animejoyUserId),
                eq(watchStamps.shikimoriUserId, data.shikimoriUserId),
            )
            : data.animejoyUserId
                ? eq(watchStamps.animejoyUserId, data.animejoyUserId)
                : data.shikimoriUserId ? eq(watchStamps.shikimoriUserId, data.shikimoriUserId) : undefined,
    );

export const selectWatchStamps = async (filterData: WatchStampFilter) => await db.select({
    animejoyAnimeId: watchStamps.animejoyAnimeId,
    src: watchStamps.src,
    createdAt: watchStamps.createdAt,
}).from(watchStamps).where(stampsByAnimeIdAndUserFilter(filterData));