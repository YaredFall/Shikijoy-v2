export const EXTERNAL_LINKS = {
    animejoy: process.env.NODE_ENV === "production" ? "https://animejoy.ru" : "http://localhost:3000/api/animejoy/?url=",
    shikijoyApi: process.env.NODE_ENV === "production" ? "https://shikijoy-v2.fly.dev/api" : "http://localhost:3000/api",
} as const;