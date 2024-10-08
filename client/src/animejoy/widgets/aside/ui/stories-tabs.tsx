
import { getNewsOrRelatedAndPopular } from "@client/animejoy/entities/story/scarping";
import { animejoyClient } from "@client/animejoy/shared/api/client";
import { cn } from "@client/shared/lib/cn";
import isNullish from "@client/shared/lib/isNullish";
import Image from "@client/shared/ui/kit/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Link } from "@tanstack/react-router";
import { ComponentPropsWithoutRef, useMemo, useState } from "react";

const POSSIBLE_TABS = ["related", "popular", "news"] as const;
type TABS = typeof POSSIBLE_TABS[number];
const TAB_NAMES: Record<TABS, string> = {
    related: "Похожие",
    popular: "Популярные",
    news: "Новости",
};

type StoriesTabsProps = ComponentPropsWithoutRef<"section">;

export default function StoriesTabs({ className, ...otherProps }: StoriesTabsProps) {

    const [{ tabsContent }] = animejoyClient.page.useSuspenseQuery(undefined, {
        select: data => ({
            tabsContent: getNewsOrRelatedAndPopular(data.document),
        }),
    });

    const firstTab = useMemo(() => tabsContent?.["news"] ? "news" : "related", [tabsContent]);

    const tabs = useMemo(() => ([firstTab, "popular"] as const), [firstTab]);
    const [activeTab, setActiveTab] = useState<TABS>(firstTab === "news" ? "popular" : "related");
    const activeOrFallbackTab = useMemo(() => isNullish(tabsContent?.[activeTab]) ? "popular" : activeTab, [activeTab, tabsContent]);

    const [isFirstTabActive, isLastTabActive] = useMemo(() => {
        return [activeTab === tabs.at(0), activeTab === tabs.at(-1)] as const;
    }, [activeTab, tabs]);

    return (
        <Tabs
            asChild
            value={activeOrFallbackTab}
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
                                disabled={!tabsContent?.[t]}
                            >
                                <div className={"grid size-full place-items-center rounded-b-md bg-background-quaternary group-first:rounded-bl-none group-last:rounded-br-none group-aria-selected:rounded-b-none group-aria-selected:rounded-t-md group-aria-selected:bg-background-secondary"}>
                                    <span className={"mt-0.5 opacity-50 group-hover:opacity-75 group-disabled:hidden group-aria-selected:!opacity-100"}>
                                        {TAB_NAMES[t]}
                                    </span>
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
                                {tabsContent?.[t]?.map((e, i) => (
                                    <li key={i}>
                                        <Link to={e.url} aria-disabled={!e.url} className={""}>
                                            {<Image className={"float-left mr-2 aspect-poster w-32 shrink-0 rounded"} src={e.poster} />}
                                            <div className={"space-y-1 leading-tight"}>
                                                {e.titles.map(title => (
                                                    <p key={title} className={"not-first:text-foreground-primary/.5"}>
                                                        {title}
                                                    </p>
                                                ))}
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