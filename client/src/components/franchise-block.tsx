import { Disclosure } from "@headlessui/react";
import { FranchiseData } from "@/types/animejoy";
import { Link } from "@/components/utility/Link";
import { TbSelector } from "react-icons/tb";
import pluralize from "plural-ru";
import { cn } from "@/lib/utils";

type FranchiseBlockProps = {
    franchiseData?: FranchiseData;
};

export default function FranchiseBlock({ franchiseData }: FranchiseBlockProps) {

    if (!franchiseData) return null;

    return (
        <section className={""}>
            <Disclosure>
                <Disclosure.Button className={"group flex w-full items-center justify-center gap-2 border-2 border-foreground-primary/.0625 p-1"}>
                    <span>
                        Эта франшиза состоит из
                        {pluralize(franchiseData.length, "%d части", "%d частей")}
                    </span>
                    <TbSelector className={"text-foreground-primary/.5 transition-colors group-hover:text-foreground-primary"} />
                </Disclosure.Button>
                <Disclosure.Panel className={"border-2 border-t-0 border-foreground-primary/.0625"}>
                    <ol className={"list-inside list-decimal px-4 py-2"}>
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