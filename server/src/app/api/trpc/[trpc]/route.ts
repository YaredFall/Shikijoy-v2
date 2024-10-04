import { appRouter } from "@server/trpc/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@server/trpc/context";
import { NextResponse } from "next/server";

function handler(req: Request) {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext,
    });
}

export { handler as GET, handler as POST };