import { HoverPopover, HoverPopoverContent, HoverPopoverTrigger, useHoverPopoverContext } from "@/components/ui/primitives/hover-popover";
import { calculateAvailableSpace } from "@/components/utility/calculateAvailableSpace";
import { cn } from "@/lib/utils";
import {
    ComponentPropsWithoutRef,
    forwardRef,
    useLayoutEffect,
    useRef,
    useState,
    ComponentRef,
    useImperativeHandle,
} from "react";

export const ShikimoriPopover = HoverPopover;
export const ShikimoriPopoverTrigger = HoverPopoverTrigger;

export const ShikimoriPopoverContent = forwardRef<
ComponentRef<typeof HoverPopoverContent>,
ComponentPropsWithoutRef<typeof HoverPopoverContent>
>(({ className, style, ...other }, forwardRef) => {

    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardRef, () => ref.current!);

    const { isOpen } = useHoverPopoverContext();

    const [posCN, setPosCN] = useState("top-0 left-full ml-2");
    const [posStyle, setPosStyle] = useState({});

    useLayoutEffect(() => {
        if (!isOpen) {
            setPosCN("top-0 left-full ml-2");
            setPosStyle({});
        } else if (ref.current) {
            const availableSpace = calculateAvailableSpace(ref.current, window);
            let className = "top-0 left-full ml-2";
            if (availableSpace.availableRight < 0) {
                className = ("top-0 right-full mr-2 ");
            }
            if (availableSpace.availableBottom < 0) {
                className = cn(className, "top-[var(--available-bottom)]");
                setPosStyle({ "--available-bottom": ~~availableSpace.availableBottom + "px" });
            }
            if (availableSpace.availableTop < 0) {
                className = cn(className, "-top-[var(--available-top)]");
                setPosStyle({ "--available-top": ~~availableSpace.availableTop + "px" });
            }
            setPosCN(className);
        }
    }, [isOpen]);

    return (
        <HoverPopoverContent
            ref={ref}
            className={cn("z-50 absolute h-80 w-auto aspect-video bg-background-secondary rounded-lg shadow-md", className, posCN)}
            style={{ ...style, ...posStyle }}
            {...other}
        >
        </HoverPopoverContent>
    );
});