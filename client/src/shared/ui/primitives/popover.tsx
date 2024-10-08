import { cn } from "@client/shared/lib/cn";
import isNullish from "@client/shared/lib/isNullish";
import { createContext } from "@client/shared/ui/utils/context";
import getPopperState from "@client/shared/ui/utils/getPopperState";
import { Slot } from "@radix-ui/react-slot";
import {
    ComponentPropsWithoutRef,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
    forwardRef,
    useCallback,
    useId,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type PopoverContext = {
    isOpen: boolean;
    setIsOpen: (newOpen: boolean) => void;
    id: string;
};

const [_usePopoverContext, PopoverContextProvider] = createContext<PopoverContext>("Popover", {} as PopoverContext);

export function usePopoverContext() {
    return _usePopoverContext("Additional context consumer");
}

type PopoverProps = {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (newOpen: boolean) => void;
    children?: ReactNode;
    asChild?: boolean;
    closeOnPointerDownOutside?: boolean;
} & ComponentPropsWithoutRef<"div">;

type PopoverElement = React.ElementRef<"div">;

export const Popover = forwardRef<PopoverElement, PopoverProps>(({ asChild, defaultOpen, open, onOpenChange, children, className, onKeyDown, closeOnPointerDownOutside = true, ...other }, forwardRef) => {

    const Comp = isNullish(asChild) ? "div" : Slot;

    const nodeRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardRef, () => nodeRef.current!);
    const id = "yd-popover-" + useId();

    const [_isOpen, _setIsOpen] = useState(defaultOpen ?? open ?? false);

    const isOpen = useMemo(() => open ?? _isOpen, [_isOpen, open]);

    const setIsOpen = useCallback((newOpen: boolean) => {
        _setIsOpen(newOpen);
        onOpenChange?.(newOpen);
    }, [onOpenChange]);


    const pointerDownHandler = useCallback((e: PointerEvent) => {
        if (closeOnPointerDownOutside && isOpen && !nodeRef.current?.contains(e.target as Node)) {
            setIsOpen(false);
        }
    }, [closeOnPointerDownOutside, isOpen, setIsOpen]);

    useLayoutEffect(() => {
        document.addEventListener("pointerdown", pointerDownHandler);

        return () => {
            document.removeEventListener("pointerdown", pointerDownHandler);
        };
    }, [pointerDownHandler]);

    const keyDownHandler = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        switch (e.code) {
            case "Escape":
                isOpen && setIsOpen(false);
                break;
            default:
                break;
        }
    }, [isOpen, onKeyDown, setIsOpen]);

    return (
        <PopoverContextProvider id={id} isOpen={isOpen} setIsOpen={setIsOpen}>
            <Comp
                ref={nodeRef}
                className={cn("relative", className)}
                data-state={getPopperState(isOpen)}
                {...other}
                yd-popover-id={id}
                onKeyDown={keyDownHandler}
            >
                {children}
            </Comp>
        </PopoverContextProvider>
    );
});
Popover.displayName = "Popover";

type PopoverTriggerElement = React.ElementRef<"button">;

type PopoverTriggerProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
    asChild?: boolean;
    children?: ReactNode | ((isOpen: boolean) => ReactNode);
};
export const PopoverTrigger = forwardRef<PopoverTriggerElement, PopoverTriggerProps>(({ asChild, children, onClick, onKeyDown, ...props }, ref) => {
    const Comp = isNullish(asChild) ? "button" : Slot;

    const { isOpen, setIsOpen, id } = _usePopoverContext("PopoverTrigger");

    const onClickHandler = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        setIsOpen(!isOpen);
    }, [isOpen, onClick, setIsOpen]);

    const onKeyDownHandler = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.code === "Space" || e.code === "Enter") {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    }, [isOpen, onKeyDown, setIsOpen]);

    return (
        <Comp
            ref={ref}
            role={"button"}
            onClick={onClickHandler}
            onKeyDown={onKeyDownHandler}
            id={id + "-trigger"}
            data-state={getPopperState(isOpen)}
            {...props}
        >
            {children instanceof Function ? children(isOpen) : children}
        </Comp>
    );
});
PopoverTrigger.displayName = "PopoverTrigger";

type PopoverContentElement = React.ElementRef<"div">;

type PopoverContentProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
    asChild?: boolean;
    children?: ReactNode | ((isOpen: boolean) => ReactNode);
    forceMount?: boolean;
};
export const PopoverContent = forwardRef<PopoverContentElement, PopoverContentProps>(({ asChild, children, forceMount, ...props }, ref) => {
    const Comp = isNullish(asChild) ? "div" : Slot;

    const { isOpen, id } = _usePopoverContext("PopoverContent");

    return (
        (isOpen || forceMount) && (
            <Comp ref={ref} role={"dialog"} aria-labelledby={id + "-trigger"} data-state={getPopperState(isOpen)} {...props}>
                {children instanceof Function ? children(isOpen) : children}
            </Comp>
        )
    );
});
PopoverContent.displayName = "PopoverContent";