import { publicProcedure, router } from "@server/trpc";
import { z } from "zod";

export default router({
    byId: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .query(async ({ input, ctx }) => {
            return await ctx.shikimoriClient.people.byId(input);
        }),
});