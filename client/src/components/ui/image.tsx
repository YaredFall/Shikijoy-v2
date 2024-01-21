import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export default function Image({ className, src, onLoad, onError, alt, ...other }: ImageProps) {

    const [isLoading, setIsLoading] = useState(true);

    const handler = useCallback((passedHandler?: React.ReactEventHandler<HTMLImageElement>) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        passedHandler?.(e);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setIsLoading(true);
    }, [src]);

    return (
        <div className={cn(className, "relative")}>
            <img src={src} className={cn(className, isLoading && "hidden")} {...other} alt={alt} onLoad={handler(onLoad)} onError={handler(onError)} />
            {isLoading && <div aria-label={`(Загружается...) ${alt}`} className={cn(className, "bg-neutral-500 absolute inset-0 animate-pulse")} />}
        </div>
    );
}