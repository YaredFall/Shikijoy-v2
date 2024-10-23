import { CSSProperties, RefObject, useCallback, useLayoutEffect, useRef } from "react";

export type UseSemiStickyOptions = {
    onChange?: (styles: CSSProperties) => void;
};

// This hook is written without `useState` but with `useRef` with a reason.
// Asynchronous nature of `setState` causes noticeable jump in the moment of sticking
export function useSemiSticky(elementRef: RefObject<HTMLElement | null>, { onChange }: UseSemiStickyOptions = {}) {

    const stickyStyles = useRef<CSSProperties>({});

    const prevWindowScrollY = useRef(0);

    const onScrollOrResize = useCallback(() => {

        const scrollDelta = window.scrollY - prevWindowScrollY.current;
        const scrollDirection = scrollDelta > 0 ? "down" : "up";

        prevWindowScrollY.current = window.scrollY;

        const element = elementRef.current;
        const container = element?.parentElement;

        if (!element || !container) return;

        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const offset = {
            top: parseFloat(window.getComputedStyle(element).marginTop),
            bottom: parseFloat(window.getComputedStyle(element).marginBottom),
        };

        const sticksTo = stickyStyles.current.top === 0 ? "top" : stickyStyles.current.bottom === 0 ? "bottom" : undefined;

        if (elementRect.height <= containerRect.height && elementRect.height <= window.innerHeight) {
            if (sticksTo !== "top") {
                // just stick as native
                stickyStyles.current = {
                    position: "sticky",
                };
                onChange?.(stickyStyles.current);
            }
            return;
        }

        if (scrollDirection === "down") {
            if (elementRect.bottom + offset.bottom <= window.innerHeight && !sticksTo) {
                // scrolled over bottom edge

                stickyStyles.current = getStickyStyles("bottom", undefined);
                onChange?.(stickyStyles.current);
            } else if (sticksTo === "top") {
                // unstuck top

                stickyStyles.current = getStickyStyles(undefined, -containerRect.top - scrollDelta + elementRect.top - offset.top);
                onChange?.(stickyStyles.current);
            }
        } else {
            if (elementRect.top - offset.top >= 0 && !sticksTo) {
                // scrolled over top edge

                stickyStyles.current = getStickyStyles("top", undefined);
                onChange?.(stickyStyles.current);
            } else if (sticksTo === "bottom") {
                // unstuck bottom

                stickyStyles.current = getStickyStyles(undefined, -containerRect.top - scrollDelta + elementRect.top - offset.bottom);
                onChange?.(stickyStyles.current);
            }
        }
    }, [elementRef, onChange]);

    useLayoutEffect(() => {
        onScrollOrResize();
        window.addEventListener("scroll", onScrollOrResize, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
        };
    }, [onScrollOrResize]);

    return stickyStyles;
}

function getStickyStyles(sticksTo: "top" | "bottom" | undefined, translateY: number | undefined) {
    return {
        position: sticksTo ? "fixed" as const : "relative" as const,
        top: sticksTo === "top" ? 0 : (translateY ? translateY + "px" : "auto"),
        bottom: sticksTo === "bottom" ? 0 : "auto",
        // transform: translateY !== undefined ? `translate3d(0px, ${translateY}px, 0px)` : `translate3d(0px, ${0}px, 0px)`,
    };
}