// import Popover from "@/components/ui/popover";
import { Link } from "@/components/utility/Link";
import { cn } from "@/lib/utils";
import { HOME_AS_CATEGORY, SHOW_CATEGORIES } from "@/utils/routing";
import { Popover } from "@headlessui/react";
import { ComponentProps } from "react";

type MenuProps = Omit<ComponentProps<typeof Popover>, "children">;

export default function Menu({ className, ...other }: MenuProps) {
    return (
        <Popover className={cn("relative", className)} {...other}>
            <Popover.Button className={"size-full"}>Меню</Popover.Button>
            <Popover.Panel
                className={"absolute left-full top-0 w-52 overflow-hidden rounded-r-md bg-background-primary text-sm"}
            >
                <nav className={"flex flex-col gap-4 bg-gradient-to-b from-accent-primary/5 to-background-secondary/50 p-4"}>
                    {
                        [HOME_AS_CATEGORY, ...SHOW_CATEGORIES.filter(c => c.path !== "dorams")].map(({ path, name }) => (
                            <Link
                                key={name}
                                absolute
                                to={path}
                                className={"flex items-center px-4 pb-1.5 pt-2.5 text-foreground-primary/.75 highlight:text-foreground-primary"}
                            >
                                {name}
                            </Link>
                        ))
                    }
                </nav>
            </Popover.Panel>
        </Popover>
    );
}