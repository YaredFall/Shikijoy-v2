// import Popover from "@client/components/ui/popover";
import { cn } from "@client/shared/lib/cn";
import { CATEGORIES, categoryLabel } from "@client/shared/routing/category";
import { Link } from "@tanstack/react-router";
import { ComponentProps } from "react";

type MenuProps = Omit<ComponentProps<"nav">, "children">;

export default function Menu({ className }: MenuProps) {
    return (
        <nav className={cn("flex flex-col gap-3 bg-gradient-to-b from-accent-primary/5 to-background-secondary/50 p-4", className)}>
            {
                CATEGORIES.map(category => (
                    <Link
                        key={category}
                        to={"/" + category}
                        className={"flex items-center px-4 pb-2 pt-3 text-foreground-primary/.75 highlight:text-foreground-primary [&.active]:highlight:text-foreground-primary"}
                    >
                        {categoryLabel(category)}
                    </Link>
                ))
            }
        </nav>
    );
}