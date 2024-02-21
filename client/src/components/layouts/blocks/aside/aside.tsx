import { PropsWithChildren, forwardRef } from "react";
import QuickSearch from "@/components/layouts/blocks/aside/quick-search";

type AsideProps = PropsWithChildren;

const Aside = forwardRef<HTMLDivElement, AsideProps>(({ children }, ref) => {
    return (
        <aside ref={ref} className={"w-aside-width max-h-full fixed inset-y-0 right-0 overflow-hidden shrink-0 px-1.5 z-10 flex flex-col pb-1.5"}>
            <div className={"h-breadcrumbs-height shrink-0 py-1.5 bg-background-fill"}>
                <QuickSearch className={"h-full bg-background-primary rounded-md bg-gradient-to-t from-background-tertiary/15 to-transparent"} />
            </div>
            <div className={"h-full shadow-md bg-background-primary rounded-md "}>
                {children}
            </div>
        </aside>
    );
});

export default Aside;