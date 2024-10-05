import { EffectCallback, useEffect, useLayoutEffect, useRef } from "react";

export function useEffectOnChange(value: unknown, cb: EffectCallback) {
    const prevValue = useRef<unknown>(NaN);

    useEffect(() => {
        if (value === prevValue.current) return;
        prevValue.current = value;

        return cb();
    }, [cb, value]);
}

export function useLayoutEffectOnChange(value: unknown, cb: EffectCallback) {
    const prevValue = useRef<unknown>(NaN);

    useLayoutEffect(() => {
        if (value === prevValue.current) return;
        prevValue.current = value;

        return cb();
    }, [cb, value]);
}