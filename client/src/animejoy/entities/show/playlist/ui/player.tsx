import { useWatchStamps } from "@client/animejoy/entities/show/playlist/api";
import { PlaylistEpisode, PlaylistPlayer } from "@client/animejoy/entities/show/playlist/model";
import EpisodeSelect from "@client/animejoy/entities/show/playlist/ui/episode-select";
import PlayerIframe from "@client/animejoy/entities/show/playlist/ui/player-iframe";
import PlaylistPlayerSelect from "@client/animejoy/entities/show/playlist/ui/playlist-player-select";
import { animejoyClient } from "@client/animejoy/shared/api/client";
import { useEffectOnChange } from "@client/shared/hooks/useOnChange";
import { cn } from "@client/shared/lib/cn";
import { useLoaderData, useParams } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { HiMiniCheck } from "react-icons/hi2";
import { RiRefreshLine } from "react-icons/ri";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";

const getPlayerEpisodes = (player: PlaylistPlayer | undefined, episodes: PlaylistEpisode[] | undefined) => {
    const res = episodes?.filter(e => e.player === player);
    return res?.length ? res : undefined;
};

const getNextEpisode = (current: PlaylistEpisode | undefined, episodes: PlaylistEpisode[] | undefined) => {
    if (!current || !episodes?.length) return undefined;

    const playerEpisodes = getPlayerEpisodes(current.player, episodes);
    if (!playerEpisodes) return undefined;

    const nextIndex = playerEpisodes.findIndex(ep => ep === current) + 1;
    return nextIndex ? playerEpisodes[nextIndex] : undefined;
};

const getPrevEpisode = (current: PlaylistEpisode | undefined, episodes: PlaylistEpisode[] | undefined) => {
    if (!current || !episodes?.length) return undefined;

    const playerEpisodes = getPlayerEpisodes(current.player, episodes);
    if (!playerEpisodes) return undefined;

    const prevIndex = playerEpisodes.findIndex(ep => ep === current) - 1;
    return prevIndex > -1 ? episodes[prevIndex] : undefined;
};

type PlayerProps = Record<never, never>;

