import { cn } from "@/lib/utils";
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
      {rowsLength.map((l,i) => (
        <span 
          key={i} 
          className={cn(
            "text-[0.75em] leading-[1em] text-transparent bg-neutral-500 rounded select-none animate-pulse", 
            typeof className === "function" ? className(i) : className
          )}
          style={typeof style === "function" ? style(i) : style}
        >
          {"X".repeat(l)}
        </span>
      ))}
    </>
  );
}
// export default TextSkeletonFn;
const TextSkeleton = memo(TextSkeletonFn);
export default TextSkeleton;