import { protectedProcedure, router } from "@server/trpc";
import { watchStampFilterSchema, watchStampInsertSchema, watchStamps } from "@server/lib/drizzle/schema/watch-stamp";
import { selectWatchStamps, stampsByAnimeIdAndUserFilter } from "@server/lib/drizzle/query/watch-stamps";
import { TRPCError } from "@trpc/server";
import { db } from "@server/lib/drizzle/db";
import { and, eq } from "drizzle-orm";

export default router({
    get: protectedProcedure.input(watchStampFilterSchema.innerType().omit({
        shikimoriUserId: true,
    })).query(async ({ input, ctx }) => {
        try {
            const filter = { ...input, shikimoriUserId: +ctx.user.id };
            return await selectWatchStamps(filter);
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB query error", cause: error });
        }
    }),
    create: protectedProcedure.input(watchStampInsertSchema.innerType().omit({
        shikimoriUserId: true,
    })).mutation(async ({ input, ctx }) => {
        try {
            const filter = { ...input, shikimoriUserId: +ctx.user.id };
            await db.insert(watchStamps).values(filter);

            return await selectWatchStamps(filter);
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB query error", cause: error });
        }
    }),
    remove: protectedProcedure.input(watchStampInsertSchema.innerType().omit({
        createdAt: true,
        shikimoriUserId: true,
    })).mutation(async ({ input, ctx }) => {
        try {
            const filter = { ...input, shikimoriUserId: +ctx.user.id };
            await db.delete(watchStamps).where(and(
                stampsByAnimeIdAndUserFilter(filter),
                eq(watchStamps.src, filter.src),
            ));

            return await selectWatchStamps(filter);
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB query error", cause: error });
        }
    }),
});