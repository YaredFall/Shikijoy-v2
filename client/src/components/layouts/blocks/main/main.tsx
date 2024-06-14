import Breadcrumbs from "@/components/layouts/blocks/main/breadcrumbs";
import { PropsWithChildren, forwardRef } from "react";

type MainProps = PropsWithChildren<{
    className?: string;
}>;

const Main = forwardRef<HTMLDivElement, MainProps>(({ children, className }, ref) => {
    return (
        <main ref={ref} className={"mb-1.5 min-h-full"}>
            <Breadcrumbs />
            <div className={className}>
                {children}
            </div>
        </main>
    );
});

export default Main;