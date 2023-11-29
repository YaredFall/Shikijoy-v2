export const LINKS = {
  animejoy: process.env.NODE_ENV === "production" ? "https://animejoy.ru" : "http://localhost:3000/api/animejoy/?url="
} as const;
