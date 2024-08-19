import { withId } from "@server/trpc/validation/rules";
import { publicProcedure, router } from "@server/trpc";

export default router({
    byId: publicProcedure.input(withId).query(({ input, ctx }) => ctx.shikimoriClient.animes.byId(input)),
    roles: publicProcedure.input(withId).query(({ input, ctx }) => ctx.shikimoriClient.animes.roles(input)),
});