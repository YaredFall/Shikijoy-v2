import { useGlobalLoading } from "@/stores/global-loading";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import ky from "ky";
import { useQuery } from "@tanstack/react-query";

export const useShikimoriTokens = (code: string | null) => {
    const decrease = useGlobalLoading(state => state.decrease);

    return useQuery(
        {
            queryKey: ["shikimori/tokens"],
            queryFn: async () => {
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
            },
            staleTime: Infinity,
            retry: false,
            retryOnMount: false,
            refetchOnWindowFocus: false,
        },
    );
};