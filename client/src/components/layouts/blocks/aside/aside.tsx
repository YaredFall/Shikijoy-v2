import { PropsWithChildren, forwardRef } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

type AsideProps = PropsWithChildren;

const Aside = forwardRef<HTMLDivElement, AsideProps>(({ children }, ref) => {
    return (
        <aside ref={ref} className={"bg-white/5 w-aside-width shrink-0 mr-8 z-10 flex flex-col"}>
            <section className={"h-header-width shrink-0group"}>
                <label className={"px-8 flex items-center w-full h-full gap-2"}>
                    <HiMagnifyingGlass className={"text-xl text-primary/.5 group-highlight:text-primary/.75 transition-colors"} />
                    <input className={" w-full h-full py-3 bg-transparent outline-none placeholder:text-primary/.5"} placeholder={"Поиск..."} />
                </label>
            </section>
            <div className={"h-full"}>
                {children}
            </div>
        </aside>
    );
});

export default Aside;