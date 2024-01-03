import { StoryData } from "@/types/animejoy";
import { getShowTitle } from "./shows";
import { ParsingError, SHOW_CATEGORIES } from "@/utils";

export function getStoryList(page: Document | undefined): StoryData[] | undefined {
  if (!page) return undefined;

  const stories = page.querySelectorAll(".block.story.shortstory");

  if (!stories || stories.length === 0) {
    return undefined;
  }

  return [...stories].map(story => ({
    title: getShowTitle(story)!,
    url: story.querySelector(".ntitle a")!.getAttribute("href")!.replace("https://animejoy.ru", ""),
    poster: story.querySelector("img")!.getAttribute("src")!.replace(/^/, (import.meta.env.DEV ? "https://animejoy.ru" : "")),
    status: story.querySelector(".full_tv") && "FULL" || story.querySelector(".ongoinmark") && "ONGOING" || undefined,
    description: story.querySelector(".pcdescr")?.children[0]?.childNodes[1]?.textContent || undefined,
    info: [...story.querySelectorAll(".blkdesc p")].map(e => ({
      label: e.children[0]?.textContent || undefined,
      value: [...e.childNodes].slice(e.children[0] ? 1 : 0).map(c => ({
        text: c.textContent!,
        url: (c as Element).getAttribute && (c as Element).getAttribute("href")?.replace("https://animejoy.ru/", "") || undefined
      }))
    })),
    editDate: story.querySelector(".editdate")?.textContent || undefined,
    // category: [...story.querySelector(".category")?.children || []].slice(1).map(
    //   e => e.textContent!.replace("Ongoing", categoryName("ongoing")).replace("Аниме Фильмы", categoryName("anime-films")).replace("Анонс", categoryName("anons"))
    // ),
    categories: [...story.querySelectorAll(".category a") ?? []].map(anchor => {
      const href = anchor.getAttribute("href");
      if (!href) throw new ParsingError("Failed to get show category href");
      const url = new URL(href);
      const segments = url.pathname.split("/");
      const path = segments.pop() || segments.pop();
      const category = SHOW_CATEGORIES.find(c => c.path === path);
      return category ?? { name: anchor.textContent!, path: path!};
    }),
    comments: Number(story.querySelector(".meta_coms")?.textContent) || undefined
  }));
}