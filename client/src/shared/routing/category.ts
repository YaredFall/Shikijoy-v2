import { z } from "zod";

export const SHOW_CATEGORIES = [
    "tv-serialy",
    "ongoing",
    "full_tv",
    "ova",
    "anime-films",
    "anons",
    "dorams",
] as const;

export const NEWS_AS_CATEGORY = "news";

export const CATEGORIES = [...SHOW_CATEGORIES, NEWS_AS_CATEGORY] as const;
export type ShowCategory = typeof CATEGORIES[number];

export const KnownCategorySchema = z.enum(CATEGORIES);

const CATEGORY_LABELS: Record<ShowCategory, string> = {
    "tv-serialy": "TV сериалы",
    "ongoing": "Онгоинги",
    "full_tv": "Завершённые",
    "ova": "OVA/ONA/OAV",
    "anime-films": "Аниме фильмы",
    "anons": "Анонсы",
    "dorams": "Дорамы",
    "news": "Новости",
};

export const categoryLabel = (category: ShowCategory | string): string => {
    return CATEGORY_LABELS[category as ShowCategory];
};
// export const HOME_AS_CATEGORY = { path: "", name: "Главная" } as const satisfies ShowCategory;
// export const SHOW_CATEGORIES = [
//     {
//         path: "tv-serialy",
//         name: "TV сериалы",
//     },
//     {
//         path: "ongoing",
//         name: "Онгоинги",
//     },
//     {
//         path: "full_tv",
//         name: "Завершённые",
//     },
//     {
//         path: "ova",
//         name: "OVA/ONA/OAV",
//     },
//     {
//         path: "anime-films",
//         name: "Аниме фильмы",
//     },
//     {
//         path: "anons",
//         name: "Анонсы",
//     },
//     {
//         path: "dorams",
//         name: "Дорамы",
//     },
//     {
//         path: "news",
//         name: "Новости",
//     },
// ] as const satisfies readonly ShowCategory[];

// export function categoryByName(path: string) {
//     return SHOW_CATEGORIES.find(c => c.path === path);
// }