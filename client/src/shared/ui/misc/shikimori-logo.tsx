import { cn } from "@/lib/cn";
import { ComponentProps } from "react";
import shikimoriLogo from "/images/shikimori_logo.png";

const src = chrome.runtime?.getURL("/client" + shikimoriLogo) ?? shikimoriLogo;

type LogoProps = Omit<ComponentProps<"img">, "src">;

export default function ShikimoriLogo({ className, ...props }: LogoProps) {
    return (
        <img className={cn("", className)} src={src} alt={"SM"} {...props} />
    );
}