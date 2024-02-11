import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import Logo from "../misc/logo";

type LoaderLogoProps = ComponentProps<"div">;

export default function LoaderLogo({ className }: LoaderLogoProps) {
    return (
        <div className={cn("absolute inset-0 z-[9999] bg-background-secondary flex items-center justify-center", className)}>
            <Logo className={"w-[max(6rem,8vmax)] animate-pulse"} />
        </div>
    );
}