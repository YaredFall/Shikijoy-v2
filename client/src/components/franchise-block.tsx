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
        <section className="">
            <Disclosure>
                <Disclosure.Button className="flex items-center justify-center gap-2 w-full p-1 border-2 border-primary/.0625 group">
                    <span>Эта франшиза состоит из {pluralize(franchiseData.length, "%d части", "%d частей")} </span><TbSelector className={"text-primary/.5 group-hover:text-primary transition-colors"} />
                </Disclosure.Button>
                <Disclosure.Panel className="border-2 border-primary/.0625 border-t-0">
                    <ol className="px-4 py-2 list-decimal list-inside">
                        {franchiseData?.map((e, i) => {
                            const isDisabled = e.type === "NOT_AVAILABLE" || e.type === "BLOCKED";

                            const Comp = isDisabled ? "span" : Link;

                            return (
                                <li key={i} className={cn("p-0.5 marker:font-normal marker:text-sm", e.type === "CURRENT" && "font-semibold", !isDisabled && "cursor-pointer hover:underline", e.type === "BLOCKED" && "text-danger")} >
                                    <Comp to={isDisabled ? "" : e.url!}
                                        className="px-1"
                                        children={e.label}
                                        tabIndex={isDisabled ? -1 : undefined}
                                    />
                                </li>
                            );
                        })}
                    </ol>
                </Disclosure.Panel>
            </Disclosure>
        </section>
    );
}