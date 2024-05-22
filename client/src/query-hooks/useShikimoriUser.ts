import { useGlobalLoading } from "@/stores/global-loading";
import { ShikimoriUser } from "@/types/shikimori";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import ky from "ky";
import { useMutation, useQuery, UseQueryOptions } from "react-query";

export const useShikimoriUser = (options: UseQueryOptions<ShikimoriUser | null, unknown, ShikimoriUser | null, string[]> = {}) => {
    const { isLoading, decrease, increase } = useGlobalLoading(state => ({
        isLoading: state.isLoading(),
        decrease: state.decrease,
        increase: state.increase,
    }));

    return useQuery(
        ["shikimori", "whoami"],
        async () => {

            try {
                const response = await ky.get(
                    EXTERNAL_LINKS.shikijoyApi + "/shikimori/users/whoami",
                    { credentials: "include" });
                decrease();
                return response.json<ShikimoriUser | null>();
            } catch (err: any) {
                if (err.response?.status === 401) {

                    try {
                        await ky.post(
                            EXTERNAL_LINKS.shikijoyApi + `/shikimori/auth/tokens/refresh`,
                            {
                                credentials: "include",
                            },
                        );

                        const response = await ky.get(
                            EXTERNAL_LINKS.shikijoyApi + "/shikimori/users/whoami",
                            { credentials: "include" });
                        return response.json<ShikimoriUser | null>();
                    } catch (newError) {
                        console.error(newError);
                    }

                    return null;
                } else if (err.response.status) {
                    console.error(err.response);
                    throw err;
                } else {
                    if (!err.response) {
                        console.warn("Запрос был заблокирован браузером!");
                    }
                    throw err;
                }
            } finally {
                decrease();
            }

        },
        {
            retry: false,
            refetchInterval: 12 * 60 * 60 * 1000,
            refetchOnWindowFocus: false,
            ...options,
        },
    );
};