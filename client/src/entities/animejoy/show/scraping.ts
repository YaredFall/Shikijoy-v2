import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { FranchiseData, ShowTitle } from "./model";
import { ScrapeError } from "@/shared/api/animejoy/utils";

export function getShowTitle<T extends Document | Element | undefined>(el: T) {
    if (typeof el === "undefined") return el;

    const ru = el.querySelector(".ntitle")?.textContent;
    const romanji = el.querySelector(".romanji")?.textContent;

    if (!ru || !romanji) {
        throw new ScrapeError("Was not able to find parsing target or parsed value is null");
    }

    return {
        ru,
        romanji,
    } satisfies ShowTitle;
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

export function getExternalLinks<T extends Document | undefined>(page: T) {
    if (typeof page === "undefined") return page;

    const links = [...page.querySelectorAll(".block .abasel li")].map(e => e.querySelector("a"));
    return Object.fromEntries(links.map((l) => {
        const siteName = l?.textContent;
        const siteUrl = l?.getAttribute("href");

        if (!siteName || !siteUrl) throw new ScrapeError("Something went wrong during scraping of show external links");

        return [siteName[0].toLocaleLowerCase() + siteName.slice(1), siteUrl];
    }));
}
export function getShikimoriLink(page: Document | undefined) {
    if (!page) return undefined;
    const links = [...page.querySelectorAll(".block .abasel li")].map(e => e.querySelector("a"));
    return links ? links.find(e => e!.textContent === "Shikimori")?.getAttribute("href") : undefined;
}
export function getShikimoriID<T extends string | undefined>(link: T) {
    if (typeof link === "undefined") return link;
    return link?.match(/https:\/\/shikimori\.\w+?\/animes\/\D?(?<id>\d*)-.*/mi)?.groups?.id;
}

export function getScreenshots(page: Document | undefined) {
    if (!page) return undefined;
    const images = page.querySelectorAll(".mobfields img");
    return [...images].map((img) => {
        const url = img.getAttribute("data-src");

        return url && (EXTERNAL_LINKS.animejoy + url);
    });
}

export function getShowDescription<T extends Document | Element | undefined>(el: T) {
    if (typeof el === "undefined") return el;
    const p = el.querySelector(".pcdescr p");
    return (p && Array.from(p.childNodes).at(-1)?.textContent) || undefined;
}

export function getShowDescriptionFull<T extends Document | Element | undefined>(el: T) {
    if (typeof el === "undefined") return el;
    return Array.from(el.querySelectorAll(".pcdescrf p")).reduce((acc, p) => {
        const text = Array.from(p.childNodes).at(-1)?.textContent;
        if (text) acc.push(text);
        return acc;
    }, new Array<string>());
}

export function getShowInfo<T extends Document | Element | undefined>(el: T) {
    if (typeof el === "undefined") return el;
    return [...el.querySelectorAll(".blkdesc p")].map(e => ({
        label: e.children[0]?.textContent || undefined,
        value: [...e.childNodes].slice(e.children[0] ? 1 : 0).map(c => ({
            text: c.textContent!,
            url: (c as Element).getAttribute?.("href")?.replace("https://animejoy.ru/", "") || undefined,
        })),
    }));
}

export function getShowPoster<T extends Document | Element | undefined>(el: T) {
    if (typeof el === "undefined") return el;
    return el.querySelector("img.fr-dii.fr-fil")!.getAttribute("src")!.replace(/^/, (import.meta.env.DEV ? "https://animejoy.ru" : ""));
}

export function getShowStatus<T extends Document | Element | undefined>(el: T) {
    if (typeof el === "undefined") return el;
    return (el.querySelector(".full_tv") && "FULL") || (el.querySelector(".ongoinmark") && "ONGOING") || undefined;
}

export function getShowEditDate<T extends Document | Element | undefined>(el: T) {
    if (typeof el === "undefined") return el;
    return el.querySelector(".editdate")?.textContent || undefined;
}