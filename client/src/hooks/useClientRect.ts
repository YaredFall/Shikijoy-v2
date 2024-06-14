import { RefObject, useCallback, useLayoutEffect, useMemo, useState } from "react";

export function useClientRect(ref: RefObject<HTMLElement | null>) {

    const [rect, setRect] = useState(ref.current?.getBoundingClientRect());

    const onResize = useCallback(() => {
        setRect(ref.current?.getBoundingClientRect());
    }, [ref]);

    const resizeObserver = useMemo(() => new ResizeObserver(onResize), [onResize]);

    useLayoutEffect(() => {
        ref.current && resizeObserver.observe(ref.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [ref, resizeObserver]);

    return rect;
}