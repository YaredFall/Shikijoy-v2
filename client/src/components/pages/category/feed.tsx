import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { getStoryList } from "@/scraping/animejoy/categories";
import { useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import StoryCard from "./story-card";
import { ShowCategory } from "@/types/animejoy";
import Pagination from "./pagination";

type FeedProps = {
    category: ShowCategory;
};

export default function Feed({ category }: FeedProps) {
    //   const location = useLocation();
    //   let category = location.pathname.split("/")[1];
    //   category = category === "page" ? "" : category;

    //   const lastCategory = useRef(category);

    //   const { data: page, isLoading } = useAnimejoyPage(window.location.pathname.match(/\/page\/\d+\/?$/)
    //     ? window.location.pathname
    //     : (category ? `/${category}/page/1/` : "/page/1/"));
    const { data, isLoading } = useAnimejoyPage(undefined, (data) => {
        if (data) {
            document.title = data.page.title;
        }
    });

    const stories = useMemo(() => getStoryList(data?.page), [data]);
    //   const [pagesCount, setPagesCount] = useState<number | undefined>(undefined);


    //   useLayoutEffect(() => {
    //     const nevCount = getNavigationPagesCount(page);

    //     if (!isLoading && pagesCount !== nevCount) {
    //       setPagesCount(nevCount);
    //     } else if (isLoading && category !== lastCategory.current) {
    //       setPagesCount(undefined);
    //     }
    //     lastCategory.current = category;
    //
    //   }, [page, isLoading]);


    return (
    // <div className={styles.categoryPage}>
    //   <div className={styles.pagesNav}>
    //     <h1>
    //       <LoadableText placeholderLength={10}
    //         children={category ? [...Categories.entries()].find(c => c[1] === category)![0]
    //           : pagesCount ? "Главная" : undefined}
    //       />
    //     </h1>
    //     <PagesNavigation pagesCount={pagesCount} currentPage={id ? +id : 1} category={category ? "/" + category : undefined} />
    //   </div>
    //   <section className={styles.storylist}>
    //     {stories ? stories.map((s, i) => <CategoryStorycard key={i} data={s} />)
    //       : [...Array(10)].map((s, i) => <CategoryStorycard key={i} data={undefined} />)
    //     }
    //   </section>
    //   <div className={styles.pagesNav}>
    //     <PagesNavigation pagesCount={pagesCount} currentPage={id ? +id : 1} category={category ? "/" + category : undefined} />
    //   </div>
    // </div>
        <div>
            <Pagination category={category} />
            <section className={"flex flex-col gap-8"}>
                {
                    (stories ?? Array(10).fill(undefined)).map((s, i) => <StoryCard key={i} data={s} />)
                }
            </section>
            <Pagination category={category} />
        </div>
    );
}