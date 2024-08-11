import { cn } from "@/shared/lib/cn";
import { ComponentPropsWithoutRef } from "react";

type BadgeProps = ComponentPropsWithoutRef<"span">;

export default function Badge({ className, children, ...other }: BadgeProps) {
    return (
        <span
            className={cn("bg-foreground-primary text-black px-1.5 rounded font-medium inline-flex items-center leading-tight gap-0.5", className)}
            {...other}
        >
            {children}
        </span>
    );
}