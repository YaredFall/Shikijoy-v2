import { getShowDescription, getShowEditDate, getShowInfo, getShowPoster, getShowStatus, getShowTitle } from "@/entities/animejoy/show/scraping";
import { StoryData } from "@/types/animejoy";
import { ScrapeError } from "@/utils/errors";
import { SHOW_CATEGORIES } from "@/utils/routing";

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
            const category = SHOW_CATEGORIES.find(c => c.path === path);
            return category ?? { name: anchor.textContent!, path: path! };
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