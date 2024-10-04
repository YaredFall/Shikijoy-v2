import { cn } from "@client/shared/lib/cn";
import { ComponentProps } from "react";
import radishIcon from "/images/radish256x256.png";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const src = chrome.runtime?.getURL("/client" + radishIcon) ?? radishIcon;

type LogoProps = Omit<ComponentProps<"img">, "src">;

export default function ShikijoyLogo({ className, ...props }: LogoProps) {
    return (
        <img className={cn("", className)} src={src} alt={"Лого"} {...props} />
    );
}