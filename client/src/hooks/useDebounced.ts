import { useEffect, useState } from "react";

export default function useDebounced<T>(value: T, delay: number) {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(t);
        };
    }, [value, delay]);

    return debouncedValue;
}