
import { useEffectOnChange } from "@/shared/hooks/useOnChange";
import { cn } from "@/shared/lib/cn";
import { createContext } from "@/shared/ui/utils/context";
import { Slot } from "@radix-ui/react-slot";
import { useDebounce } from "@uidotdev/usehooks";
import {
    ComponentPropsWithoutRef,
    ReactNode,
    forwardRef,
    useCallback,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

type HoverPopoverContext = {
    isOpen: boolean;
    setIsOpen: (newOpen: boolean) => void;
    id: string;
};

const [_useHoverPopoverContext, HoverPopoverContextProvider] = createContext<HoverPopoverContext>("HoverPopover", {} as HoverPopoverContext);

export function useHoverPopoverContext() {
    return _useHoverPopoverContext("Additional context consumer");
}

type HoverPopoverProps = {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (newOpen: boolean) => void;
    children?: ReactNode;
    asChild?: boolean;
    debounceTime?: number;
} & ComponentPropsWithoutRef<"div">;

type HoverPopoverElement = React.ElementRef<"div">;

export const HoverPopover = forwardRef<HoverPopoverElement, HoverPopoverProps>(({ asChild, defaultOpen, open, onOpenChange, children, className, debounceTime = 500, ...other }, forwardRef) => {

    const Comp = asChild ? Slot : "div";

    const nodeRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardRef, () => nodeRef.current!);
    const id = "yd-hover-popover-" + useId();

    const [_isOpen, _setIsOpen] = useState(defaultOpen ?? open ?? false);

    const _debouncedIsOpen = useDebounce(_isOpen, debounceTime);
    const isOpen = useMemo(() => open ?? _debouncedIsOpen, [_debouncedIsOpen, open]);

    const setIsOpen = useCallback((newOpen: boolean) => {
        _setIsOpen(newOpen);
        
    }, []);

    useEffectOnChange(_debouncedIsOpen, () => {
        isOpen !== _debouncedIsOpen && onOpenChange?.(_debouncedIsOpen);
    });

    return (
        <HoverPopoverContextProvider id={id} isOpen={isOpen} setIsOpen={setIsOpen}>
            <Comp ref={nodeRef} className={cn("relative", className)} {...other} yd-hover-popover-id={id}>
                {children}
            </Comp>
        </HoverPopoverContextProvider>
    );
});
HoverPopover.displayName = "HoverPopover";


type HoverPopoverTriggerElement = React.ElementRef<"button">;

type HoverPopoverTriggerProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
    asChild?: boolean;
    children?: ReactNode | ((isOpen: boolean) => ReactNode);
};
export const HoverPopoverTrigger = forwardRef<HoverPopoverTriggerElement, HoverPopoverTriggerProps>(({ asChild, children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const { isOpen, setIsOpen, id } = _useHoverPopoverContext("HoverPopoverTrigger");

    const onMouseEnterHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        onMouseEnter?.(e);
        setIsOpen(true);
    }, [onMouseEnter, setIsOpen]);
    const onFocusHandler: React.FocusEventHandler<HTMLButtonElement> = useCallback((e) => {
        onFocus?.(e);
        setIsOpen(true);
    }, [onFocus, setIsOpen]);
    const onMouseLeaveHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        onMouseLeave?.(e);
        setIsOpen(false);
    }, [onMouseLeave, setIsOpen]);
    const onBlurHandler: React.FocusEventHandler<HTMLButtonElement> = useCallback((e) => {
        onBlur?.(e);
        setIsOpen(false);
    }, [onBlur, setIsOpen]);

    return (
        <Comp
            ref={ref}
            role={"button"}
            id={id + "-trigger"}
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            {...props}
        >
            {children instanceof Function ? children(isOpen) : children}
        </Comp>
    );
});
HoverPopoverTrigger.displayName = "HoverPopoverTrigger";

type HoverPopoverContentElement = React.ElementRef<"div">;

type HoverPopoverContentProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
    asChild?: boolean;
    children?: ReactNode | ((isOpen: boolean) => ReactNode);
};
export const HoverPopoverContent = forwardRef<HoverPopoverContentElement, HoverPopoverContentProps>(({ asChild, children, onMouseEnter, onFocus, onMouseLeave, onBlur, ...props }, forwardRef) => {
    const Comp = asChild ? Slot : "div";

    const nodeRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardRef, () => nodeRef.current!);

    const { isOpen, setIsOpen, id } = _useHoverPopoverContext("HoverPopoverContent");

    const onMouseEnterHandler: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        onMouseEnter?.(e);
        setIsOpen(true);
    }, [onMouseEnter, setIsOpen]);
    const onFocusHandler: React.FocusEventHandler<HTMLDivElement> = useCallback((e) => {
        onFocus?.(e);
        setIsOpen(true);
    }, [onFocus, setIsOpen]);
    const onMouseLeaveHandler: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        onMouseLeave?.(e);
        setIsOpen(false);
    }, [onMouseLeave, setIsOpen]);
    const onBlurHandler: React.FocusEventHandler<HTMLDivElement> = useCallback((e) => {
        onBlur?.(e);
        setIsOpen(false);
    }, [onBlur, setIsOpen]);

    return (
        isOpen && (
            <Comp
                ref={nodeRef}
                role={"dialog"}
                aria-labelledby={id + "-trigger"}
                onMouseEnter={onMouseEnterHandler}
                onMouseLeave={onMouseLeaveHandler}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                {...props}
            >
                {children instanceof Function ? children(isOpen) : children}
            </Comp>
        )
    );
});
HoverPopoverContent.displayName = "HoverPopoverContent";