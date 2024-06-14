import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { PropsWithChildren, useMemo } from "react";

type ContainerProps = PropsWithChildren<{
    className?: string;
    asChild?: boolean;
}>;

export default function Container({ children, className, asChild }: ContainerProps) {

    const Comp = useMemo(() => asChild ? Slot : "div", [asChild]);

    return (
        <Comp className={cn("rounded-md px-5 pt-4 pb-5 bg-background-primary", className)}>{ children }</Comp>
    );
}