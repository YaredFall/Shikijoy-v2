import { RefObject, useLayoutEffect, useMemo, useState } from "react";

export type UseLineClampOptions = {
    /**
     * @default true
     */
    enabled?: boolean;
    /**
     * @default computed line-height of the container
     */
    lineHeight?: number;
};

/**
 *
 * @param containerRef - an element to reference available height
 * @returns a number of lines that can fit into the container OR `Infinity` if disabled
 */
export function useLineClamp(containerRef: RefObject<HTMLElement | null>, options?: UseLineClampOptions) {

    const isEnabled = useMemo(() => options?.enabled ?? true, [options?.enabled]);

    const [lineClamp, setLineClamp] = useState<number>(Infinity);

    useLayoutEffect(() => {
        if (!isEnabled) return;

        const containerEl = containerRef.current;

        const onResize = () => {
            if (!containerEl) return;
            const availableHeight = containerEl.getBoundingClientRect().height;
            const lineHeight = options?.lineHeight ?? parseFloat(window.getComputedStyle(containerEl).lineHeight);
            // ? maybe make an option instead of hardcoded value   ----\/
            const results = Math.floor(availableHeight / lineHeight + 0.15);
            setLineClamp(results);
        };

        if (containerEl) {
            onResize();
            
            const observer = new ResizeObserver(onResize);
            observer.observe(containerEl);

            return () => {
                observer.disconnect();
            };
        }
    }, [containerRef, isEnabled, options?.lineHeight]);

    const result = useMemo(() => isEnabled ? lineClamp : Infinity, [isEnabled, lineClamp]);

    return result;
}