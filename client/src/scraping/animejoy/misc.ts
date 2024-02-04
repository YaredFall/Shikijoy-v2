import { ParsingError } from "@/utils/errors";

export function getAnimeIdFromPathname(pathname: string) {
    const id = pathname.match(/.*\/(?:page,\d*,\d*,)?(?<id>\d*)-/)?.groups?.id;
    if (!id) throw new ParsingError("Failed to get show id for pathname " + pathname);
    return id;
}

export function getOriginalPathname(url: string) {
    const urlObject = new URL(url);

    return process.env.NODE_ENV === "production" ? urlObject.pathname + urlObject.search : urlObject.search.replace("?url=", "");
}

export function getAlertMessage(parent: Document | HTMLElement | undefined) {
    const nodes = parent?.querySelector(".alert")?.childNodes;
    return nodes ? Array.from(nodes).at(-1)?.textContent : undefined;
}