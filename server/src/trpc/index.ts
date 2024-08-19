import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { refreshAccessToken } from "@/app/api/shikimori/_utils";
const t = initTRPC.context<Context>().create();

export const { router, procedure: publicProcedure, createCallerFactory } = t;
export const protectedProcedure = publicProcedure.use(async (opts) => {

    if (!opts.ctx.accessToken) {
        if (!opts.ctx.refreshToken) throw new TRPCError({ code: "UNAUTHORIZED", message: "Access token is not provided" });

        try {
            const token = await refreshAccessToken(opts.ctx.refreshToken);
            opts.ctx.shikimoriClient.setAccessToken(token.access_token);
            opts.ctx.setAuthCookies(token);
        } catch (error) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Access token is not provided or is invalid" });
        }
    }

    try {
        const user = await opts.ctx.shikimoriClient.users.whoami();

        // opts.ctx.shikimoriClient.setAccessToken(opts.ctx.accessToken);

        return opts.next({
            ctx: {
                ...opts.ctx,
                user,
            },
        });
    } catch (error) {
        console.log(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch user", cause: error });
    }
});