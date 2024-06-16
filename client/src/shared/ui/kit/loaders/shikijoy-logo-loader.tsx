import { cn } from "@/lib/cn";
import Logo from "@/shared/ui/misc/shikijoy-logo";
import { ComponentProps } from "react";

type ShikijoyLogoLoaderProps = ComponentProps<"div">;

export default function ShikijoyLogoLoader({ className, ...otherProps }: ShikijoyLogoLoaderProps) {
    return (
        <div className={cn("absolute inset-0 z-[9999] bg-background-secondary flex items-center justify-center", className)} {...otherProps}>
            <Logo className={"w-[max(6rem,8vmax)] animate-pulse"} />
        </div>
    );
}