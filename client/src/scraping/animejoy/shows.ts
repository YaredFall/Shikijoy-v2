import { FranchiseData, ShowTitle } from "@/types/animejoy";
import { LINKS, ParsingError } from "@/utils";

export function getShowTitle(parentNode?: ParentNode | null): ShowTitle | undefined {

    if (!parentNode) return undefined;


    const ru = parentNode.querySelector(".ntitle")?.textContent;
    const romanji = parentNode.querySelector(".romanji")?.textContent;


    if (!ru || !romanji) {
        throw new ParsingError("Was not able to find parsing target or parsed value is null");
    }

    return {
        ru,
        romanji
    };
}


export function getFranchise(page: Document | undefined): FranchiseData | undefined {
    if (!page) return undefined;

    const container = page.querySelector(".text_spoiler");
    if (!container) return undefined;

    const lis = container.querySelectorAll("ol li");
    if (lis.length === 0) return undefined;

    return [...lis].map(e => {

        const current = e.className === "rfa";
        const url = e.querySelector("a")?.getAttribute("href")?.replace(LINKS.animejoy, "");
        const type = current ? "CURRENT" : (e.children[0] ? (url && "AVAILABLE" || "BLOCKED") : "NOT_AVAILABLE");

        return ({
            label: e.textContent!,
            type,
            url
        });
    });
}