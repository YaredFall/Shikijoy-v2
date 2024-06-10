import { AnimejoyUser, AnimejoyUserSchema } from "@/entities/animejoy/user/model";
import { getUrlOfBGImage } from "@/scraping/animejoy/common";
import { ScrapeError } from "@/scraping/error";

export function getAnimejoyUserFromHeader(page: Document | undefined): AnimejoyUser | undefined | null {
    if (!page) return undefined;

    const avatarEl = page.querySelector("#loginbtn .avatar");

    if (!avatarEl) return null;
    const coverEl = avatarEl.querySelector<HTMLElement>(".cover");

    const rawData = {
        url: avatarEl.parentElement!.getAttribute("href") || "",
        avatar: getUrlOfBGImage(coverEl?.style.backgroundImage),
        nickname: coverEl?.textContent,
        unreadMessages: avatarEl.querySelector(".num")?.textContent,
    };

    const { data, success } = AnimejoyUserSchema.safeParse(rawData);
    if (!success) throw new ScrapeError("Scraped data not matching expected shape");

    return data;
}