import { cn } from "@/lib/utils";
import { HTMLProps } from "@/types/utils";

type DotSplitterProps = {
    className?: string;
} & HTMLProps<HTMLSpanElement>;

export default function DotSplitter({ className }: DotSplitterProps) {
    return (
        <span className={cn("inline-block bg-current text-foreground-primary/.75 w-[3px] aspect-square mx-[0.375em] rounded-full", className)} />
    );
}