import { ScrapeError } from "@client/animejoy/shared/scraping/utils";

export function getAnimeIdFromPathname(pathname: string) {
    const id = pathname.match(/.*?\/?(?:page,\d*,\d*,)?(?<id>\d*)-/)?.groups?.id;
    if (!id) throw new ScrapeError("Failed to get show id for pathname " + pathname);
    return id;
}

export function getUrlOfBGImage(bgImageString: string | undefined) {
    return bgImageString?.replace(/url\("([^"]*)"\)/, "$1") ?? "";
}

export function getAlertMessage(parent: Document | HTMLElement | undefined) {
    const nodes = parent?.querySelector(".alert")?.childNodes;
    return nodes ? Array.from(nodes).at(-1)?.textContent : undefined;
}

export { ScrapeError };