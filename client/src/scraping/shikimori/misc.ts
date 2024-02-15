export function humanizeShikimoriDate(date: string) {
    return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
}