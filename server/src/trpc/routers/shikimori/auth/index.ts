import { getAccessToken } from "@/app/api/shikimori/_utils";
import { publicProcedure, router } from "@server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default router({
    getTokens: publicProcedure.input(z.object({
        code: z.string(),
    })).query(async ({ input, ctx: { cookies } }) => {
        try {
            const data = await getAccessToken(input.code);

            // `${data.token_type} ${data.access_token}`
            cookies.set("shikimori_at", data.access_token!, {
                maxAge: data.expires_in,
                path: "/",
                sameSite: "none",
                secure: true,
                httpOnly: true,
            });
            cookies.set("shikimori_rt", data.refresh_token, {
                maxAge: 31_536_000,
                path: "/",
                sameSite: "none",
                secure: true,
                httpOnly: true,
            });

            console.log("successful auth", data);

            return { success: true };
        } catch (error) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unexpected error during authorization", cause: error });
        }
    }),
});