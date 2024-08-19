import { appRouter } from "@/trpc/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@/trpc/context";
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