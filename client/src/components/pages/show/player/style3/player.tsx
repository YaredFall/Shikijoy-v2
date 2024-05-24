import { useOnChange } from "@/hooks/useOnChange";
import { cn } from "@/lib/utils";
import { useLegacyAnimejoyStorage } from "@/query-hooks/useLegacyAnimejoyStorage";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { getAnimeIdFromPathname } from "@/scraping/animejoy/misc";
import { getLastWatched, createOrDeleteWatchStamp } from "@/scraping/animejoy/new-storage";
import { PlaylistFile, PlaylistPlayer } from "@/types/animejoy";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { HiMiniCheck } from "react-icons/hi2";
import { RiRefreshLine } from "react-icons/ri";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import EpisodeSelect from "./episode-select";
import PlayerIframe from "./player-iframe";
import PlayerSelect from "./player-select";
import { getWatchedEpisodeWithHighestIndex } from "@/scraping/animejoy/legacy-storage";
import { useQuery } from "react-query";


type PlayerProps = Record<never, never>;

export default function Player({ }: PlayerProps) {

    const location = useLocation();
    const animejoyID = useMemo(() => getAnimeIdFromPathname(location.pathname), [location]);

    const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

    const { studios, players, files } = playlists ?? {};

    //   const { data: lastWatched, isIdle: isLoadedLastWatched } = useLastWatchedEpisode(animejoyID, files);

    const [currentPlayer, setCurrentPlayer] = useState<PlaylistPlayer | undefined>();
    const [currentFile, setCurrentFile] = useState<PlaylistFile | undefined>();

    const playerFiles = useMemo(() => {
        const res = files?.filter(f => f.player === currentPlayer);
        return res?.length ? res : undefined;
    }, [files, currentPlayer]);

    const { query: { data: legacyWatchedEpisodes, isLoading: isLoadingLegacyWatchedEpisodes }, mutation: toggleWatched } = useLegacyAnimejoyStorage();

    const { data: lastWatchedEpisode, isLoading: isLoadingLastWatchedEpisode } = useQuery([animejoyID, "lastWatchedEpisode"], async () => {
        const lastWatchedStamp = await getLastWatched(animejoyID);
        let lastWatchedEpisodeSrc = lastWatchedStamp?.src;

        if (!lastWatchedEpisodeSrc) {
            lastWatchedEpisodeSrc = getWatchedEpisodeWithHighestIndex(legacyWatchedEpisodes)?.src;
        }

        return files?.find(f => f.src === lastWatchedEpisodeSrc);
    }, {
        enabled: !isLoadingLegacyWatchedEpisodes && !isLoadingPlaylists,
        staleTime: Infinity,
    });

    const lastWatchedOrFirst = useMemo(() => lastWatchedEpisode ?? files?.[0], [files, lastWatchedEpisode]);

    const findNextEpisode = useCallback((currentFile: PlaylistFile | undefined, files?: PlaylistFile[]) => {
        if (!playerFiles?.length && !files) return;

        const nextFileIndex = (files ?? playerFiles!).findIndex(f => f === currentFile) + 1;
        console.log({ currentFile, playerFiles, files, nextFileIndex, ch: files?.findIndex(f => f === currentFile) });
        if (nextFileIndex) {
            return (files ?? playerFiles!)[nextFileIndex];
        }
    }, [playerFiles]);

    const findPrevEpisode = useCallback((currentFile: PlaylistFile | undefined) => {
        if (!playerFiles) return;

        const prevFileIndex = playerFiles.findIndex(f => f === currentFile) - 1;
        if (prevFileIndex > -1) {
            return playerFiles[prevFileIndex];
        }
    }, [playerFiles]);

    const nextEpisode = useMemo(() => findNextEpisode(currentFile), [currentFile, findNextEpisode]);
    const prevEpisode = useMemo(() => findPrevEpisode(currentFile), [currentFile, findPrevEpisode]);
    const isWatched = useMemo(() => legacyWatchedEpisodes?.includes(currentFile!), [currentFile, legacyWatchedEpisodes]);

    const onPlayerChange = useCallback(() => {
        console.log("onPlayerChange RUN");
        const newFile = playerFiles?.find(f => f.label === currentFile?.label);
        setCurrentFile(newFile ?? playerFiles?.at(0));
    }, [currentFile, playerFiles]);

    const onPageChange = useCallback(async () => {
        if (!lastWatchedOrFirst) return console.warn("a de episod");
        const playerFiles = files?.filter(f => f.player === lastWatchedOrFirst.player);
        const newFile = lastWatchedEpisode ? (findNextEpisode(lastWatchedEpisode, playerFiles) ?? lastWatchedEpisode) : files?.[0];
        console.log({ animejoyID, lastWatchedEpisode, next: findNextEpisode(lastWatchedEpisode, playerFiles), newFile, playerFiles, files });
        setCurrentPlayer(newFile?.player);
        setCurrentFile(newFile);
    }, [animejoyID, files, findNextEpisode, lastWatchedEpisode, lastWatchedOrFirst]);

    useOnChange(currentPlayer, onPlayerChange);
    useOnChange(lastWatchedOrFirst, onPageChange);

    // useLayoutEffect(() => {
    //     const playerFiles = lastWatchedEpisode ? files?.filter(f => f.player === lastWatchedEpisode.player) : undefined;
    //     const newFile = lastWatchedEpisode ? (findNextEpisode(lastWatchedEpisode, playerFiles) ?? lastWatchedEpisode) : files?.[0];
    //     console.log({ animejoyID, lastWatchedEpisode, next: findNextEpisode(lastWatchedEpisode, playerFiles), playerFiles, files });
    //     setCurrentPlayer(newFile?.player);
    //     setCurrentFile(newFile);
    // }, [animejoyID, files, findNextEpisode, lastWatchedEpisode]);

    const toNextEpisode = useCallback(() => {
        if (!currentFile) return;

        toggleWatched.mutate({ episode: currentFile, force: true });
        createOrDeleteWatchStamp({
            animejoyID,
            createdAt: new Date().toISOString(),
            src: currentFile.src,
        });

        nextEpisode && setCurrentFile(nextEpisode);
    }, [animejoyID, currentFile, nextEpisode, toggleWatched]);

    const toPrevEpisode = () => {
        if (!currentFile) return;
        prevEpisode && setCurrentFile(prevEpisode);
    };

    const [reloadCount, setReloadCount] = useState(0);

    return (
        <section className={"flex flex-col gap-1.5 "}>
            {JSON.stringify(currentFile)}
            <div className={"relative grid h-min grid-cols-[12rem_auto_12rem] gap-1.5 direct-children:grid direct-children:grid-rows-[auto_3rem] direct-children:gap-1.5"}>
                <div>
                    <div className={"relative"}>
                        <div className={"absolute size-full overflow-hidden rounded bg-background-secondary"}>
                            <EpisodeSelect currentPlayer={currentPlayer} currentFile={currentFile} onSelect={setCurrentFile} />
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
                        <PlayerIframe key={currentFile ? reloadCount + currentFile.src : undefined} src={currentFile?.src} />
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