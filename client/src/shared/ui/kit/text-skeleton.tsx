import { cn } from "@client/shared/lib/cn";
import { CSSProperties, memo } from "react";

type TextSkeletonProps = {
    length: number | number[];
    className?: string | ((i: number) => string);
    style?: CSSProperties | ((i: number) => CSSProperties);
};
function TextSkeletonFn({ length, className, style }: TextSkeletonProps) {

    const rowsLength = Array.isArray(length) ? length : [length];

    return (
        <>
            {
                rowsLength.map((l, i) => (
                    <span
                        key={i}
                        className={
                            cn(
                                "text-[0.875em] !leading-[1em] text-transparent bg-background-loading rounded select-none animate-pulse break-words",
                                typeof className === "function" ? className(i) : className,
                            )
                        }
                        style={typeof style === "function" ? style(i) : style}
                        aria-hidden
                    >
                        {"X".repeat(l)}
                    </span>
                ))
            }
        </>
    );
}

const TextSkeleton = memo(TextSkeletonFn);
export default TextSkeleton;