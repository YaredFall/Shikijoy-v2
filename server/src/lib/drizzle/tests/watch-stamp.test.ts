import { watchStampFilterSchema, watchStampInsertSchema } from "@server/lib/drizzle/schema/watch-stamp";
import { describe, expect, it } from "vitest";

// The two tests marked with concurrent will be run in parallel
describe("watch-stamps schema", () => {
    describe("insert", () => {
        it("fail without data", () => {
            expect(() => watchStampInsertSchema.parse({})).toThrow();
        });
        it("success with data", () => {
            expect(() => watchStampInsertSchema.parse({
                animejoyAnimeId: "1",
                src: "foo/bar",
                createdAt: new Date().toISOString(),
            })).not.toThrow();
        });
    });

    describe("filter", () => {
        it("fail without data", () => {
            expect(() => watchStampFilterSchema.parse({})).toThrow();
        });
        it("fail without user ids", () => {
            expect(() => watchStampFilterSchema.parse({
                animejoyAnimeId: "1",
            })).toThrow();
        });
        it("success with user ids", () => {
            expect(() => watchStampFilterSchema.parse({
                animejoyAnimeId: "1",
                animejoyUserId: 1,
            })).not.toThrow();
            expect(() => watchStampFilterSchema.parse({
                animejoyAnimeId: "1",
                shikimoriUserId: 1,
            })).not.toThrow();
            expect(() => watchStampFilterSchema.parse({
                animejoyAnimeId: "1",
                animejoyUserId: 1,
                shikimoriUserId: 1,
            })).not.toThrow();
        });
    });
});