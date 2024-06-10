import { useGlobalLoading } from "@/stores/global-loading";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";


export const useAnimejoyUserActions = () => {

    const queryClient = useQueryClient();
    const [increaseLoadingCount, decreaseLoadingCount] = useGlobalLoading(state => [state.increase, state.decrease] as const);

    const { mutate: logIn } = useMutation({
        mutationFn: async (data: FormData) => {
            await ky.post(EXTERNAL_LINKS.animejoy, {
                body: data,
            });
        },
        onMutate: () => {
            increaseLoadingCount();
        },
        onSettled: async () => {
            await queryClient.refetchQueries({
                queryKey: ["animejoy", "page", window.location.pathname],
            });
            decreaseLoadingCount();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const { mutate: logOut } = useMutation({
        mutationFn: async () => {
            await ky.get(EXTERNAL_LINKS.animejoy + "/index.php?action=logout");
        },
        onMutate: () => {
            increaseLoadingCount();
        },
        onSettled: async () => {
            await queryClient.refetchQueries({
                queryKey: ["animejoy", "page", window.location.pathname],
            });
            decreaseLoadingCount();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return { logIn, logOut };
};