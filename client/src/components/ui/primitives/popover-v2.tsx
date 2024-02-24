import { cn } from "@/lib/utils";
import { createContext } from "@/utils/context";
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

const [usePopoverContext, PopoverContextProvider] = createContext<PopoverContext>("Popover", {} as PopoverContext);

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

    const Comp = asChild ? Slot : "div";
    
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
            <Comp ref={nodeRef} className={cn("relative", className)} {...other} yd-popover-id={id} onKeyDown={keyDownHandler}>
                {children}
            </Comp>
        </PopoverContextProvider>
    );
});


type PopoverTriggerElement = React.ElementRef<"button">;

type PopoverTriggerProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
    asChild?: boolean;
    children?: ReactNode | ((isOpen: boolean) => ReactNode);
};
export const PopoverTrigger = forwardRef<PopoverTriggerElement, PopoverTriggerProps>(({ asChild, children, onClick, onKeyDown, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const { isOpen, setIsOpen, id } = usePopoverContext("PopoverTrigger");

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
        <Comp ref={ref} role={"button"} onClick={onClickHandler} onKeyDown={onKeyDownHandler} id={id + "-trigger"} {...props}>
            {children instanceof Function ? children(isOpen) : children}
        </Comp>
    );
});

type PopoverContentElement = React.ElementRef<"div">;

type PopoverContentProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
    asChild?: boolean;
    children?: ReactNode | ((isOpen: boolean) => ReactNode);
};
export const PopoverContent = forwardRef<PopoverContentElement, PopoverContentProps>(({ asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    const { isOpen, id } = usePopoverContext("PopoverContent");

    return (
        isOpen && (
            <Comp ref={ref} role={"dialog"} aria-labelledby={id + "-trigger"} {...props}>
                {children instanceof Function ? children(isOpen) : children}
            </Comp>
        )
    );
});