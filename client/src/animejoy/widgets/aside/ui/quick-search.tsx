import { ShowStory } from "@/animejoy/entities/story/model";
import { animejoyClient } from "@/animejoy/shared/api/client";
import { useEffectOnChange } from "@/shared/hooks/useOnChange";
import { cn } from "@/shared/lib/cn";
import Image from "@/shared/ui/kit/image";
import TextSkeleton from "@/shared/ui/kit/text-skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/primitives/popover";
import { Link } from "@tanstack/react-router";
import { useDebounce, useThrottle } from "@uidotdev/usehooks";
import { Dispatch, memo, SetStateAction, useMemo, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { PiSpinner } from "react-icons/pi";
import { RiErrorWarningLine } from "react-icons/ri";
import { CSSTransition, SwitchTransition } from "react-transition-group";


type QuickSearchProps = {
    className?: string;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
};

export default function QuickSearch({ className, onOpenChange: setIsOpen, isOpen }: QuickSearchProps) {

    // const [isOpen, setIsOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 750);

    const { data, isLoading, error } = animejoyClient.search.useQuery({ term: debouncedSearchTerm });

    useEffectOnChange(debouncedSearchTerm, () => {
        setIsOpen(!!debouncedSearchTerm && !termIsTooShort);
    });

    // useEffect(() => {
    //     setIsOpen?.(isOpen);
    // }, [isOpen]);

    const termIsTooShort = useMemo(() => !!searchTerm && searchTerm.length < 3 && searchTerm === debouncedSearchTerm, [searchTerm, debouncedSearchTerm]);

    const contentRef = useRef<HTMLDivElement | null>(null);

    const searchbarIcon = useMemo(() => {
        if (isLoading) return <PiSpinner className={"animate-spin"} />;
        else if (error) return <RiErrorWarningLine />;
        else return <HiMagnifyingGlass />;
    }, [error, isLoading]);

    const contentInnerRef = useRef<HTMLUListElement & HTMLParagraphElement | null>(null);
    const contentSwitchAnimationKey = useMemo(() => {
        if (isLoading) return "loading";
        else if (data) return "data";
        else if (error) return "error";
        else return "null";
    }, [data, error, isLoading]);
    const throttledContentSwitchAnimationKey = useThrottle(contentSwitchAnimationKey, 300);
    const popupContent = useMemo(() => {
        switch (throttledContentSwitchAnimationKey) {
            case "loading": return (
                <ul ref={contentInnerRef} className={"flex flex-col gap-4"}>
                    {
                        (new Array<undefined>(4).fill(undefined).map((_, i) => (
                            <li key={debouncedSearchTerm + i} className={""}>
                                <SearchResultItemSkeleton />
                            </li>
                        )))
                    }
                </ul>
            );
            case "data": return (
                <div className={"space-y-3"}>
                    <header className={"-mt-1.5 text-xl leading-none"}>Результаты поиска</header>
                    <ul ref={contentInnerRef} className={"flex flex-col gap-4"}>
                        {
                            (data)?.map((item, i) => (
                                <li key={debouncedSearchTerm + i} className={""}>
                                    <SearchResultItem data={item} />
                                    {/* <div className="h-48 bg-red-500"></div> */}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            );
            case "error": return <p ref={contentInnerRef}>{error?.message || "Произошла непредвиденная ошибка"}</p>;
            case "null": return <p></p>;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [throttledContentSwitchAnimationKey, data]);

    const inputAreaRef = useRef<HTMLDivElement>(null);

    return (
        <Popover
            open={isOpen && !termIsTooShort}
            onOpenChange={setIsOpen}
            className={"h-full"}
            closeOnPointerDownOutside={false}
        >
            <section className={cn("group relative text-foreground-primary/.75", className)} ref={inputAreaRef}>
                <label className={"flex size-full cursor-text items-center gap-2 px-12"}>
                    <div className={"absolute left-5 text-xl text-foreground-primary/.5 transition-colors group-highlight:text-foreground-primary/.75"}>
                        {searchbarIcon}
                    </div>
                    <input
                        className={" size-full bg-transparent outline-none placeholder:text-foreground-primary/.5"}
                        placeholder={"Быстрый поиск..."}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                    {
                        termIsTooShort
                        && (
                            <div className={"absolute inset-x-0 bottom-0 animate-fade px-[inherit] text-xs font-medium text-danger/.75 animate-duration-150"}>
                                <span>минимум 3 символа</span>
                            </div>
                        )
                    }
                </label>
                <PopoverTrigger
                    className={cn(
                        "z-50 absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors",
                        data || error || isLoading ? "text-foreground-primary/.5 highlight:text-foreground-primary/.75" : "text-foreground-primary/.125",
                    )}
                    disabled={!data && !error && !isLoading}
                    onClick={() => {
                        setIsOpen(prev => !prev);
                    }}
                >
                    <FaCaretDown className={cn("transition-transform", isOpen ? "rotate-0" : "rotate-90")} />
                </PopoverTrigger>
            </section>
            <CSSTransition
                nodeRef={contentRef}
                in={isOpen}
                unmountOnExit
                mountOnEnter
                timeout={150}
                appear
                classNames={{
                    enter: "animate-fade-down",
                    exit: "animate-fade animate-reverse",
                }}
            >
                <PopoverContent
                    ref={contentRef}
                    forceMount
                    className={cn(
                        "z-40 relative mt-1.5 h-[calc(100vh-theme(spacing.breadcrumbs-height))] pb-1.5 animate-duration-150 bg-background-fill animate-fill-both",
                    )}
                >
                    <div className={"h-full overflow-hidden rounded-md bg-background-primary"}>
                        <div className={"h-full overflow-y-auto overscroll-contain bg-gradient-to-b from-accent-primary/5 to-transparent p-5"}>
                            <SwitchTransition>
                                <CSSTransition
                                    key={throttledContentSwitchAnimationKey + debouncedSearchTerm}
                                    nodeRef={contentInnerRef}
                                    appear
                                    addEndListener={(done) => {
                                        contentInnerRef.current?.addEventListener("animationend", done, false);
                                    }}
                                    unmountOnExit
                                    mountOnEnter
                                    classNames={{
                                        enter: "opacity-0",
                                        enterActive: "animate-fade animate-duration-300 animate-delay-0",
                                        exitActive: "animate-fade animate-reverse animate-duration-75",
                                    }}
                                >
                                    {popupContent}
                                </CSSTransition>
                            </SwitchTransition>
                        </div>
                    </div>
                </PopoverContent>
            </CSSTransition>
        </Popover>
    );
}

function SearchResultItem({ data: { url, poster, title } }: { data: ShowStory; }) {
    return (
        <Link
            to={url}
            onFocus={(e) => {
                (e.target as unknown as HTMLElement).scrollIntoView({
                    block: "nearest",
                });
            }}
            onClick={(e) => {
                e.preventDefault();
            }}
            className={"cursor-auto rounded-sm outline-offset-4"}
        >
            <article className={"flex gap-3 leading-[1.125]"}>
                <Link to={url} tabIndex={-1} className={"shrink-0"}>
                    <Image src={poster} className={"aspect-poster h-48 rounded highlight:brightness-95"} />
                </Link>
                <div className={"flex flex-col gap-1.5 py-0.5"}>
                    <Link to={url} tabIndex={-1}><p className={"link leading-[inherit]"}>{title.ru}</p></Link>
                    <Link to={url} tabIndex={-1}><p className={"link text-sm leading-[inherit] text-foreground-primary/.75"}>{title.romanji}</p></Link>
                </div>
            </article>
        </Link>
    );
}


const randomWidth = () => 90 + Math.random() * 10 + "%";
const getRandomWidth = () => ({ width: randomWidth() });
const lines = () => new Array(1 + ~~(Math.random() * 4)).fill(1);

function SearchResultItemSkeletonFn() {

    const lengths = lines();

    return (
        <article className={"flex gap-3 leading-[1.125]"}>
            <Image className={"aspect-poster h-48 rounded"} />
            <div className={"flex w-full flex-col gap-1.5 py-0.5"}>
                <p className={"flex flex-col gap-1"}>
                    <TextSkeleton length={lengths} style={getRandomWidth} />
                    <TextSkeleton length={10} className={"self-start"} />
                </p>
                <p className={"flex flex-col gap-1 text-xs"}>
                    <TextSkeleton length={lengths} style={getRandomWidth} />
                    <TextSkeleton length={10} className={"self-start"} />
                </p>
            </div>
        </article>
    );
}
const SearchResultItemSkeleton = memo(SearchResultItemSkeletonFn);