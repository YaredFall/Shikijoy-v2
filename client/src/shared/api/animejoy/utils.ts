export function getOriginalPathname(url: string) {
    const urlObject = new URL(url);

    return process.env.NODE_ENV === "production" ? urlObject.pathname + urlObject.search : urlObject.search.replace("?url=", "");
}

export class ScrapeError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "ScrapeError";
    }
}