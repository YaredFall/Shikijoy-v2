import { cn } from "@client/shared/lib/cn";
import { HoverPopover, HoverPopoverTrigger, HoverPopoverContent, useHoverPopoverContext } from "@client/shared/ui/primitives/hover-popover";
import { calculateAvailableSpace } from "@client/shared/ui/utils/available-space";
import {
    ComponentPropsWithoutRef,
    ComponentRef,
    forwardRef,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

export const ShikimoriPopover = HoverPopover;
ShikimoriPopover.displayName = "ShikimoriPopover";
export const ShikimoriPopoverTrigger = HoverPopoverTrigger;
ShikimoriPopoverTrigger.displayName = "ShikimoriPopoverTrigger";

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
ShikimoriPopoverContent.displayName = "ShikimoriPopoverContent";