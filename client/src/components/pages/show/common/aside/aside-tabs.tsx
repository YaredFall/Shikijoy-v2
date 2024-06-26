import Image from "@/components/ui/image";
import TextSkeleton from "@/components/ui/text-skeleton";
import { Link } from "@/components/utility/Link";
import { cn } from "@/lib/utils";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { getNewsOrRelatedAndPopular } from "@/scraping/animejoy/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ComponentPropsWithoutRef, useMemo, useState } from "react";

const POSSIBLE_TABS = ["related", "popular", "news"] as const;
type TABS = typeof POSSIBLE_TABS[number];
const TAB_NAMES: Record<TABS, string> = {
    related: "Похожие",
    popular: "Популярные",
    news: "Новости",
};

type AsideTabsProps = {
    firstColumn: Exclude<TABS, "popular">;
} & ComponentPropsWithoutRef<"section">;

export default function AsideTabs({ firstColumn, className, ...otherProps }: AsideTabsProps) {

    const { data: animejoyResponse, isLoading: isLoadingAJPage } = useAnimejoyPage();

    const tabsContent = getNewsOrRelatedAndPopular(animejoyResponse?.page);

    const tabs = useMemo(() => ([firstColumn, "popular"] as const), [firstColumn]);
    const [activeTab, setActiveTab] = useState<TABS>(firstColumn === "news" ? "popular" : "related");

    const [isFirstTabActive, isLastTabActive] = useMemo(() => {
        return [activeTab === tabs.at(0), activeTab === tabs.at(-1)] as const;
    }, [activeTab, tabs]);

    return (
        <Tabs
            asChild
            value={activeTab}
            onValueChange={(val) => {
                setActiveTab(val as TABS);
            }}
        >
            <section className={cn("rounded-md bg-background-quaternary overflow-hidden", className)} {...otherProps}>
                <TabsList className={"flex h-10   direct-children:w-1/2"}>
                    {
                        tabs.map(t => (
                            <TabsTrigger
                                key={t}
                                value={t}
                                className={"group bg-background-secondary from-transparent to-inherit aria-selected:bg-background-quaternary"}
                            >
                                <div className={"grid size-full place-items-center rounded-b-md bg-background-quaternary group-first:rounded-bl-none group-last:rounded-br-none group-aria-selected:rounded-b-none group-aria-selected:rounded-t-md group-aria-selected:bg-background-secondary"}>
                                    <span className={"mt-0.5 opacity-50 group-hover:opacity-75 group-aria-selected:!opacity-100"}>{TAB_NAMES[t]}</span>
                                </div>
                            </TabsTrigger>
                        ))
                    }
                </TabsList>
                {
                    tabs.map(t => (
                        <TabsContent
                            key={t}
                            value={t}
                            className={cn(
                                "bg-gradient-to-b from-background-secondary to-background-primary to-[4rem] p-4 rounded-t-md",
                                isFirstTabActive && "rounded-tl-none",
                                isLastTabActive && "rounded-tr-none",
                            )}
                        >
                            <ul className={"flex flex-col space-y-4"}>
                                {(tabsContent?.[t] ? tabsContent[t]! : [...Array<undefined>(5)]).map((e, i) => (
                                    <li key={i}>
                                        <Link to={e?.url ?? ""} aria-disabled={!e} className={""}>
                                            <Image className={"float-left mr-2 aspect-poster w-32 shrink-0 rounded"} src={e?.poster} />
                                            <div className={"space-y-1 leading-tight"}>
                                                {(e?.titles || [""]).map(title =>
                                                    title
                                                        ? <p key={title} className={"not-first:text-foreground-primary/.5"}>{title}</p>
                                                        : <TextSkeleton key={t} length={20} />,
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ),
                                )}
                            </ul>
                        </TabsContent>
                    ))
                }
            </section>
        </Tabs>
    );
}