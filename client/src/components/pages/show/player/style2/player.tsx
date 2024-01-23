import { useOnChange } from "@/hooks/useOnChange";
import { EpisodeRecord } from "@/lib/dexie";
import { cn } from "@/lib/utils";
import { useAnimejoyLegacyStorage } from "@/query-hooks/useAnimejoyLegacyStorage";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { isWatched } from "@/scraping/animejoy/legacy-storage";
import { getAnimeIdFromPathname } from "@/scraping/animejoy/misc";
import { getLastWatched, setEpisodeRecord } from "@/scraping/animejoy/new-storage";
import { PlaylistFile, PlaylistPlayer } from "@/types/animejoy";
import { useCallback, useMemo, useRef, useState } from "react";
import { HiMiniCheck } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
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

    const portalContainerRef = useRef<HTMLDivElement>(null);


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

    return (
        <section className={"flex flex-col gap-1.5 "}>
            <div className={"flex gap-2 w-full justify-between items-end"}>
                <div className={"flex gap-3 items-baseline pb-1"}>
                    <header className={"text-xl leading-none"}>{currentFile?.label}</header>
                    {
                        currentFile && isWatched(currentFile, watched.data)
                        && (
                            <button className={"text-xs text-primary/.5 flex leading-none items-end gap-0.5 group"}>
                                <span className={" "}>Посмотрено</span>
                                <IoClose className={"group-hover:opacity-100 opacity-0 transition-opacity h-3.5 w-3.5 -mb-px"} />
                            </button>
                        )
                    }
                </div>
                <PlayerSelect currentPlayer={currentPlayer} onSelect={setCurrentPlayer} portalContainerRef={portalContainerRef} />
            </div>
            <div className={"flex h-min relative gap-1.5"}>
                <PlayerIframe key={currentFile?.src} src={currentFile?.src} />
                <div className={"w-48 shrink-0 relative"}>
                    <div className={"rounded overflow-hidden h-full w-full border-2 border-primary/.0625 absolute"} ref={portalContainerRef}>
                        <EpisodeSelect currentPlayer={currentPlayer} currentFile={currentFile} onSelect={setCurrentFile} />
                    </div>
                </div>
            </div>
            <div className={"flex h-16 gap-1.5"}>
                <div className={"flex w-full gap-1.5"}>
                    <button
                        onClick={toPrevEpisode}
                        className={
                            cn(
                                "flex-1 flex gap-0 items-center leading-none justify-center text-primary/.5 border-primary/.0625 border-2 highlight:bg-primary/.0625 rounded highlight:text-primary transition-colors relative flex-col",
                                !prevEpisode && "pointer-events-none text-primary/.125",
                            )
                        }
                        aria-disabled={!prevEpisode(currentFile)}
                    >
                        <RxDoubleArrowLeft className={"h-6 w-6"} />
                        {/* <span className="text-xs absolute top-1/2 translate-y-2/3">Назад</span> */}
                    </button>
                    <button
                        onClick={toNextEpisode}
                        className={
                            cn(
                                "flex-1 flex gap-0 items-center leading-none justify-center text-primary/.5 border-primary/.0625 border-2 highlight:bg-primary/.0625 rounded highlight:text-primary/.75 transition-colors relative flex-col ml-auto",
                            )
                        }
                    >
                        {
                            nextEpisode(currentFile)
                                ? <RxDoubleArrowRight className={"h-6 w-6"} />
                                : <HiMiniCheck className={"h-6 w-6"} />
                        }
                        {/* <span className="text-xs absolute top-1/2 translate-y-2/3">Дальше</span> */}
                    </button>
                </div>
                <div className={"w-48 shrink-0"}></div>
            </div>
        </section>
    );
}