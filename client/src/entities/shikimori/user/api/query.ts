import { useGlobalLoading } from "@/stores/global-loading";
import { ShikimoriUser } from "@/types/shikimori";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import ky from "ky";

export const useShikimoriUser = (options: Omit<UseQueryOptions<ShikimoriUser | null, unknown, ShikimoriUser | null, string[]>, "queryKey" | "queryFn"> = {}) => {
    const { decrease } = useGlobalLoading(state => ({
        decrease: state.decrease,
    }));

    return useQuery(
        {
            queryKey: ["shikimori", "whoami"],
            queryFn: async () => {

                try {
                    const response = await ky.get(
                        EXTERNAL_LINKS.shikijoyApi + "/shikimori/users/whoami",
                        { credentials: "include", retry: 0 });
                    decrease();
                    return response.json<ShikimoriUser | null>();
                } catch (err: any) {
                    if (!err.response) {
                        console.log(err);
                        console.warn("Запрос был заблокирован браузером!");
                    }
                    decrease();
                    throw err;
                }
            },

            retry: false,
            refetchInterval: 12 * 60 * 60 * 1000,
            refetchOnWindowFocus: false,
            ...options,
        },
    );
};