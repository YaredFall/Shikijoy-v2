import { protectedProcedure, router } from "@server/trpc";
import { watchStampFilterSchema, watchStampInsertSchema, watchStamps } from "@/lib/drizzle/schema/watch-stamp";
import { selectWatchStamps, stampsByAnimeIdAndUserFilter } from "@/lib/drizzle/query/watch-stamps";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/drizzle/db";
import { and, eq } from "drizzle-orm";

export default router({
    get: protectedProcedure.input(watchStampFilterSchema).query(async ({ input }) => {
        try {
            return await selectWatchStamps(input);
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB query error", cause: error });
        }
    }),
    create: protectedProcedure.input(watchStampInsertSchema).mutation(async ({ input }) => {
        try {
            await db.insert(watchStamps).values(input);

            return await selectWatchStamps(input);
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB query error", cause: error });
        }
    }),
    remove: protectedProcedure.input(watchStampFilterSchema).mutation(async ({ input }) => {
        try {
            if (input.src) {
                await db.delete(watchStamps).where(and(
                    stampsByAnimeIdAndUserFilter(input),
                    eq(watchStamps.src, input.src),
                ));
            } else {
                await db.delete(watchStamps).where(stampsByAnimeIdAndUserFilter(input));
            }

            return await selectWatchStamps(input);
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB query error", cause: error });
        }
    }),
});