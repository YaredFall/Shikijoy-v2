import { EXTERNAL_LINKS } from "@/utils/fetching";

export const openLogInPopup = async (onOpen?: () => void, onClose?: () => void) => {
    const w = 500;
    const h = 600;
    const x = window.top!.outerWidth / 2 + window.top!.screenX - (w / 2);
    const y = window.top!.outerHeight / 2 + window.top!.screenY - (h / 2);
    const windowFeatures = `popup,width=${w},height=${h},left=${x},top=${y}`;

    const loginPopup = window.open(EXTERNAL_LINKS.shikijoyApi + "/shikimori/auth", "login-popup", windowFeatures);
    onOpen?.();
    
    if (loginPopup) {
        const timer = setInterval(async () => {
            if (loginPopup.closed) {
                onClose?.();
                if (timer) clearInterval(timer);
            }
        }, 500);
    }
};