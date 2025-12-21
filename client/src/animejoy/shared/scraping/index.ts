import { ScrapeError } from "@client/animejoy/shared/scraping/utils";
import { EXTERNAL_LINKS } from "@client/shared/api/utils";
import isNullish from "@client/shared/lib/isNullish";
import { withoutHost } from "ufo";

export function getAnimeIdFromPathname(pathname: string) {
    const id = pathname.match(/.*?\/?(?:page,\d*,\d*,)?(?<id>\d*)-/)?.groups?.id;
    if (!id) throw new ScrapeError("Failed to get show id for pathname " + pathname);
    return id;
}

export function getUrlOfBGImage<T extends string | undefined | null>(bgImageString: T) {
    if (isNullish(bgImageString)) return bgImageString;

    const src = bgImageString.replace(/url\("([^"]*)"\)/, "$1");

    return process.env.NODE_ENV === "production" ? src : handleAnimejoyLink(src, "replace");
}

export function handleAnimejoyLink<T extends string | undefined | null>(
    link: T,
    behavior: "replace" | "remove" = "remove",
) {
    if (isNullish(link)) return link;

    const path = withoutHost(link);

    return `${behavior === "remove" ? "" : EXTERNAL_LINKS.animejoy}${path}`;
}

export function getAlertMessage(parent: Document | HTMLElement | undefined) {
    const nodes = parent?.querySelector(".alert")?.childNodes;
    return nodes ? Array.from(nodes).at(-1)?.textContent : undefined;
}

export { ScrapeError };