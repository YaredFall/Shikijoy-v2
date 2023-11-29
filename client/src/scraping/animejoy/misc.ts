export function getAnimeIdFromPathname(pathname: string) {
  return pathname.match(/.*\/(?:page,\d*,\d*,)?(?<id>\d*)-/)?.groups?.id;
}

export function getOriginalPathname(url: string) {
  const urlObject = new URL(url);

  return process.env.NODE_ENV === "production" ? urlObject.pathname + urlObject.search : urlObject.search.replace("?url=", "");
}