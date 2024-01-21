import { ShowCategory } from "@/types/animejoy";

export const HOME_AS_CATEGORY = { path: "", name: "Главная" } as const satisfies ShowCategory;
export const SHOW_CATEGORIES = [
    {
        path: "tv-serialy",
        name: "TV сериалы",
    },
    {
        path: "ongoing",
        name: "Онгоинги",
    },
    {
        path: "full_tv",
        name: "Завершённые",
    },
    {
        path: "ova",
        name: "OVA/ONA/OAV",
    },
    {
        path: "anime-films",
        name: "Аниме фильмы",
    },
    {
        path: "anons",
        name: "Анонсы",
    },
    {
        path: "dorams",
        name: "Дорамы",
    },
    {
        path: "news",
        name: "Новости",
    },
] as const;
export function categoryByName(path: string) {
    return SHOW_CATEGORIES.find(c => c.path === path);
}