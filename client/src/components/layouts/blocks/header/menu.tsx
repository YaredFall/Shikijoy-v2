// import Popover from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HOME_AS_CATEGORY, SHOW_CATEGORIES } from "@/utils/routing";
import { ComponentProps, HTMLProps } from "react";
import { Link } from "@/components/utility/Link";
import { Popover } from "@headlessui/react";

type MenuProps = Omit<ComponentProps<typeof Popover>, "children">;

export default function Menu({ className, ...other }: MenuProps) {
    return (
        <Popover className={cn("relative", className)} {...other}>
            <Popover.Button className={"w-full h-full"}>Меню</Popover.Button>
            <Popover.Panel
                className={"absolute left-full top-0 w-52 bg-background-primary rounded-r-md text-sm overflow-hidden"}
            >
                <nav className={"bg-gradient-to-b from-accent-primary/5 to-background-secondary/50 flex flex-col gap-4 px-4 py-4"}>
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
            </Popover.Panel>
        </Popover>
    );
}