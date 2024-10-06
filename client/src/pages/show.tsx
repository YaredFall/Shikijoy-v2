import Player from "@client/animejoy/entities/show/playlist/ui/player";
import Characters from "@client/animejoy/entities/show/ui/characters";
import FranchiseBlock from "@client/animejoy/entities/show/ui/franchise-block";
import Description from "@client/animejoy/entities/show/ui/info";
import Screenshots from "@client/animejoy/entities/show/ui/screenshots";
import { animejoyClient } from "@client/animejoy/shared/api/client";
import { showTransformer } from "@client/animejoy/shared/api/client/page";
import { useImagePallete } from "@client/shared/hooks/useImagePallete";
import { cn } from "@client/shared/lib/cn";
import Container from "@client/shared/ui/kit/container";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo } from "react";

export default function ShowPage() {

    const { shikimoriAnimeId } = useLoaderData({ from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/" });

    return (
        <Container className={"relative flex-1 bg-background-primary p-0"}>
            <div className={"relative rounded-[inherit] *:px-6"}>
                <ShowPosterPalleteGradient className={"absolute inset-0 -bottom-40 rounded-t-[inherit] !p-0 opacity-15 brightness-75 contrast-150 "} />
                <Description />
                <FranchiseBlock />
                <Screenshots />
            </div>
            <div className={"space-y-6 bg-gradient-to-b from-black/5 to-background-primary py-6 *:px-6"}>
                <Player />
                {shikimoriAnimeId && <Characters />}
            </div>
        </Container>
    );
}

function ShowPosterPalleteGradient({ className }: { className?: string; }) {
    const [{ info }] = animejoyClient.page.useSuspenseQuery(undefined, { select: showTransformer });

    const pallete = useImagePallete(info.poster);

    const gradient = useMemo(() => {

        return `linear-gradient(${
            pallete?.filter(color => color.saturation > 0.3 && color.lightness > 0.4 && color.lightness < 0.8)[0]?.hex
        }, transparent)`;
    }, [pallete]);

    return (
        <div className={cn("pointer-events-none bg-gradient-to-b from-accent-secondary to-transparent", className)} style={{ backgroundImage: gradient }} aria-hidden></div>
    );
}