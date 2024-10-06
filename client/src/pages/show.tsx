import Player from "@client/animejoy/entities/show/playlist/ui/player";
import Characters from "@client/animejoy/entities/show/ui/characters";
import FranchiseBlock from "@client/animejoy/entities/show/ui/franchise-block";
import Description from "@client/animejoy/entities/show/ui/info";
import Screenshots from "@client/animejoy/entities/show/ui/screenshots";
import Container from "@client/shared/ui/kit/container";
import { useLoaderData } from "@tanstack/react-router";


export default function ShowPage() {

    const { shikimoriAnimeId } = useLoaderData({ from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/" });

    return (
        <Container className={"relative flex-1 bg-background-primary p-0"}>
            <div className={"relative rounded-[inherit] *:px-6"}>
                <div className={"pointer-events-none absolute inset-0 -bottom-40 isolate overflow-hidden rounded-[inherit] !p-0"} aria-hidden>
                    <div className={"size-full bg-gradient-to-b from-accent-secondary to-transparent opacity-10 saturate-[1000%]"}></div>
                </div>
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