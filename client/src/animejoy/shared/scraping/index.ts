import { ScrapeError } from "@client/animejoy/shared/scraping/utils";
import { EXTERNAL_LINKS } from "@client/shared/api/utils";
import isNullish from "@client/shared/lib/isNullish";

export function getAnimeIdFromPathname(pathname: string) {
    const id = pathname.match(/.*?\/?(?:page,\d*,\d*,)?(?<id>\d*)-/)?.groups?.id;
    if (!id) throw new ScrapeError("Failed to get show id for pathname " + pathname);
    return id;
}

export function getUrlOfBGImage<T extends string | undefined | null>(bgImageString: T) {
    if (isNullish(bgImageString)) return bgImageString;

    return handleAnimejoyLink(bgImageString.replace(/url\("([^"]*)"\)/, "$1"), "replace");
}

export function handleAnimejoyLink<T extends string | undefined | null>(link: T, behavior: "replace" | "remove" = "remove") {

    if (isNullish(link)) return link;

    return link.replace("https://animejoy.ru", "").replace(/^/, behavior === "remove" ? "" : EXTERNAL_LINKS.animejoy);
}

export function getAlertMessage(parent: Document | HTMLElement | undefined) {
    const nodes = parent?.querySelector(".alert")?.childNodes;
    return nodes ? Array.from(nodes).at(-1)?.textContent : undefined;
}

export { ScrapeError };