import { useEffect, useLayoutEffect } from "react";

export function useEffectOnChange(value: unknown, cb: () => void) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(cb, [value]);
}

export function useLayoutEffectOnChange(value: unknown, cb: () => void) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        cb();
    }, [cb, value]);
}