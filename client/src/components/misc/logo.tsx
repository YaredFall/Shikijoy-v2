import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import radishIcon from "/images/radish256x256.png";

type LogoProps = ComponentProps<"img">;

export default function Logo({ className, ...props }: LogoProps) {
    return (
        <img className={cn("", className)} src={radishIcon} alt={"Лого"} {...props} />
    );
}