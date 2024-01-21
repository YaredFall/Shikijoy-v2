import { ShowCategory } from "@/types/animejoy";

export const HOME_AS_CATEGORY: ShowCategory = {path: "", name: "Главная"};
export const SHOW_CATEGORIES = [
    {
        path: "tv-serialy",
        name: "TV сериалы"
    },
    {
        path: "ongoing",
        name: "Онгоинги"
    },
    {
        path: "full_tv",
        name: "Завершённые"
    },
    {
        path: "ova",
        name: "OVA/ONA/OAV"
    },
    {
        path: "anime-films",
        name: "Аниме фильмы"
    },
    {
        path: "anons",
        name: "Анонсы"
    },
    {
        path: "news",
        name: "Новости"
    },
    {
        path: "dorams",
        name: "Дорамы"
    }
];
export function categoryByName(path: string) { return SHOW_CATEGORIES.find(c => c.path === path); }