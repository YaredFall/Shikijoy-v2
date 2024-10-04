import { EXTERNAL_LINKS } from "@client/shared/api/utils";
import { useGlobalLoading } from "@client/stores/global-loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ofetch } from "ofetch";


export const useAnimejoyLogIn = () => {

    const qc = useQueryClient();
    const [increaseLoadingCount, decreaseLoadingCount] = useGlobalLoading(state => [state.increase, state.decrease] as const);

    const { mutate: logIn } = useMutation({
        mutationFn: async (data: FormData) => {
            await ofetch(EXTERNAL_LINKS.animejoy, {
                method: "POST",
                body: data,
                credentials: "include",
            });
        },
        onMutate: () => {
            increaseLoadingCount();
        },
        onSuccess: async () => {
            await qc.resetQueries({ queryKey: ["animejoy"] });
        },
        onSettled: async () => {
            decreaseLoadingCount();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const { mutate: logOut } = useMutation({
        mutationFn: async () => {
            await ofetch(EXTERNAL_LINKS.animejoy + "/index.php?action=logout", { credentials: "include" });
        },
        onMutate: () => {
            increaseLoadingCount();
        },
        onSettled: async () => {
            await qc.resetQueries({ queryKey: ["animejoy"] });
            decreaseLoadingCount();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return { logIn, logOut };
};