import * as Primitive from "@radix-ui/react-switch";
import { ComponentRef, forwardRef } from "react";
import { cn } from "../lib/utils";

const Switch = forwardRef<ComponentRef<typeof Primitive.Root>, Primitive.SwitchProps>(({ className, ...other }, forwardRef) => {
    return (
        <Primitive.Root
            ref={forwardRef}
            className={cn(
                "h-[1em] w-[2em] rounded-full relative shadow-sm bg-neutral-300 p-[0.125em] transition-colors",
                " data-[state=checked]:bg-lime-500",
                className,
            )}
            {...other}
        />
    );
});

const SwitchThumb = forwardRef<ComponentRef<typeof Primitive.Thumb>, Primitive.SwitchThumbProps>(({ className, ...other }, forwardRef) => {
    return (
        <Primitive.Thumb
            ref={forwardRef}
            className={cn(
                "flex h-full aspect-square rounded-full bg-white shadow-sm transition-all",
                " data-[state=checked]:ml-[100%] data-[state=checked]:-translate-x-full",
                className,
            )}
            {...other}
        />
    );
});

export { Switch, SwitchThumb };