import { index, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const watchStamps = pgTable("watch_stamps", {
    id: serial("id").primaryKey(),
    animejoyAnimeId: varchar("animejoy_anime_id", { length: 8 }).notNull(),
    shikimoriUserId: integer("shikimori_user_id"),
    animejoyUserId: integer("animejoy_user_id"),
    src: text("src").notNull(),
    createdAt: varchar("created_at", { length: 24 }).notNull(),
}, (table) => {
    return {
        animejoyAnimeIDIdx: index("animejoy_anime_id_idx").on(table.animejoyAnimeId),
        shikimoriUserIdIdx: index("shikimori_user_id_idx").on(table.shikimoriUserId),
        animejoyUserIdIdx: index("animejoy_user_id_idx").on(table.animejoyUserId),
        srcIdx: index("src_idx").on(table.src),
        animejoyAnimeIdAndSrcIdx: index("animejoy_user_id_and_src_idx").on(table.animejoyAnimeId, table.src),
        createdAtIdx: index("created_at_idx").on(table.createdAt),
    };
});

export const watchStampPublicSchema = createInsertSchema(watchStamps).omit({
    id: true,
    animejoyUserId: true,
    shikimoriUserId: true,
});
export type WatchStamp = z.infer<typeof watchStampPublicSchema>;

export const watchStampInsertSchema = createInsertSchema(watchStamps).omit({
    id: true,
}).refine(arg => arg.animejoyUserId || arg.shikimoriUserId).innerType();
export type NewWatchStamp = z.infer<typeof watchStampInsertSchema>;

export const watchStampFilterSchema = watchStampInsertSchema.omit({
    createdAt: true,
    src: true,
}).extend({
    src: watchStampInsertSchema.shape.src.optional(),
}).refine(arg => arg.animejoyUserId || arg.shikimoriUserId, "At least on of 'animejoyUserId' and 'shikimoriUserId' should be defined");
export type WatchStampFilter = z.infer<typeof watchStampFilterSchema>;

export const selectWatchStampSchema = watchStampInsertSchema.omit({
    createdAt: true,
});
export type WatchStampSelectionFilter = z.infer<typeof selectWatchStampSchema>;