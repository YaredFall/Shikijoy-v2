import QuickSearch from "@/animejoy/widgets/aside/ui/quick-search";
import ShikimoriInfo from "@/animejoy/widgets/aside/ui/shikimori-info";
import StoriesTabs from "@/animejoy/widgets/aside/ui/stories-tabs";
import { cn } from "@/shared/lib/cn";
import isNullish from "@/shared/lib/isNullish";
import { useMatch } from "@tanstack/react-router";
import { CSSProperties, forwardRef, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

type AsideProps = Record<never, never>;

const Aside = forwardRef<HTMLDivElement, AsideProps>(({ }, ref) => {

    const childrenContainerRef = useRef<HTMLDivElement>(null);

    const [isQSContentOpen, setIsQSContentOpen] = useState(false);
    const qsWrapperRef = useRef<HTMLDivElement>(null);

    const showRoute = useMatch({ from: "/_layout/_animejoy-pages/$category/$showId/", shouldThrow: false });
    const showRouteLoaderData = useMemo(() => showRoute?.loaderData, [showRoute?.loaderData]);

    const animejoyPageMatch = useMatch({ from: "/_layout/_animejoy-pages", shouldThrow: false });

    return (
        <aside
            ref={ref}
            className={"relative inset-y-0 right-0 z-10 flex min-h-full w-aside-width shrink-0 flex-col px-1.5 pb-1.5"}
            style={{
                "--available-height": (childrenContainerRef.current?.offsetHeight ?? 0) + "px",
            } as CSSProperties}
        >
            <CSSTransition
                nodeRef={qsWrapperRef}
                timeout={150}
                in={isQSContentOpen}
                classNames={{
                    enterDone: "sticky",
                    enter: "sticky",
                    exitActive: cn(window.scrollY > 0 && "animate-fade animate-reverse animate-duration-150 sticky"),
                    exitDone: "relative [&_div[aria-labelledby^=yd-popover]]:hidden",
                }}
            >
                <div
                    ref={qsWrapperRef}
                    className={"top-0 z-50 h-breadcrumbs-height shrink-0 bg-background-fill py-1.5"}
                >
                    <QuickSearch
                        className={"h-full rounded-md bg-background-primary bg-gradient-to-t from-background-tertiary/15 to-transparent"}
                        onOpenChange={setIsQSContentOpen}
                        isOpen={isQSContentOpen}
                    />
                </div>
            </CSSTransition>
            {animejoyPageMatch && (
                <div ref={childrenContainerRef} className={"flex-1 rounded-md shadow-md"}>
                    <div className={"space-y-1.5 "}>
                        {!isNullish(showRouteLoaderData?.shikimoriAnimeId) && <ShikimoriInfo className={"rounded-md bg-background-primary p-4"} />}
                        <StoriesTabs className={""} />
                    </div>
                </div>
            )}
        </aside>
    );
});
Aside.displayName = "Aside";

export default Aside;