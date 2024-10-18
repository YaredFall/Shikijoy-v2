import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@server/trpc/routers";
import { EXTERNAL_LINKS } from "@client/shared/api/utils";
import { ofetch } from "ofetch";
import { RETRY_STATUS_CODES } from "@client/shared/api/defaults";

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
            fetch: async (url, options) => {
                try {
                    return await ofetch.raw(url.toString(), {
                        ...options,
                        credentials: "include",
                        retryStatusCodes: RETRY_STATUS_CODES,
                        responseType: "stream",
                    });
                } catch (error) {
                    console.log(`An error occurred while fetching ${url}`);
                    throw error;
                }
            },
        }),
    ],
});

export const useTRPCUtils = () => trpc.useUtils();