export default function Player({ }: PlayerProps) {

    const { showId } = useParams({ from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/" });
    const { animejoyAnimeId } = useLoaderData({ from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/" });

    const [{ /* studios, players, */ episodes }] = animejoyClient.show.playlist.useSuspenseQuery({ id: showId });

    const watchstamps = useWatchStamps(animejoyAnimeId, episodes);

    const [currentPlayer, setCurrentPlayer] = useState<PlaylistPlayer | undefined>();
    const [currentEpisode, setCurrentEpisode] = useState<PlaylistEpisode | undefined>();


    const playerEpisodes = useMemo(() => getPlayerEpisodes(currentPlayer, episodes), [episodes, currentPlayer]);


    const nextEpisode = useMemo(() => getNextEpisode(currentEpisode, playerEpisodes), [currentEpisode, playerEpisodes]);
    const prevEpisode = useMemo(() => getPrevEpisode(currentEpisode, playerEpisodes), [currentEpisode, playerEpisodes]);
    const isWatched = useMemo(() => currentEpisode && watchstamps.isWatched(currentEpisode), [currentEpisode, watchstamps]);

    const [initialized, setInitialized] = useState(false);
    const onInitialize = useCallback(() => {
        if (!episodes) return;
        setInitialized(true);

        if (watchstamps.last) {
            const next = getNextEpisode(watchstamps.last, episodes);
            setCurrentPlayer(watchstamps.last.player);
            setCurrentEpisode(next ?? watchstamps.last);
        } else {
            setCurrentPlayer(episodes[0]?.player);
            setCurrentEpisode(episodes[0]);
        }
    }, [episodes, watchstamps.last]);

    const onPlayerChange = useCallback(() => {
        if (!initialized) return;
        
        const newEpisode = playerEpisodes?.find(e => e.label === currentEpisode?.label);
        setCurrentEpisode(newEpisode ?? playerEpisodes?.at(0));
    }, [currentEpisode, initialized, playerEpisodes]);

    useEffectOnChange(watchstamps.last ?? animejoyAnimeId, onInitialize);
    useEffectOnChange(currentPlayer, onPlayerChange);


    const toNextEpisode = useCallback(() => {
        if (!currentEpisode) return;

        watchstamps.create(currentEpisode);

        if (nextEpisode) setCurrentEpisode(nextEpisode);
    }, [currentEpisode, nextEpisode, watchstamps]);

    const toPrevEpisode = useCallback(() => {
        if (!currentEpisode) return;

        if (prevEpisode) setCurrentEpisode(prevEpisode);
    }, [currentEpisode, prevEpisode]);

    const [reloadCount, setReloadCount] = useState(0);

    return (
        <section className={"flex flex-col gap-1.5"}>
            {/* <header className={"grid grid-cols-[12rem_auto_12rem] gap-1.5 "}>
                <div />
                <div className={"flex items-baseline justify-between px-1"}>
                    <span className={"text-xl font-medium"}>{currentEpisode?.label}</span>
                    {currentEpisode?.player?.studio && (
                        <>
                            <span className={"ml-auto text-lg"}>{getFullStudioName(currentEpisode.player.studio.label)}</span>
                            <span className={"mx-1"}>/</span>
                        </>
                    )}
                    <span className={"text-lg"}>{currentEpisode?.player?.label}</span>
                </div>
            </header> */}
            <div className={"relative grid h-min grid-cols-[12rem_auto_12rem] gap-1.5 direct-children:grid direct-children:grid-rows-[auto_3rem] direct-children:gap-1.5"}>
                <div>
                    <div className={"relative"}>
                        <div className={"absolute size-full overflow-hidden rounded bg-background-secondary"}>
                            <EpisodeSelect currentPlayer={currentPlayer} currentEpisode={currentEpisode} onSelect={setCurrentEpisode} />
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className={"grid grid-cols-2"}>
                    <button
                        onClick={toPrevEpisode}
                        className={
                            cn(
                                "order-2 flex-1 flex gap-0 items-center leading-none justify-center text-foreground-primary/.5 bg-background-secondary highlight:bg-foreground-primary/.0625 rounded highlight:text-foreground-primary transition-colors relative flex-col",
                                !prevEpisode && "pointer-events-none text-foreground-primary/.125 duration-0",
                                // !playlists && "pointer-events-none direct-children:hidden",
                            )
                        }
                        aria-disabled={!prevEpisode}
                    >
                        <RxDoubleArrowLeft className={"size-6"} />
                        {/* <span className="text-xs absolute top-1/2 translate-y-2/3">Назад</span> */}
                    </button>
                    <div className={"col-span-2"}>
                        <PlayerIframe key={currentEpisode ? reloadCount + currentEpisode.src : undefined} src={currentEpisode?.src} />
                    </div>
                    <button
                        onClick={toNextEpisode}
                        className={
                            cn(
                                "order-2 flex-1 flex gap-0 items-center leading-none justify-center text-foreground-primary/.5 bg-background-secondary highlight:bg-foreground-primary/.0625 rounded highlight:text-foreground-primary transition-colors relative flex-col only:ml-auto",
                                !nextEpisode && isWatched && "pointer-events-none text-foreground-primary/.125 duration-0",
                                // !playlists && "pointer-events-none direct-children:hidden",
                            )
                        }
                    >
                        {
                            nextEpisode
                                ? <RxDoubleArrowRight className={"size-6"} />
                                : <HiMiniCheck className={"size-6"} />
                        }
                        {/* <span className="text-xs absolute top-1/2 translate-y-2/3">Дальше</span> */}
                    </button>
                </div>
                <div>
                    <div className={"relative"}>
                        <div className={"absolute size-full overflow-hidden rounded bg-background-secondary"}>
                            <PlaylistPlayerSelect currentPlayer={currentPlayer} onSelect={setCurrentPlayer} />
                        </div>
                    </div>
                    <div className={"flex flex-col items-center justify-center text-sm text-foreground-primary/.5"}>
                        <button
                            className={"mr-2 flex gap-1 transition-colors highlight:text-foreground-primary"}
                            onClick={() => {
                                setReloadCount(reloadCount + 1);
                            }}
                        >
                            <RiRefreshLine className={"text-lg"} />
                            <span className={"leading-snug"}>Перезагрузить плеер</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}