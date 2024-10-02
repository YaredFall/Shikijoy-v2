import { EffectCallback, useEffect, useLayoutEffect } from "react";

export function useEffectOnChange(value: unknown, cb: EffectCallback) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(cb, [cb, value]);
}

export function useLayoutEffectOnChange(value: unknown, cb: EffectCallback) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(cb, [cb, value]);
}