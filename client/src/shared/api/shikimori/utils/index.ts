import type { UserRateStatus, AnimeKind, AnimeStatus, AnimeRating } from "node-shikimori";

export const SCORE_RATES = [
    "Хуже некуда",
    "Ужасно",
    "Очень плохо",
    "Плохо",
    "Более-менее",
    "Нормально",
    "Хорошо",
    "Отлично",
    "Великолепно",
    "Шедевр",
] as const;

export const USER_RATE_STATUSES = new Map<UserRateStatus, string>([
    ["completed", "Посмотрено"],
    ["dropped", "Брошено"],
    ["on_hold", "Отложено"],
    ["planned", "Запланировано"],
    ["rewatching", "Пересматриваю"],
    ["watching", "Смотрю"],
] as const);

export const SHOW_KIND_MAP = new Map<AnimeKind | "tv_special", string>([
    ["tv", "TV"],
    ["tv_13", "TV"],
    ["tv_24", "TV"],
    ["tv_48", "TV"],
    ["ova", "OVA"],
    ["ona", "ONA"],
    ["movie", "Фильм"],
    ["special", "Спешл"],
    ["music", "Клип"],
    ["tv_special", "TV спецвыпуск"],
] as const);

export const SHOW_STATUS_MAP = new Map<AnimeStatus, string>([
    ["released", "вышло"],
    ["anons", "анонс"],
    ["ongoing", "выходит"],
] as const);

// "pg_13" | "r" | "g" | "pg" | "r_plus" | "rx" | "none"
export const AGE_RATING_MAP = new Map<AnimeRating, { short: string; explained: string; }>([
    ["g", { short: "G", explained: "Без возрастных ограничений" }],
    ["pg", { short: "PG", explained: "Рекомендуется присутствие родителей" }],
    ["pg_13", { short: "PG-13", explained: "Детям до 13 лет просмотр не желателен" }],
    ["r", { short: "R-17", explained: "Лицам до 17 лет обязательно присутствие взрослого" }],
    ["r_plus", { short: "R+", explained: "Лицам до 17 лет просмотр запрещён" }],
    ["rx", { short: "Rx", explained: "Хентай" }],
    ["none", { short: "N/A", explained: "Неизвестно" }],
] as const);

export function humanizeShikimoriDate(date: string) {
    return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
}