import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const { router, procedure: publicProcedure, createCallerFactory } = t;

export const protectedProcedure = publicProcedure.use(async (opts) => {

    if (!opts.ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" });

    return opts.next({
        ctx: {
            ...opts.ctx,
            user: opts.ctx.user,
        },
    });
});