import Breadcrumbs from "@/components/layouts/blocks/main/breadcrumbs";
import { PropsWithChildren, forwardRef } from "react";

type MainProps = PropsWithChildren;

const Main = forwardRef<HTMLDivElement, MainProps>(({ children }, ref) => {
    return (
        <main ref={ref} className={"mr-aside-width mb-1.5 rounded-md min-h-full flex flex-col"}>
            <Breadcrumbs />
            <div className={"px-8 bg-background-primary rounded-md pb-4 h-full"}>
                {children}
            </div>
        </main>
    );
});

export default Main;