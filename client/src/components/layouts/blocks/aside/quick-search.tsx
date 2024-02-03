import useDebounced from "@/hooks/useDebounced";
import { cn } from "@/lib/utils";
import { useAnimejoySearch } from "@/query-hooks/useAnimejoySearch";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaCaretDown } from "react-icons/fa";
import Image from "@/components/ui/image";
import { Link } from "@/components/utility/Link";
import { useOnChange } from "@/hooks/useOnChange";

type QuickSearchProps = {
    className?: string;
};

export default function QuickSearch({ className }: QuickSearchProps) {

    const [isOpen, setIsOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounced(searchTerm, 500);

    const { data, isLoading, error, isError } = useAnimejoySearch(debouncedSearchTerm);

    useOnChange(data, () => {
        setIsOpen(true);
    });

    return (
        <Popover.Root
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <Popover.Anchor asChild>
                <section className={cn("group relative text-foreground-primary/.75 pt-0.5", className)}>
                    <label className={"h-full px-8 flex items-center w-full gap-2 cursor-text"}>
                        <HiMagnifyingGlass className={"text-xl group-highlight:text-foreground-primary/.75 transition-colors"} />
                        <input
                            className={" w-full h-full bg-transparent outline-none placeholder:text-foreground-primary/.5"}
                            placeholder={"Быстрый поиск..."}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        />
                    </label>
                    <Popover.Trigger
                        className={cn(
                            "z-50 absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors",
                            data ? "text-foreground-primary/.5 highlight:text-foreground-primary/.75" : "text-foreground-primary/.25",
                        )}
                        disabled={!data}
                        onClick={() => {
                            setIsOpen(prev => !prev);
                        }}
                    >
                        <FaCaretDown className={cn("transition-transform", isOpen ? "rotate-0" : "rotate-90")} />
                    </Popover.Trigger>
                </section>
            </Popover.Anchor>
            {
                data && (
                    <Popover.Content
                        onOpenAutoFocus={(e) => {
                            e.preventDefault();
                        }}
                        onPointerDownOutside={(e) => {
                            e.preventDefault();
                        }}
                        onFocusOutside={(e) => {
                            e.preventDefault();
                        }}
                        sideOffset={0}
                        className={cn(
                            "z-40 w-[var(--radix-popper-anchor-width)] h-[calc(var(--radix-popper-available-height)_-_.75rem)] my-1.5 overflow-hidden rounded-md min-h-full bg-neutral-800 animate-fade-down animate-duration-150",
                            // isCollapsed && "hidden",
                        )}
                    >
                        <ul className={"h-full p-5 bg-gradient-to-b from-accent-primary/5 to-[100vh] to-transparent overflow-y-auto flex flex-col gap-5"}>
                            {data?.map(({ poster, title, url }) => (
                                <li key={url} className={""}>
                                    <Link
                                        to={url}
                                        onFocus={(e) => {
                                            e.target.scrollIntoView({
                                                block: "nearest",
                                            });
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                        className={"cursor-auto rounded-sm outline-offset-4"}
                                    >
                                        <article className={"flex gap-3 leading-[1.125]"}>
                                            <Link to={url} tabIndex={-1}>
                                                <Image src={poster} className={"highlight:brightness-95 h-48 aspect-poster rounded"} />
                                            </Link>
                                            <div className={"flex flex-col gap-1.5 py-0.5"}>
                                                <Link to={url} tabIndex={-1}><p className={"link leading-[inherit]"}>{title.ru}</p></Link>
                                                <Link to={url} tabIndex={-1}><p className={"link text-foreground-primary/.75 text-sm leading-[inherit]"}>{title.romanji}</p></Link>
                                            </div>
                                        </article>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Popover.Content>
                )
            }
        </Popover.Root>
    );
}