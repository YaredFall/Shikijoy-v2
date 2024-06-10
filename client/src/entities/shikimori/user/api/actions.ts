import { useGlobalLoading } from "@/stores/global-loading";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import { openLogInPopup } from "@/utils/login-popup-window";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";

export function useShikimoriUserActions() {

    const queryClient = useQueryClient();
    const [increaseLoadingCount, decreaseLoadingCount] = useGlobalLoading(state => [state.increase, state.decrease] as const);

    const logIn = async () => await openLogInPopup(
        () => increaseLoadingCount(),
        () => queryClient.invalidateQueries({
            queryKey: ["shikimori", "whoami"],
        }),
    );

    const { mutate: logOut } = useMutation({
        mutationFn: async () => {
            await ky.post(EXTERNAL_LINKS.shikijoyApi + "/shikimori/auth/logout", {
                credentials: "include",
            });
            queryClient.setQueryData(["shikimori", "whoami"], null);
        },
        onMutate: () => {
            increaseLoadingCount();
        },
        onSettled: async () => {
            decreaseLoadingCount();
        },
    });
    return { logIn, logOut };
}