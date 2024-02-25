export const EXTERNAL_LINKS = {
    animejoy: process.env.NODE_ENV === "production" ? "https://animejoy.ru" : "http://localhost:3000/api/animejoy/?url=",
    shikijoyApi: process.env.NODE_ENV === "production" ? "https://shikijoy-v2.fly.dev/api" : "http://localhost:3000/api",
    shikimori: "https://shikimori.one",
} as const;

export const SHIKIJOY_API_ROUTES = {
    shikimori_anime: (id: number | string) => `/shikimori/animes/${id}`,
    shikimori_character: (id: number | string) => `/shikimori/characters/${id}`,
    shikimori_person: (id: number | string) => `/shikimori/people/${id}`,
} as const;