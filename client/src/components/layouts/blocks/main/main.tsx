import { PropsWithChildren, forwardRef } from "react";

type MainProps = PropsWithChildren;

const Main = forwardRef<HTMLDivElement, MainProps>(({ children }, ref) => {
    return (
        <main className={"direct-children:px-8 mt-breadcrumbs-height mr-aside-width pb-1.5 rounded-md  "}>
            <div className={"bg-background-primary rounded-md pb-4 min-h-full "}>
                {children}
            </div>
        </main>
    );
});

export default Main;