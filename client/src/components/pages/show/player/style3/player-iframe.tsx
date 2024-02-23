import { cn } from "@/lib/utils";

type PlayerIframeProps = React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;

export default function PlayerIframe({ className, src, ...other }: PlayerIframeProps) {
    return (
        <div className={"relative w-full aspect-video rounded overflow-hidden"}>
            <div aria-hidden className={"absolute inset-px bg-background-loading animate-pulse rounded"} />
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