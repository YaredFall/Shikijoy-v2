import { PropsWithChildren, forwardRef } from "react";

type MainProps = PropsWithChildren;

const Main = forwardRef<HTMLDivElement, MainProps>(({ children }, ref) => {
    return (
        <main className={"direct-children:px-8 pt-header-width pb-4"}>
            {children}
        </main>
    );
});

export default Main;