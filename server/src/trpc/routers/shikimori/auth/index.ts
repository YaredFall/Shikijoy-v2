import { getAccessToken } from "@server/app/api/shikimori/_utils";
import { publicProcedure, router } from "@server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default router({
    getTokens: publicProcedure.input(z.object({
        code: z.string(),
    })).mutation(async ({ input, ctx }) => {
        try {
            const token = await getAccessToken(input.code);

            ctx.setTokens(token);

            console.log("successful auth", token);

            return { success: true };
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unexpected error during authorization", cause: error });
        }
    }),
});