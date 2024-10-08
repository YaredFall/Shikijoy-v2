import { getShowTitle, getShowPoster, getShowStatus, getShowDescription, getShowDetails, getShowEditDate } from "@client/animejoy/entities/show/scraping";
import { SHOW_CATEGORIES, categoryLabel } from "@client/shared/routing/category";
import isNullish from "@client/shared/lib/isNullish";
import { handleAnimejoyLink, ScrapeError } from "@client/animejoy/shared/scraping";
import { ShowStory } from "@client/animejoy/entities/story/model";

export function getShowsList(page: Document | undefined): ShowStory[] | undefined {
    if (!page) return undefined;

    const stories = page.querySelectorAll(".block.story.shortstory");

    if (stories.length === 0) return undefined;

    return [...stories].map(story => ({
        url: handleAnimejoyLink(story.querySelector(".ntitle a")!.getAttribute("href")!),
        title: getShowTitle(story),
        poster: getShowPoster(story),
        status: getShowStatus(story),
        description: getShowDescription(story),
        info: getShowDetails(story),
        editDate: getShowEditDate(story),

        categories: [...story.querySelectorAll(".category a")].map((anchor) => {
            const href = anchor.getAttribute("href");
            if (href == null) throw new ScrapeError("Failed to get show category href");
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
    return isNullish(last) ? undefined : +last;
}