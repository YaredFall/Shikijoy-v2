import { cn } from "@/shared/lib/cn";
import { ComponentPropsWithoutRef, forwardRef, useCallback, useLayoutEffect, useState } from "react";

type ImageProps = ComponentPropsWithoutRef<"img">;

const Image = forwardRef<HTMLDivElement, ImageProps>(({ className, src, onLoad, onError, alt, ...other }, forwardedRef) => {

    const [isLoading, setIsLoading] = useState(true);

    const handler = useCallback((passedHandler?: React.ReactEventHandler<HTMLImageElement>) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        passedHandler?.(e);
        setTimeout(() => {
            setIsLoading(false);
        }, 0);
    }, []);

    useLayoutEffect(() => {
        setIsLoading(true);
    }, [src]);

    return (
        <div className={cn(className, "relative")} ref={forwardedRef} data-loading={isLoading}>
            <img
                src={src}
                className={cn("object-cover", className, isLoading && "hidden")}
                {...other}
                alt={alt}
                onLoad={handler(onLoad)}
                onError={handler(onError)}
            />
            {isLoading && <div aria-label={`(Загружается...) ${alt}`} className={cn(className, "bg-background-loading absolute inset-0 animate-pulse")} />}
        </div>
    );
});
Image.displayName = "Image";

export default Image;