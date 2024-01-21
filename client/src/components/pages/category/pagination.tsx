import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { getNavigationPagesCount } from "@/scraping/animejoy/categories";
import { ShowCategory } from "@/types/animejoy";
import { ComponentProps, ReactNode, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, LinkProps, useParams } from "react-router-dom";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { cn } from "@/lib/utils";
import { useOnChange } from "@/hooks/useOnChange";

type PaginationProps = {
  category: ShowCategory;
};

export default function Pagination({ category }: PaginationProps) {

  const { pageIndex } = useParams();

  const currentPage = +(pageIndex ?? 1);
  
  const [pagesCount, setPagesCount] = useState<number>();
  const { data } = useAnimejoyPage(undefined, (data) => {
    data && setPagesCount(getNavigationPagesCount(data.page));
  });

  useOnChange(category, () => {
    !data && setPagesCount(undefined);
  });

  let pagesNumbers = pagesCount ? [...Array(Math.min(10, pagesCount))].map((_, i) => ({
    value: currentPage + i + (pagesCount <= 9 || currentPage < 5 ? 1 - currentPage : -4)
        + (pagesCount <= 9 || (pagesCount - currentPage) > 4 ? 0 : -4 - currentPage + pagesCount),
    key: i
  })) : undefined;

  if (pagesCount && pagesCount > 9) {
    pagesNumbers = pagesNumbers ? pagesNumbers.slice(
      (currentPage > 5 || pagesCount! - currentPage < 4) ? 2 : 0,
      (currentPage > 5 && pagesCount! - currentPage < 4) ? -1 : -3
    ) : undefined;
  }

  return (
    <div className={"flex justify-between gap-2 items-center text-primary/.75 h-10"}>
      {pagesCount && pagesCount > 1 && pagesNumbers &&
            <>
              {/* <Link className={currentPage - 1 > 0 ? undefined : styles.disabled}
                to={currentPage - 1 > 0 ? `${category}/page/${currentPage - 1}/` : ""}
                children={<MemoizedLeftIcon />}
                tabIndex={currentPage - 1 > 0 ? undefined : -1}
              /> */}
              <PageButton category={category} page={currentPage-1} disabled={currentPage < 2}><SlArrowLeft /></PageButton>
              {
                currentPage > 5 && pagesCount > 9 &&
                    <>
                      <PageButton category={category} page={1}>1</PageButton>
                      <span className="p-2">...</span>
                    </>
              }

              {
                pagesNumbers.map((p, i) =>
                  <PageButton key={p.key} category={category} page={p.value} disabled={currentPage === p.value}>{p.value}</PageButton>
                // <Link key={p.key}
                //   className={p.value === currentPage ? "styles.disabled" : undefined}
                //   to={`${category}/page/${p.value}/`}
                //   children={p.value}
                //   tabIndex={p.value === currentPage ? -1 : undefined}
                // />
                )
              }

              {
                pagesCount - currentPage >= 4 && pagesCount > 9 &&
                    <>
                      <span className="p-2">...</span>
                      <PageButton category={category} page={pagesCount}>{pagesCount}</PageButton>
                    </>
              }
              <PageButton category={category} page={currentPage + 1} disabled={currentPage + 2 > pagesCount}><SlArrowRight /></PageButton>
              {/* <Link className={currentPage + 1 <= pagesCount ? undefined : "styles.disabled"}
                to={currentPage + 1 <= pagesCount ? `${category}/page/${currentPage + 1}/` : ""}
                children={<SlArrowRight />}
                tabIndex={currentPage + 1 <= pagesCount ? undefined : -1}
              /> */}
            </>
      }
    </div>
  );
}

type PageButtonProps = {
  category: ShowCategory;
  page: number;
  disabled?: boolean;
  children?: ReactNode;
};

function PageButton({ category, page, disabled, children }: PageButtonProps) {
  return (
    <Link 
      className={cn("p-2 highlight:text-primary transition-colors", disabled && "text-primary/.25 pointer-events-none")}
      tabIndex={disabled ? -1 : undefined}
      to={page > 1 ? `${category.path && "/"}${category.path}/page/${page}/` : `${category.path && "/"}${category.path}/`}
      //   tabIndex={currentPage - 1 > 0 ? undefined : -1}
      children={children}
    />
  );
}