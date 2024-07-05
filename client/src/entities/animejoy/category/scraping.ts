import { getShowTitle, getShowPoster, getShowStatus, getShowDescription, getShowInfo, getShowEditDate } from "@/entities/animejoy/show/scraping";
import { ScrapeError } from "@/shared/api/animejoy/utils";
import { SHOW_CATEGORIES, categoryLabel } from "@/shared/routing/category";
import { StoryData } from "./model";


export function getStoryList(page: Document | undefined): StoryData[] | undefined {
    if (!page) return undefined;

    const stories = page.querySelectorAll(".block.story.shortstory");

    if (!stories || stories.length === 0) {
        return undefined;
    }

    return [...stories].map(story => ({
        url: story.querySelector(".ntitle a")!.getAttribute("href")!.replace("https://animejoy.ru", ""),
        title: getShowTitle(story),
        poster: getShowPoster(story),
        status: getShowStatus(story),
        description: getShowDescription(story),
        info: getShowInfo(story),
        editDate: getShowEditDate(story),

        categories: [...story.querySelectorAll(".category a") ?? []].map((anchor) => {
            const href = anchor.getAttribute("href");
            if (!href) throw new ScrapeError("Failed to get show category href");
            const url = new URL(href);
            const segments = url.pathname.split("/");
            const path = segments.pop() || segments.pop();
            const category = SHOW_CATEGORIES.find(c => c === path);
            return category ? { label: categoryLabel(category), path: category } : { label: anchor.textContent!, path: path! };
        }),
        comments: Number(story.querySelector(".meta_coms")?.textContent) || undefined,
    }));
}

export function getNavigationPagesCount(page: Document | undefined) {
    if (!page) return undefined;

    const pages = page.querySelector(".block.navigation .pages")?.children;
    const last = pages ? [...pages].at(-1)?.textContent : undefined;
    return last ? +last : undefined;
}