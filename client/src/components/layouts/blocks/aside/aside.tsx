import { PropsWithChildren, forwardRef } from "react";
import QuickSearch from "@/components/layouts/blocks/aside/quick-search";

type AsideProps = PropsWithChildren;

const Aside = forwardRef<HTMLDivElement, AsideProps>(({ children }, ref) => {
    return (
        <aside ref={ref} className={"w-aside-width max-h-full overflow-hidden shrink-0 mx-1.5 z-10 flex flex-col pb-1.5"}>
            <div className={"h-breadcrumbs-height shrink-0 py-1.5"}>
                <QuickSearch className={"h-full bg-background-primary rounded-md bg-gradient-to-t from-white/5 to-transparent"} />
            </div>
            <div className={"h-full shadow-md bg-background-primary rounded-md "}>
                {children}
            </div>
        </aside>
    );
});

export default Aside;