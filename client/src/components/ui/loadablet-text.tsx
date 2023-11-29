import { ComponentProps, ElementType, ForwardedRef, PropsWithoutRef, ReactNode, RefObject, forwardRef } from "react";
import { HTMLProps } from "../../types/utils";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

type LoadableTextProps<TTag extends ElementType = "span"> = ComponentProps<TTag> & {
  as?: TTag,
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

const LoadableText = forwardRef(LoadableTextFn as any) as <TTag extends ElementType = "span">(
  props: LoadableTextProps<TTag> & { ref?: RefObject<HTMLElement>; }
) => ReturnType<typeof LoadableTextFn>;
// LoadableText.displayName = "LoadableText";

export default LoadableText;