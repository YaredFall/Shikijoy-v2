import { cn } from "@client/shared/lib/cn";
import { ComponentPropsWithoutRef, useCallback, useLayoutEffect, useRef } from "react";

type PlayerIframeProps = ComponentPropsWithoutRef<"iframe">;

export default function PlayerIframe({ className, src, ...other }: PlayerIframeProps) {

    const frameRef = useRef<HTMLIFrameElement>(null);

    const kbEventHandler = useCallback((e: KeyboardEvent) => {
        if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

        if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Escape"].includes(e.code) && document.activeElement === frameRef.current) {
            e.preventDefault();

            frameRef.current?.contentWindow?.postMessage({
                type: "KeyboardEvent",
                data: {
                    type: e.type,
                    code: e.code,
                },
            }, "*");
        } else if (e.code === "KeyF" && e.type === "keydown") {
            if (document.querySelector("*:focus-visible")) return;

            frameRef.current?.focus();
        }
    }, []);

    useLayoutEffect(() => {
        document.addEventListener("keydown", kbEventHandler);
        document.addEventListener("keyup", kbEventHandler);

        return () => {
            document.removeEventListener("keydown", kbEventHandler);
            document.removeEventListener("keyup", kbEventHandler);
        };
    });

    return (
        <div
            tabIndex={0}
            onFocus={(e) => {
                console.log(e);
                frameRef.current?.focus();
            }}
            className={"relative aspect-video w-full overflow-hidden rounded outline-offset-2 focus-within:outline-ring"}
        >
            <div aria-hidden className={"absolute inset-px animate-pulse rounded bg-background-loading"} />
            <iframe
                ref={frameRef}
                src={src}
                className={cn("rounded w-full aspect-video relative", className)}
                loading={"lazy"}
                allow={"autoplay *; fullscreen *"}
                allowFullScreen
                // allowTransparency
                {...other}
            />
        </div>
    );
}