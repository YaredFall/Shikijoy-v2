// import Popover from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HOME_AS_CATEGORY, SHOW_CATEGORIES } from "@/utils/routing";
import { HTMLProps } from "react";
import { Link } from "@/components/utility/Link";
import * as Popover from "@radix-ui/react-popover";

type MenuProps = Omit<HTMLProps<HTMLDivElement>, "children">;

export default function Menu({ className, ...other }: MenuProps) {
    return (
        <div className={cn("relative", className)} {...other}>
            <Popover.Root>
                <Popover.Trigger className={"w-full h-full"}>Меню</Popover.Trigger>
                <Popover.Content side={"right"} align={"start"} className={"w-52 px-4 py-4 bg-secondary rounded-r text-sm"} onOpenAutoFocus={(e) => { e.preventDefault(); }}>
                    <nav className={"flex flex-col gap-4"}>
                        {
                            [HOME_AS_CATEGORY, ...SHOW_CATEGORIES.filter(c => c.path !== "dorams")].map(({ path, name }) => (
                                <Link
                                    key={name}
                                    absolute
                                    to={path}
                                    className={"pt-2.5 pb-1.5 px-4 flex items-center text-foreground-primary/.75 highlight:text-foreground-primary"}
                                >
                                    {name}
                                </Link>
                            ))
                        }
                    </nav>
                </Popover.Content>
            </Popover.Root>
        </div>
    );
}