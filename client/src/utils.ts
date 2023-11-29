export const LINKS = {
  animejoy: process.env.NODE_ENV === "production" ? "https://animejoy.ru" : "http://localhost:3000/api/animejoy/?url="
} as const;

export class ParsingError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ParsingError";
  }
}