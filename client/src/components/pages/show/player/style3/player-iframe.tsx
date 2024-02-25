import { cn } from "@/lib/utils";

type PlayerIframeProps = React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;

export default function PlayerIframe({ className, src, ...other }: PlayerIframeProps) {
    return (
        <div className={"relative aspect-video w-full overflow-hidden rounded"}>
            <div aria-hidden className={"absolute inset-px animate-pulse rounded bg-background-loading"} />
            <iframe
                src={src}
                className={cn("rounded w-full aspect-video [clip-path:inset(0_0_0_0_round_4px)]", className)}
                loading={"lazy"}
                allowFullScreen
                allowTransparency
                {...other}
            />
        </div>
    );
}