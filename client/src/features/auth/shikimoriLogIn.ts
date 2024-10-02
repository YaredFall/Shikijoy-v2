import { trpc, useTRPCUtils } from "@/shared/api/trpc";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { useGlobalLoading } from "@/stores/global-loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { ofetch } from "ofetch";
import { useLayoutEffect } from "react";

const w = 500;
const h = 600;
const x = window.top!.outerWidth / 2 + window.top!.screenX - (w / 2);
const y = window.top!.outerHeight / 2 + window.top!.screenY - (h / 2);
const windowFeatures = `popup,width=${w},height=${h},left=${x},top=${y}`;

export type UseLogInPopupOptions = {
    onOpen?: () => void;
    onClose?: () => void;
    onOpenFailure?: () => void;
};

const openLogInPopup = ({
    onOpen,
    onClose,
    onOpenFailure,
}: UseLogInPopupOptions) => {

    const loginPopup = window.open(EXTERNAL_LINKS.shikijoyApi + "/shikimori/auth", "_blank", windowFeatures);
    if (loginPopup) {
        onOpen?.();
        const timer = setInterval(async () => {
            if (loginPopup.closed) {
                onClose?.();
                clearInterval(timer);
            }
        }, 250);
    } else {
        onOpenFailure?.();
    }
};

export function useShikimoriLogIn() {
    const qc = useQueryClient();
    const [increaseLoadingCount, decreaseLoadingCount] = useGlobalLoading(state => [state.increase, state.decrease, state.loadingCount] as const);

    useLayoutEffect(() => {
        const listener = () => {
            qc.resetQueries({ queryKey: getQueryKey(trpc) });
        };
        window.addEventListener("auth_success", listener, { once: true });
        return () => {
            window.removeEventListener("auth_success", listener);
        };
    });

    const logIn = () => openLogInPopup({
        onOpen: () => {
            increaseLoadingCount();
        },
        onClose: async () => {
            decreaseLoadingCount();
        },
        onOpenFailure: () => console.error("Failed to open popup window!"),
    });

    const { mutate: logOut } = useMutation({
        mutationFn: async () => {
            await ofetch(EXTERNAL_LINKS.shikijoyApi + "/shikimori/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            qc.resetQueries({ queryKey: getQueryKey(trpc) });
        },
        onMutate: () => {
            increaseLoadingCount();
        },
        onSettled: () => {
            decreaseLoadingCount();
        },
    });
    return { logIn, logOut };
}