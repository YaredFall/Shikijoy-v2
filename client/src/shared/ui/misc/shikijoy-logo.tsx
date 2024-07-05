import { cn } from "@/shared/lib/cn";
import { ComponentProps } from "react";
import radishIcon from "/images/radish256x256.png";

const src = chrome.runtime?.getURL("/client" + radishIcon) ?? radishIcon;

type LogoProps = Omit<ComponentProps<"img">, "src">;

export default function ShikijoyLogo({ className, ...props }: LogoProps) {
    return (
        <img className={cn("", className)} src={src} alt={"Лого"} {...props} />
    );
}