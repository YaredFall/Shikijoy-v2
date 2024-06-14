import { Disclosure } from "@headlessui/react";
import { Link } from "@/components/utility/Link";
import { TbSelector } from "react-icons/tb";
import pluralize from "plural-ru";
import { cn } from "@/lib/utils";
import { FranchiseData } from "@/entities/animejoy/show/model";
import Container from "@/components/ui/kit/container";

type FranchiseBlockProps = {
    franchiseData?: FranchiseData;
};

export default function FranchiseBlock({ franchiseData }: FranchiseBlockProps) {

    if (!franchiseData) return null;

    return (
        <section className={"my-3 rounded bg-white/10 py-3"}>
            <Disclosure>
                <Disclosure.Button className={"group flex w-full items-center justify-center gap-2 "}>
                    <span>
                        Эта франшиза состоит из {pluralize(franchiseData.length, "%d части", "%d частей")}
                    </span>
                    <TbSelector className={"text-foreground-primary/.5 transition-colors group-hover:text-foreground-primary"} />
                </Disclosure.Button>
                <Disclosure.Panel className={"flex"}>
                    <ol className={"mx-auto mt-2 list-inside list-decimal px-2"}>
                        {
                            franchiseData?.map((e, i) => {
                                const isDisabled = e.type === "NOT_AVAILABLE" || e.type === "BLOCKED";
                                const Comp = isDisabled ? "span" : Link;
                                return (
                                    <li key={i} className={cn("p-0.5 marker:font-normal marker:text-sm", e.type === "CURRENT" && "font-semibold", !isDisabled && "cursor-pointer hover:underline", e.type === "BLOCKED" && "text-danger")}>
                                        <Comp
                                            to={isDisabled ? "" : e.url ?? ""}
                                            className={"px-1"}
                                            children={e.label}
                                            tabIndex={isDisabled ? -1 : undefined}
                                        />
                                    </li>
                                );
                            })
                        }
                    </ol>
                </Disclosure.Panel>
            </Disclosure>
        </section>
    );
}