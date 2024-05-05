import { useQuery } from "react-query";
import ky from "ky";
import { useGlobalLoading } from "@/stores/global-loading";
import { EXTERNAL_LINKS } from "@/utils/fetching";

export const useShikimoriTokens = (code: string | null) => {
    const decrease = useGlobalLoading(state => state.decrease);

    return useQuery(
        ["shikimori/tokens"],
        async () => {
            try {
                const response = await ky.get(
                    EXTERNAL_LINKS.shikijoyApi + `/shikimori/auth/tokens?code=${code}`,
                    {
                        credentials: "include",
                    },
                );
                return response.json();
            } catch (err) {
                decrease();
                throw err;
            }
        }, {
            staleTime: Infinity,
            cacheTime: Infinity,
            retry: false,
            retryOnMount: false,
            refetchOnWindowFocus: false,
        },
    );
};