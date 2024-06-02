import { useOnChange } from "@/hooks/useOnChange";
import { cn } from "@/lib/utils";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { getAnimeIdFromPathname } from "@/scraping/animejoy/misc";
import { useCallback, useMemo, useState } from "react";
import { HiMiniCheck } from "react-icons/hi2";
import { RiRefreshLine } from "react-icons/ri";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import EpisodeSelect from "./episode-select";
import PlayerIframe from "./player-iframe";
import PlayerSelect from "./player-select";
import { PlaylistEpisode, PlaylistPlayer } from "@/entities/animejoy/playlist/model";
import { useWatchedEpisodeStorage } from "@/entities/animejoy/playlist/api";

type PlayerProps = Record<never, never>;

export default function Player({ }: PlayerProps) {

    const location = useLocation();
    const animejoyAnimeId = useMemo(() => getAnimeIdFromPathname(location.pathname), [location]);

    const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

    const { studios, players, episodes } = playlists ?? {};

    const [currentPlayer, setCurrentPlayer] = useState<PlaylistPlayer | undefined>();
    const [currentEpisode, setCurrentEpisode] = useState<PlaylistEpisode | undefined>();

    const playerEpisodes = useMemo(() => {
        const res = episodes?.filter(e => e.player === currentPlayer);
        return res?.length ? res : undefined;
    }, [episodes, currentPlayer]);

    const { watchedEpisodesQuery, setIsWatchedMutation } = useWatchedEpisodeStorage(animejoyAnimeId, episodes);

    const lastWatchedOrFirst = useMemo(() => watchedEpisodesQuery.data?.last ?? episodes?.[0], [episodes, watchedEpisodesQuery.data?.last]);

    const findNextEpisode = useCallback((currentEpisode: PlaylistEpisode | undefined, episodes?: PlaylistEpisode[]) => {
        if (!playerEpisodes?.length && !episodes) return;

        const nextEpisodeIndex = (episodes ?? playerEpisodes!).findIndex(e => e === currentEpisode) + 1;
        console.log({ currentEpisode, playerEpisodes, episodes, nextEpisodeIndex, ch: episodes?.findIndex(e => e === currentEpisode) });
        if (nextEpisodeIndex) {
            return (episodes ?? playerEpisodes!)[nextEpisodeIndex];
        }
    }, [playerEpisodes]);

    const findPrevEpisode = useCallback((currentEpisode: PlaylistEpisode | undefined) => {
        if (!playerEpisodes) return;

        const prevEpisodeIndex = playerEpisodes.findIndex(e => e === currentEpisode) - 1;
        if (prevEpisodeIndex > -1) {
            return playerEpisodes[prevEpisodeIndex];
        }
    }, [playerEpisodes]);

    const nextEpisode = useMemo(() => findNextEpisode(currentEpisode), [currentEpisode, findNextEpisode]);
    const prevEpisode = useMemo(() => findPrevEpisode(currentEpisode), [currentEpisode, findPrevEpisode]);
    const isWatched = useMemo(
        () => currentEpisode ? watchedEpisodesQuery.data?.watchedIndexes?.has(currentEpisode.index) : undefined,
        [currentEpisode, watchedEpisodesQuery.data?.watchedIndexes],
    );

    const onPlayerChange = useCallback(() => {
        console.log("onPlayerChange RUN");
        const newEpisode = playerEpisodes?.find(e => e.label === currentEpisode?.label);
        setCurrentEpisode(newEpisode ?? playerEpisodes?.at(0));
    }, [currentEpisode, playerEpisodes]);

    const onPageChange = useCallback(async () => {
        if (!lastWatchedOrFirst) return console.warn("a de episod");
        const playerEpisodes = episodes?.filter(e => e.player === lastWatchedOrFirst.player);
        const newEpisode = watchedEpisodesQuery.data?.last ? (findNextEpisode(watchedEpisodesQuery.data.last, playerEpisodes) ?? watchedEpisodesQuery.data?.last) : episodes?.[0];
        console.log({ animejoyID: animejoyAnimeId, lastWatched: watchedEpisodesQuery.data?.last, next: findNextEpisode(watchedEpisodesQuery.data?.last, playerEpisodes), newEpisode, playerEpisodes, episodes: episodes });
        setCurrentPlayer(newEpisode?.player);
        setCurrentEpisode(newEpisode);
    }, [animejoyAnimeId, episodes, findNextEpisode, watchedEpisodesQuery.data?.last, lastWatchedOrFirst]);

    useOnChange(currentPlayer, onPlayerChange);
    useOnChange(lastWatchedOrFirst, onPageChange);

    // useLayoutEffect(() => {
    //     const playerEpisodes = lastWatched ? episodes?.filter(e => e.player === lastWatched.player) : undefined;
    //     const newEpisode = lastWatched ? (findNextEpisode(lastWatched, playerEpisodes) ?? lastWatched) : episodes?.[0];
    //     console.log({ animejoyID, lastWatched, next: findNextEpisode(lastWatched, playerEpisodes), playerEpisodes, episodes });
    //     setCurrentPlayer(newEpisode?.player);
    //     setCurrentEpisode(newEpisode);
    // }, [animejoyID, episodes, findNextEpisode, lastWatched]);

    const toNextEpisode = useCallback(() => {
        if (!currentEpisode) return;

        setIsWatchedMutation.mutate({ episode: currentEpisode, value: true });

        nextEpisode && setCurrentEpisode(nextEpisode);
    }, [currentEpisode, nextEpisode, setIsWatchedMutation]);

    const toPrevEpisode = () => {
        if (!currentEpisode) return;
        prevEpisode && setCurrentEpisode(prevEpisode);
    };

    const [reloadCount, setReloadCount] = useState(0);

    return (
        <section className={"flex flex-col gap-1.5 "}>
            {JSON.stringify(currentEpisode)}
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
                                !playlists && "pointer-events-none direct-children:hidden",
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
                                !playlists && "pointer-events-none direct-children:hidden",
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
                            <PlayerSelect currentPlayer={currentPlayer} onSelect={setCurrentPlayer} />
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