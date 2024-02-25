import TextSkeleton from "@/components/ui/text-skeleton";
import { useOnChange } from "@/hooks/useOnChange";
import { EpisodeRecord } from "@/lib/dexie";
import { cn } from "@/lib/utils";
import { useAnimejoyLegacyStorage } from "@/query-hooks/useAnimejoyLegacyStorage";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { getAnimeIdFromPathname } from "@/scraping/animejoy/misc";
import { getLastWatched, setEpisodeRecord } from "@/scraping/animejoy/new-storage";
import { getFullStudioName } from "@/scraping/animejoy/playlists";
import { PlaylistFile, PlaylistPlayer } from "@/types/animejoy";
import { useCallback, useMemo, useState } from "react";
import { HiMiniCheck } from "react-icons/hi2";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import EpisodeSelect from "./episode-select";
import PlayerIframe from "./player-iframe";
import PlayerSelect from "./player-select";


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

    const { query: watched, mutation: toggleWatched } = useAnimejoyLegacyStorage();

    const nextEpisode = useCallback((currentFile: PlaylistFile | undefined, files?: PlaylistFile[]) => {
        if (!playerFiles?.length && !files) return;

        const nextFileIndex = (files ?? playerFiles!).findIndex(f => f === currentFile) + 1;
        console.log({ currentFile, playerFiles, files, nextFileIndex, ch: files?.findIndex(f => f === currentFile) });
        if (nextFileIndex) {
            return (files ?? playerFiles!)[nextFileIndex];
        }
    }, [playerFiles]);

    const prevEpisode = useCallback((currentFile: PlaylistFile | undefined) => {
        if (!playerFiles) return;

        const prevFileIndex = playerFiles.findIndex(f => f === currentFile) - 1;
        if (prevFileIndex > -1) {
            return playerFiles[prevFileIndex];
        }
    }, [playerFiles]);

    const onPlayerChange = useCallback(() => {
        console.log("onPlayerChange RUN");
        const newFile = playerFiles?.find(f => f.label === currentFile?.label);
        setCurrentFile(newFile ?? playerFiles?.at(0));
    }, [currentFile, playerFiles]);

    const onPageChange = useCallback(async () => {
        console.log("onPageChange RUN");

        const lastWatchedRecord = await getLastWatched(animejoyID);

        const lastWatched = lastWatchedRecord
            ? files?.find(f =>
                f.label === lastWatchedRecord.label
                && f.player?.label === lastWatchedRecord.player
                && f.player?.studio?.label === lastWatchedRecord.studio,
            )
            : undefined;

        const playerFiles = lastWatched ? files?.filter(f => f.player === lastWatched.player) : undefined;
        const newFile = lastWatched ? (nextEpisode(lastWatched, playerFiles) ?? lastWatched) : files?.[0];
        console.log({ lastWatched, next: nextEpisode(lastWatched, playerFiles), playerFiles, files });
        setCurrentPlayer(newFile?.player);
        setCurrentFile(newFile);
    }, [animejoyID, files, nextEpisode]);

    useOnChange(currentPlayer, onPlayerChange);
    useOnChange(playlists, onPageChange);

    // useLayoutEffect(() => {
    //   // setCurrentPlayer(players?.[0]);
    //   setCurrentPlayer(currentFile?.player);
    // }, [currentFile?.player]);

    // useLayoutEffect(() => {
    //   setCurrentFile(playerFiles?.find(f => f === lastWatched || f.label === lastWatched?.label));
    // }, [currentPlayer, lastWatched, playerFiles]);

    // useLayoutEffect(() => {
    //   // setCurrentFile(files?.find(f => f.player === currentPlayer));
    //   if (lastWatched) setCurrentFile(nextEpisode(lastWatched) ?? lastWatched);
    //   else setCurrentFile(files?.[0]);

    // }, [files, lastWatched, nextEpisode]);

    const toNextEpisode = () => {
        if (!currentFile) return;

        toggleWatched.mutate({ episode: currentFile, force: true });
        setEpisodeRecord(new EpisodeRecord(
            animejoyID,
            currentFile,
            playerFiles?.findIndex(f => f === currentFile) ?? 0, // ! check lack of playerFiles case
        ));
        nextEpisode && setCurrentFile(nextEpisode(currentFile));
    };

    const toPrevEpisode = () => {
        if (!currentFile) return;

        prevEpisode && setCurrentFile(prevEpisode(currentFile));
    };

    const fullStudioName = getFullStudioName(currentPlayer?.studio?.label);

    return (
        <section className={"flex flex-col gap-1.5 "}>
            <div className={"flex w-full items-end justify-between gap-2"}>
                <div className={"flex h-5 w-full items-end justify-between gap-3 direct-children:w-48 direct-children:px-3.5"}>
                    <header className={"text-lg leading-none"}>{currentFile?.label ?? <TextSkeleton className={"block w-full"} length={1} />}</header>
                    {/* {
                        currentFile && isWatched(currentFile, watched.data)
                        && (
                            <button className={"text-xs text-foreground-primary/.5 flex leading-none items-end gap-0.5 group"}>
                                <span className={" "}>Посмотрено</span>
                                <IoClose className={"group-hover:opacity-100 opacity-0 transition-opacity h-3.5 w-3.5 -mb-px"} />
                            </button>
                        )
                    } */}
                    <div className={"flex gap-1"}>
                        {
                            players
                                ? (
                                    <>
                                        {
                                            currentPlayer?.studio
                                            && (
                                                <>
                                                    <span className={"pt-0.5 text-sm leading-none text-foreground-primary/.5"}>{fullStudioName}</span>
                                                    <span className={"pt-0.5 text-sm leading-none text-foreground-primary/.5"}>/</span>
                                                    {/* <DotSplitter className={"w-1 h-1 my-auto text-foreground-primary/.25"} /> */}
                                                </>
                                            )
                                        }
                                        <span className={"leading-none"}>{currentPlayer?.label}</span>
                                    </>
                                )
                                : <TextSkeleton className={"block w-full"} length={1} />
                        }
                    </div>
                </div>
            </div>
            <div className={"relative flex h-min gap-1.5"}>
                <div className={"relative w-48 shrink-0"}>
                    <div className={"absolute size-full overflow-hidden rounded bg-background-secondary"}>
                        <EpisodeSelect currentPlayer={currentPlayer} currentFile={currentFile} onSelect={setCurrentFile} />
                    </div>
                </div>
                <PlayerIframe key={currentFile?.src} src={currentFile?.src} />
                <div className={"relative w-48 shrink-0"}>
                    <div className={"absolute size-full overflow-hidden rounded bg-background-secondary"}>
                        <PlayerSelect currentPlayer={currentPlayer} onSelect={setCurrentPlayer} />
                    </div>
                </div>
            </div>
            <div className={"flex h-12 gap-1.5"}>
                <div className={"w-48 shrink-0"}></div>
                <div className={"flex w-full gap-1.5"}>
                    <button
                        onClick={toPrevEpisode}
                        className={
                            cn(
                                "flex-1 flex gap-0 items-center leading-none justify-center text-foreground-primary/.5 bg-background-secondary highlight:bg-foreground-primary/.0625 rounded highlight:text-foreground-primary transition-colors relative flex-col",
                                !prevEpisode && "pointer-events-none text-foreground-primary/.125",
                                !playlists && "pointer-events-none direct-children:hidden",
                            )
                        }
                        aria-disabled={!prevEpisode(currentFile)}
                    >
                        <RxDoubleArrowLeft className={"size-6"} />
                        {/* <span className="text-xs absolute top-1/2 translate-y-2/3">Назад</span> */}
                    </button>
                    <button
                        onClick={toNextEpisode}
                        className={
                            cn(
                                "flex-1 flex gap-0 items-center leading-none justify-center text-foreground-primary/.5 bg-background-secondary highlight:bg-foreground-primary/.0625 rounded highlight:text-foreground-primary transition-colors relative flex-col ml-auto",
                                !playlists && "pointer-events-none direct-children:hidden",
                            )
                        }
                    >
                        {
                            nextEpisode(currentFile)
                                ? <RxDoubleArrowRight className={"size-6"} />
                                : <HiMiniCheck className={"size-6"} />
                        }
                        {/* <span className="text-xs absolute top-1/2 translate-y-2/3">Дальше</span> */}
                    </button>
                </div>
                <div className={"w-48 shrink-0"}></div>
            </div>
        </section>
    );
}