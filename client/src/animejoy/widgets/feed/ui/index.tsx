import ShowCard from "@client/animejoy/entities/story/ui/show-card";
import { animejoyClient } from "@client/animejoy/shared/api/client";
import { categoryTransformer } from "@client/animejoy/shared/api/client/page";
import Container from "@client/shared/ui/kit/container";
import Pagination from "@client/shared/ui/kit/pagination";


export default function Feed() {
    //   const location = useLocation();
    //   let category = location.pathname.split("/")[1];
    //   category = category === "page" ? "" : category;

    //   const lastCategory = useRef(category);

    //   const { data: page, isLoading } = useAnimejoyPage(window.location.pathname.match(/\/page\/\d+\/?$/)
    //     ? window.location.pathname
    //     : (category ? `/${category}/page/1/` : "/page/1/"));
    const [{ stories }] = animejoyClient.page.useSuspenseQuery(undefined, {
        select: data => categoryTransformer(data),
    });

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
        <Container className={"px-6 py-0"}>
            <Pagination />
            <section className={"flex flex-col gap-8"}>
                {
                    (stories ?? Array(10).fill(undefined)).map((s, i) => <ShowCard key={i} data={s} />)
                }
            </section>
            <Pagination />
        </Container>
    );
}