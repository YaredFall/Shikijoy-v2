import { ComponentProps, ElementType, ForwardedRef, RefObject, forwardRef } from "react";
import { cn } from "@/lib/utils";

type LoadableTextProps<TTag extends ElementType = "span"> = ComponentProps<TTag> & {
    as?: TTag;
    isLoading: boolean;
    placeholderLength?: number;
};


const LoadableTextFn = (({ as, isLoading, placeholderLength, children, ...props }: LoadableTextProps, ref: ForwardedRef<HTMLElement>) => {

    const Comp = as ?? "span";

    return (

        <Comp ref={ref} {...props}>
            {
                isLoading ?
                    <span className={cn("text-transparent bg-secondary animate-pulse-slow rounded", !placeholderLength && "block")} aria-hidden>{"X".repeat(placeholderLength ?? 1)}</span>
                    :
                    children
            }
        </Comp>
    );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LoadableText = forwardRef(LoadableTextFn as any) as <TTag extends ElementType = "span">(
    props: LoadableTextProps<TTag> & { ref?: RefObject<HTMLElement> }
) => ReturnType<typeof LoadableTextFn>;
// LoadableText.displayName = "LoadableText";

export default LoadableText;