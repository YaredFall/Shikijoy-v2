import { ShowTitle, FranchiseData } from "@/entities/animejoy/show/model";
import { ScrapeError } from "@/utils/errors";
import { EXTERNAL_LINKS } from "@/utils/fetching";

export function getShowTitle(parentNode?: ParentNode | null): ShowTitle | undefined {

    if (!parentNode) return undefined;


    const ru = parentNode.querySelector(".ntitle")?.textContent;
    const romanji = parentNode.querySelector(".romanji")?.textContent;


    if (!ru || !romanji) {
        throw new ScrapeError("Was not able to find parsing target or parsed value is null");
    }

    return {
        ru,
        romanji,
    };
}


export function getFranchise(page: Document | undefined): FranchiseData | undefined {
    if (!page) return undefined;

    const container = page.querySelector(".text_spoiler");
    if (!container) return undefined;

    const lis = container.querySelectorAll("ol li");
    if (lis.length === 0) return undefined;

    return [...lis].map((e) => {

        const current = e.className === "rfa";
        const url = e.querySelector("a")?.getAttribute("href")?.replace(EXTERNAL_LINKS.animejoy, "");
        const type = current ? "CURRENT" : (e.children[0] ? ((url && "AVAILABLE") || "BLOCKED") : "NOT_AVAILABLE");

        return ({
            label: e.textContent!,
            type,
            url,
        });
    });
}

export function getShikimoriLink(page: Document | undefined) {
    if (!page) return undefined;
    const links = [...page.querySelectorAll(".block .abasel li")].map(e => e.querySelector("a"));
    return links ? links.find(e => e!.textContent === "Shikimori")?.getAttribute("href") : undefined;
}
export function getShikimoriID(page: Document | undefined) {
    const link = getShikimoriLink(page);
    if (page && !link) console.error("Shikimori link was not found!");
    return link?.match(/https:\/\/shikimori\.\w+?\/animes\/\D?(?<id>\d*)-.*/mi)?.groups?.id;
}