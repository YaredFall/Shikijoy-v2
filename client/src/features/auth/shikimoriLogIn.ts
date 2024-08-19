import { useTRPCUtils } from "@/shared/api/trpc";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { useGlobalLoading } from "@/stores/global-loading";
import { useMutation } from "@tanstack/react-query";
import { ofetch } from "ofetch";

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

    const loginPopup = window.open(EXTERNAL_LINKS.shikijoyApi + "/shikimori/auth", "login-popup", windowFeatures);
    if (loginPopup) {
        onOpen?.();
        const timer = setInterval(async () => {
            if (loginPopup.closed) {
                onClose?.();
                clearInterval(timer);
            }
        }, 500);
    } else {
        onOpenFailure?.();
    }
};

export function useShikimoriLogIn() {
    const trpcUtils = useTRPCUtils();
    const [increaseLoadingCount, decreaseLoadingCount] = useGlobalLoading(state => [state.increase, state.decrease] as const);

    const logIn = () => openLogInPopup({
        onOpen: () => increaseLoadingCount(),
        onClose: () => trpcUtils.shikimori.users.whoami.invalidate(),
        onOpenFailure: () => console.error("Failed to open popup window!"),
    });

    const { mutate: logOut } = useMutation({
        mutationFn: async () => {
            await ofetch(EXTERNAL_LINKS.shikijoyApi + "/shikimori/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            trpcUtils.shikimori.users.whoami.setData(undefined, undefined);
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