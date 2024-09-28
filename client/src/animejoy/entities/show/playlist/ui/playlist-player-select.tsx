import { PlaylistPlayer, PlaylistStudio } from "@/animejoy/entities/show/playlist/model";
import { getFullStudioName } from "@/animejoy/entities/show/playlist/scraping";
import { animejoyClient } from "@/animejoy/shared/api/client";
import { cn } from "@/shared/lib/cn";
import Listbox from "@/shared/ui/primitives/listbox";
import { Root as Separator } from "@radix-ui/react-separator";
import { useParams } from "@tanstack/react-router";
import { Fragment, useLayoutEffect, useRef } from "react";


type PlaylistPlayerSelectProps = {
    currentPlayer?: PlaylistPlayer;
    onSelect?: (player: PlaylistPlayer) => void;
};

export default function PlaylistPlayerSelect({ currentPlayer, onSelect }: PlaylistPlayerSelectProps) {

    const { showId: animejoyAnimeId } = useParams({ from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/" });

    const [{ studios, players, episodes }] = animejoyClient.show.playlist.useSuspenseQuery({ id: animejoyAnimeId });

    const currentOptionRef = useRef<HTMLLIElement | null>(null);

    useLayoutEffect(() => {
        if (!currentPlayer || !currentOptionRef.current) return;
        
        const { scrollLeft, scrollTop } = document.body;
        currentOptionRef.current.scrollIntoView({
            block: "nearest",
            behavior: "instant",
        });
        document.body.scroll(scrollLeft, scrollTop);
    }, [currentPlayer]);

    if (!players) return null;

    const studioPlayers = (studio: PlaylistStudio | undefined) => !studio ? players : players.filter(p => p.studio === studio);
    const playerFiles = (player: PlaylistPlayer) => episodes?.filter(f => f.player === player);

    const studioEpisodesCount = (studio: PlaylistStudio) => Math.max(...studioPlayers(studio).map(p => playerFiles(p)?.length ?? 0));

    return (
        <Listbox
            value={currentPlayer}
            onValueChange={
                (newVal) => {
                    onSelect && onSelect(newVal);
                }
            }
            className={"size-full space-y-1 overflow-y-auto py-1"}
        >
            {
                (studios ?? [undefined]).map((studio, i) => (
                    <Fragment key={i}>
                        {
                            studio
                            && (
                                <>
                                    <div className={"flex items-center justify-between px-3.5 pt-1.5 text-foreground-primary/.5"}>
                                        <span>{getFullStudioName(studio.label)}</span>
                                        <span className={"text-xs text-foreground-primary/.5"}>
                                            {studioEpisodesCount(studio)}
                                        </span>
                                    </div>
                                    <div className={"w-full px-3"}>
                                        <Separator className={"mb-0.5 h-px w-full bg-foreground-primary/.125"} />
                                    </div>
                                </>
                            )
                        }
                        <Listbox.Group className={"w-full px-0.5"} aria-label={studio?.label ?? "Плеер"}>
                            {
                                studioPlayers(studio).map((player, i) => (
                                    <Listbox.Option
                                        key={i}
                                        value={player}
                                        className={"group"}
                                        ref={player === currentPlayer ? currentOptionRef : undefined}
                                    >
                                        <OptionItem label={player.label} />
                                    </Listbox.Option>
                                ))
                            }
                        </Listbox.Group>
                    </Fragment>
                ))
            }
        </Listbox>
    );
}

type OptionItemProps = {
    label: string;
    itemsCount?: number | string;
    className?: string;
};

function OptionItem({ label, itemsCount, className }: OptionItemProps) {
    return (
        <div role={"button"} className={"w-full px-1 py-0.5 text-start -outline-offset-4 group-hover:cursor-pointer group-aria-selected:cursor-default"}>
            <div className={cn("pl-2.5 pb-1 pt-1.5 rounded relative group-hover:bg-foreground-primary/.0625 group-aria-selected:bg-foreground-primary/.125 truncate text-clip", className)}>
                <span>{label}</span>
                {!!itemsCount && <span className={"absolute right-2 top-px flex h-full items-center text-xs text-foreground-primary/.5"}>{itemsCount}</span>}
            </div>
        </div>
    );
}