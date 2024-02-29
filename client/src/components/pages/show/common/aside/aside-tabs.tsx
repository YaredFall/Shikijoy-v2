import Image from "@/components/ui/image";
import TextSkeleton from "@/components/ui/text-skeleton";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { getNewsOrRelatedAndPopular } from "@/scraping/animejoy/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const POSSIBLE_TABS = ["related", "popular", "news"] as const;
type TABS = typeof POSSIBLE_TABS[number];
const TAB_NAMES: Record<TABS, string> = {
    related: "Похожие",
    popular: "Популярные",
    news: "Новости",
};

type AsideTabsProps = {
    firstColumn: Exclude<TABS, "popular">;
};

export default function AsideTabs({ firstColumn }: AsideTabsProps) {

    const { data: animejoyResponse, isLoading: isLoadingAJPage } = useAnimejoyPage();

    const tabsContent = getNewsOrRelatedAndPopular(animejoyResponse?.page);

    const tabs = useMemo(() => ([firstColumn, "popular"] as const), [firstColumn]);

    return (
        <Tabs defaultValue={firstColumn === "news" ? "popular" : "related"}>
            <TabsList className={"mb-4 flex h-10 rounded-full bg-background-secondary p-1 direct-children:w-1/2"}>
                {
                    tabs.map(t => (
                        <TabsTrigger value={t} className={"rounded-full transition-colors aria-selected:bg-background-tertiary/50"}>
                            {TAB_NAMES[t]}
                        </TabsTrigger>
                    ))
                }
            </TabsList>
            {
                tabs.map(t => (
                    <TabsContent value={t}>
                        <ul className={"flex flex-col space-y-4"}>
                            {(tabsContent?.[t] ? tabsContent[t]! : [...Array(5)]).map((e, i) => (
                                <li key={i}>
                                    <Link to={e?.url} aria-disabled={!e} className={""}>
                                        <Image className={"float-left mr-2 aspect-poster w-32 shrink-0 rounded"} src={e?.poster} />
                                        <div className={"space-y-1 leading-tight"}>
                                            {(e?.titles || [""]).map((title: string) =>
                                                title
                                                    ? <p className={"not-first:text-foreground-primary/.5"}>{title}</p>
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
        </Tabs>
    );
}