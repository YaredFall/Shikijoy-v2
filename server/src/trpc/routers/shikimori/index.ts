import users from "./users";
import anime from "./anime";
import auth from "./auth";
import people from "./people";
import characters from "./characters";
import { router } from "@server/trpc";

export default router({
    users,
    anime,
    auth,
    people,
    characters,
});