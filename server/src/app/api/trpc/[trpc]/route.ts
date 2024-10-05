import { appRouter } from "@server/trpc/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@server/trpc/context";

function handler(req: Request) {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext,
        onError: (opts) => {
            console.error("TRPC encountered an error:", opts.error);
        },
    });
}

export { handler as GET, handler as POST };