import { animejoyClient } from "@/animejoy/shared/api/client";
import { pageDataTransformer } from "@/animejoy/shared/api/client/page";
import { useEffectOnChange } from "@/shared/hooks/useOnChange";
import { cn } from "@/shared/lib/cn";
import { Link, useParams } from "@tanstack/react-router";
import { PropsWithChildren, useMemo } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";


export default function Pagination() {

    const searchParams = useParams({ strict: false });

    const currentPage = +(searchParams.page ?? 1);

    const [{ pagesCount }] = animejoyClient.page.useSuspenseQuery(undefined, {
        select: data => pageDataTransformer["$category.$page"][200](data),
    });

    let pagesNumbers = pagesCount
        ? [...Array(Math.min(10, pagesCount))].map((_, i) => ({
            value: currentPage + i + (pagesCount <= 9 || currentPage < 5 ? 1 - currentPage : -4)
            + (pagesCount <= 9 || (pagesCount - currentPage) > 4 ? 0 : -4 - currentPage + pagesCount),
            key: i,
        }))
        : undefined;

    if (pagesCount && pagesCount > 9) {
        pagesNumbers = pagesNumbers
            ? pagesNumbers.slice(
                (currentPage > 5 || pagesCount! - currentPage < 4) ? 2 : 0,
                (currentPage > 5 && pagesCount! - currentPage < 4) ? -1 : -3,
            )
            : undefined;
    }

    useEffectOnChange(currentPage, () => {
        scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    return (
        <div className={"flex h-header-width items-center justify-between gap-8 text-sm text-foreground-primary/.75"}>
            {
                pagesCount && pagesCount > 1 && pagesNumbers
                && (
                    <>
                        {/* <Link className={currentPage - 1 > 0 ? undefined : styles.disabled}
                to={currentPage - 1 > 0 ? `${category}/page/${currentPage - 1}/` : ""}
                children={<MemoizedLeftIcon />}
                tabIndex={currentPage - 1 > 0 ? undefined : -1}
              /> */}
                        <PageButton page={currentPage - 1} disabled={currentPage < 2}><SlArrowLeft /></PageButton>
                        <div className={"flex gap-8"}>
                            {
                                currentPage > 5 && pagesCount > 9
                                && (
                                    <>
                                        <PageButton page={1}>1</PageButton>
                                        <span className={"p-2"}>...</span>
                                    </>
                                )
                            }

                            {
                                pagesNumbers.map(p =>
                                    <PageButton key={p.key} page={p.value} disabled={currentPage === p.value}>{p.value}</PageButton>,
                                    // <Link key={p.key}
                                    //   className={p.value === currentPage ? "styles.disabled" : undefined}
                                    //   to={`${category}/page/${p.value}/`}
                                    //   children={p.value}
                                    //   tabIndex={p.value === currentPage ? -1 : undefined}
                                    // />
                                )
                            }

                            {
                                pagesCount - currentPage >= 4 && pagesCount > 9
                                && (
                                    <>
                                        <span className={"p-2"}>...</span>
                                        <PageButton page={pagesCount}>{pagesCount}</PageButton>
                                    </>
                                )
                            }
                        </div>
                        <PageButton page={currentPage + 1} disabled={currentPage + 2 > pagesCount}><SlArrowRight /></PageButton>
                        {/* <Link className={currentPage + 1 <= pagesCount ? undefined : "styles.disabled"}
                to={currentPage + 1 <= pagesCount ? `${category}/page/${currentPage + 1}/` : ""}
                children={<SlArrowRight />}
                tabIndex={currentPage + 1 <= pagesCount ? undefined : -1}
              /> */}
                    </>
                )
            }
        </div>
    );
}

type PageButtonProps = PropsWithChildren<{
    page: number;
    disabled?: boolean;
}>;

function PageButton({ page, disabled, children }: PageButtonProps) {

    const searchParams = useParams({ strict: false });

    const to = useMemo(() => {
        if (searchParams.category) return page > 1 ? "/$category/page/$page" : "/$category";
        else return page > 1 ? "/page/$page" : "/";
    }, [page, searchParams.category]);

    return (
        <Link
            className={cn("p-2 highlight:text-foreground-primary transition-colors", disabled && "text-foreground-primary/.25 pointer-events-none")}
            tabIndex={disabled ? -1 : undefined}
            to={to}
            params={{
                category: searchParams.category,
                page: page > 1 ? page.toString() : undefined,
            }}
            //   tabIndex={currentPage - 1 > 0 ? undefined : -1}
        >
            {children}
        </Link>
    );
}