
import { getFranchise } from "@/animejoy/entities/show/scraping";
import { animejoyPageQueryOptions } from "@/animejoy/shared/api";
import { cn } from "@/shared/lib/cn";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/shared/ui/primitives/disclosure";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import pluralize from "plural-ru";
import { TbSelector } from "react-icons/tb";

type FranchiseBlockProps = Record<never, never>;

export default function FranchiseBlock({}: FranchiseBlockProps) {

    
    const { data } = useSuspenseQuery({
        ...animejoyPageQueryOptions(),
        select: data => getFranchise(data.document),
    });

    if (!data) return null;

    return (
        <section className={"bg-white/10 !p-0"}>
            <Disclosure>
                <DisclosureTrigger className={"group flex w-full items-center justify-center gap-2 py-3 transition-colors hover:bg-white/5"}>
                    <span>
                        Эта франшиза состоит из {pluralize(data.length, "%d части", "%d частей")}
                    </span>
                    <TbSelector className={"text-foreground-primary/.5 transition-colors group-hover:text-foreground-primary"} />
                </DisclosureTrigger>
                <DisclosureContent className={"mx-5 -mt-px flex border-t border-white/5 pb-3 pt-1"}>
                    <ol className={"mx-auto mt-2 list-inside list-decimal"}>
                        {
                            data.map((e, i) => {
                                const isDisabled = e.type === "NOT_AVAILABLE" || e.type === "BLOCKED";
                                const Comp = isDisabled ? "span" : Link;
                                return (
                                    <li key={i} className={cn("p-0.5 marker:font-normal marker:text-sm", e.type === "CURRENT" && "font-semibold", e.type === "BLOCKED" && "text-danger")}>
                                        <Comp
                                            to={isDisabled ? "" : e.url ?? ""}
                                            className={cn("px-1", !isDisabled && "hover:underline")}
                                            tabIndex={isDisabled ? -1 : undefined}
                                        >
                                            {e.label}
                                        </Comp>
                                    </li>
                                );
                            })
                        }
                    </ol>
                </DisclosureContent>
            </Disclosure>
        </section>
    );
}