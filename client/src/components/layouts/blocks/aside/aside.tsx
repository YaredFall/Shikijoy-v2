import { PropsWithChildren, forwardRef } from "react";
import QuickSearch from "@/components/layouts/blocks/aside/quick-search";

type AsideProps = PropsWithChildren;

const Aside = forwardRef<HTMLDivElement, AsideProps>(({ children }, ref) => {
    return (
        <aside ref={ref} className={"fixed inset-y-0 right-0 z-10 flex max-h-full w-aside-width shrink-0 flex-col overflow-hidden px-1.5 pb-1.5"}>
            <div className={"h-breadcrumbs-height shrink-0 bg-background-fill py-1.5"}>
                <QuickSearch className={"h-full rounded-md bg-background-primary bg-gradient-to-t from-background-tertiary/15 to-transparent"} />
            </div>
            <div className={"h-full rounded-md bg-background-primary shadow-md "}>
                {children}
            </div>
        </aside>
    );
});

export default Aside;