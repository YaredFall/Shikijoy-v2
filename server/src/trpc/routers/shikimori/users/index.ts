import { protectedProcedure, router } from "@server/trpc";

export default router({
    whoami: protectedProcedure.query(({ ctx }) => ctx.shikimoriClient.users.whoami()),
});