export function getOriginalPathname(url: string) {
  const urlObject = new URL(url);

  return process.env.NODE_ENV === "production" ? urlObject.pathname + urlObject.search : urlObject.search.replace("?url=", "");
}