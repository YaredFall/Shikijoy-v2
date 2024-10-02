import { DependencyList, EffectCallback, useEffect, useLayoutEffect, useRef } from "react";

export function useEffectOnce(cb: EffectCallback, deps: DependencyList) {
    const isFired = useRef(false);
    useEffect(() => {
        if (isFired.current) return;
        isFired.current = true;

        return cb();
    }, deps);
}

export function useLayoutEffectOnce(cb: EffectCallback, deps: DependencyList) {
    const isFired = useRef(false);
    useLayoutEffect(() => {
        if (isFired.current) return;
        isFired.current = true;

        return cb();
    }, deps);
}