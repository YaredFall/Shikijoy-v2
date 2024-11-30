export const ANIMEJOY_HOSTNAME = ["animejoy.ru", "animejoy.site"] as const;

export const SCRIPT_MATCHES = ANIMEJOY_HOSTNAME.map((h) => `https://*.${h}/*`);
export const SCRIPT_EXCLUDE_MATCHES = ANIMEJOY_HOSTNAME.map((h) => [
    `https://*.${h}/engine/*`,
    `https://*.${h}/uploads/*`,
    `https://*.${h}/*.png`,
]).flat();
