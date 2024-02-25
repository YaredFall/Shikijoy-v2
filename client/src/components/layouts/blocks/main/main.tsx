import Breadcrumbs from "@/components/layouts/blocks/main/breadcrumbs";
import { PropsWithChildren, forwardRef } from "react";

type MainProps = PropsWithChildren;

const Main = forwardRef<HTMLDivElement, MainProps>(({ children }, ref) => {
    return (
        <main ref={ref} className={"mb-1.5 mr-aside-width flex min-h-full flex-col rounded-md"}>
            <Breadcrumbs />
            <div className={"h-full rounded-md bg-background-primary px-8 pb-4"}>
                {children}
            </div>
        </main>
    );
});

export default Main;