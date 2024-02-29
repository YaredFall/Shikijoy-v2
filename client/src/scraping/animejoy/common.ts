export function getUrlOfBGImage(bgImageString: string | undefined) {
    return bgImageString?.replace(/url\("([^"]*)"\)/, "$1") || "";
}

export function getNewsOrRelatedAndPopularItems(nodes: NodeListOf<Element>) {

    return [...nodes].map(e => ({
        titles: [...e.querySelector(".title")!.childNodes].filter(c => (c as HTMLElement).tagName !== "BR").map(c => c.textContent),
        url: e.getAttribute("href")!.replace("https://animejoy.ru", ""),
        poster: getUrlOfBGImage(e.querySelector("i")?.style.backgroundImage),
    }));
}

export function getNewsOrRelatedAndPopular(page: Document | undefined) {
    if (!page) return undefined;

    const related = page.querySelectorAll("#news_rel > .story_line > a");
    const popular = page.querySelectorAll("#news_top > .story_line > a");
    const news = page.querySelectorAll("#news_coms > .story_line > a");

    return ({
        related: related.length ? getNewsOrRelatedAndPopularItems(related) : null,
        news: news.length ? getNewsOrRelatedAndPopularItems(news) : null,
        popular: getNewsOrRelatedAndPopularItems(popular),
    });
}