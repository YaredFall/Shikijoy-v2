import { CSSProperties, PropsWithChildren, forwardRef, useRef, useState } from "react";
import QuickSearch from "@/components/layouts/blocks/aside/quick-search";
import { CSSTransition } from "react-transition-group";
import { cn } from "@/lib/utils";

type AsideProps = PropsWithChildren;

const Aside = forwardRef<HTMLDivElement, AsideProps>(({ children }, ref) => {

    const childrenContainerRef = useRef<HTMLDivElement>(null);

    const [isQSContentOpen, setIsQSContentOpen] = useState(false);
    const qsWrapeerRef = useRef<HTMLDivElement>(null);

    return (
        <aside
            ref={ref}
            className={"relative inset-y-0 right-0 z-10 flex min-h-full w-aside-width shrink-0 flex-col px-1.5 pb-1.5"}
            style={{
                "--available-height": (childrenContainerRef.current?.offsetHeight ?? 0) + "px",
            } as CSSProperties}
        >
            <CSSTransition
                nodeRef={qsWrapeerRef}
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
                    ref={qsWrapeerRef}
                    className={"top-0 z-50 h-breadcrumbs-height shrink-0 bg-background-fill py-1.5"}
                >
                    <QuickSearch
                        className={"h-full rounded-md bg-background-primary bg-gradient-to-t from-background-tertiary/15 to-transparent"}
                        onOpenChange={setIsQSContentOpen}
                        isOpen={isQSContentOpen}
                    />
                </div>
            </CSSTransition>
            <div ref={childrenContainerRef} className={"flex-1 rounded-md bg-background-primary shadow-md"}>
                {children}
            </div>
        </aside>
    );
});

export default Aside;