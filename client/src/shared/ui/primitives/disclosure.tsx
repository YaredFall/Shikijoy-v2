import { createContext } from "@/shared/ui/utils/context";
import { Slot } from "@radix-ui/react-slot";
import {
    ComponentPropsWithoutRef,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
    forwardRef,
    useCallback,
    useState,
} from "react";

type DisclosureContext = {
    isOpen: boolean;
    setIsOpen: (newOpen: boolean) => void;
};

const [useDisclosureContext, DisclosureContextProvider] = createContext<DisclosureContext>("Disclosure", {} as DisclosureContext);

type DisclosureProps = {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (newOpen: boolean) => void;
    children?: ReactNode;
};

export function Disclosure({ defaultOpen, open, onOpenChange, children }: DisclosureProps) {

    const [_isOpen, _setIsOpen] = useState(defaultOpen ?? open ?? false);
    const setIsOpen = useCallback((newOpen: boolean) => {
        _setIsOpen(newOpen);
        onOpenChange?.(newOpen);
    }, [onOpenChange]);

    return (
        <DisclosureContextProvider isOpen={_isOpen} setIsOpen={setIsOpen}>
            {children}
        </DisclosureContextProvider>
    );
}


type DisclosureTriggerElement = React.ElementRef<"button">;

type DisclosureTriggerProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
    asChild?: boolean;
    children?: ReactNode | ((isOpen: boolean) => ReactNode);
};
export const DisclosureTrigger = forwardRef<DisclosureTriggerElement, DisclosureTriggerProps>(({ asChild, children, onClick, onKeyDown, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const { isOpen, setIsOpen } = useDisclosureContext("DisclosureTrigger");

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
        <Comp ref={ref} onClick={onClickHandler} onKeyDown={onKeyDownHandler} role={"button"} aria-expanded={isOpen} {...props}>
            {children instanceof Function ? children(isOpen) : children}
        </Comp>
    );
});
DisclosureTrigger.displayName = "DisclosureTrigger";

type DisclosureContentElement = React.ElementRef<"div">;

type DisclosureContentProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
    asChild?: boolean;
    children?: ReactNode | ((isOpen: boolean) => ReactNode);
};
export const DisclosureContent = forwardRef<DisclosureContentElement, DisclosureContentProps>(({ asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    const { isOpen } = useDisclosureContext("DisclosureContent");

    return (
        isOpen && (
            <Comp ref={ref} {...props}>
                {children instanceof Function ? children(isOpen) : children}
            </Comp>
        )
    );
});
DisclosureContent.displayName = "DisclosureContent";