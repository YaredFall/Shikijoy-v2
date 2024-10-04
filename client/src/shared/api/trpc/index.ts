import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@server/trpc/routers";
import { EXTERNAL_LINKS } from "@client/shared/api/utils";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: `${EXTERNAL_LINKS.shikijoyApi}/trpc`,
            // You can pass any HTTP headers you wish here
            // async headers() {
            //     return {
            //         authorization: getAuthCookie(),
            //     };
            // },
            fetch: (url, options) => fetch(url, { ...options, credentials: "include" }),
        }),
    ],
});

export const useTRPCUtils = () => trpc.useUtils();