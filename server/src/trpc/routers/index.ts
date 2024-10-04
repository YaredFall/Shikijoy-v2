import { z } from "zod";
import { publicProcedure, router, createCallerFactory } from "..";
import shikimori from "./shikimori";
import { Context } from "@server/trpc/context";

export const appRouter = router({
    shikimori,
    hello: publicProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            return {
                greeting: `hello, ${opts.input.text}`,
            };
        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

const createCaller = createCallerFactory(appRouter);
 
// 2. create a caller using your `Context`
export const caller = createCaller({ } as Context);