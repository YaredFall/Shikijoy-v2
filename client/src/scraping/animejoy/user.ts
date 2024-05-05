import { getUrlOfBGImage } from "@/scraping/animejoy/common";

export function getAnimejoyUserFromHeader(page: Document | undefined) {
    if (!page) return undefined;

    const avatarEl = page.querySelector("#loginbtn .avatar");

    if (!avatarEl) return null;
    const coverEl = avatarEl.querySelector<HTMLElement>(".cover");

    return ({
        url: avatarEl.parentElement!.getAttribute("href") || "",
        avatar: getUrlOfBGImage(coverEl?.style.backgroundImage),
        nickname: coverEl?.textContent,
        unreadMessages: avatarEl.querySelector(".num")?.textContent,
    });
}