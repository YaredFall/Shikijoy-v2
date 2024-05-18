import Listbox from "@/components/ui/primitives/listbox";
import { useOnChange } from "@/hooks/useOnChange";
import { cn } from "@/lib/utils";
import { useLegacyAnimejoyStorage } from "@/query-hooks/useLegacyAnimejoyStorage";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { isWatched } from "@/scraping/animejoy/legacy-storage";
import { PlaylistPlayer, PlaylistFile } from "@/types/animejoy";
import { useRef, useMemo, createRef, useCallback } from "react";
import { TiEye } from "react-icons/ti";
import { createOrDeleteWatchStamp } from "@/scraping/animejoy/new-storage";
import { useLocation } from "react-router-dom";
import { getAnimeIdFromPathname } from "@/scraping/animejoy/misc";

type EpisodeSelectProps = {
    currentPlayer?: PlaylistPlayer;
    currentFile?: PlaylistFile;
    onSelect?: (file: PlaylistFile) => void;
};

export default function EpisodeSelect({ currentPlayer, currentFile, onSelect }: EpisodeSelectProps) {
    const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

    const { studios, players, files } = playlists ?? {};

    const playlist = files?.filter(f => f.player === currentPlayer);

    const location = useLocation();
    const animejoyID = useMemo(() => getAnimeIdFromPathname(location.pathname), [location]);

    const listboxRef = useRef<HTMLDivElement>(null);
    const optionsRefs = useMemo(() => new Map(playlist?.map(ep => [ep, createRef<HTMLLIElement>()])), [playlist]);

    const { query, mutation } = useLegacyAnimejoyStorage();

    const playerFiles = useMemo(() => {
        const res = files?.filter(f => f.player === currentPlayer);
        return res?.length ? res : undefined;
    }, [files, currentPlayer]);

    useOnChange(currentFile, () => {
        // @ts-expect-error: Map key type is too strict
        const elRef = optionsRefs.get(currentFile);
        elRef?.current?.scrollIntoView({
            block: "nearest",
            behavior: "instant",
        });
    });

    const onToggleIsWatched = useCallback((episode: PlaylistFile) => {
        if (!currentFile) return console.warn(" Current episode value is undefined!");
        mutation.mutate({ episode });
        createOrDeleteWatchStamp({
            animejoyID,
            src: currentFile.src,
            createdAt: new Date().toISOString(),
        });
    }, [animejoyID, currentFile, mutation]);

    return (
        <Listbox className={"h-full overflow-y-auto"} value={currentFile} onValueChange={onSelect} ref={listboxRef}>
            {/* <div className="text-sm text-foreground-primary/.5 pl-3.5 pt-2">{players ? "Серия" : "Плеер"}</div> */}
            <Listbox.Group className={"px-0.5 py-1"} aria-label={"Плеер"}>
                {
                    playlist?.map((file, i) => (
                        <Listbox.Option key={i} value={file} className={"group scroll-m-1"} ref={optionsRefs.get(file)}>
                            <OptionItem
                                label={file.label}
                                isWatched={isWatched(file, query.data)}
                                toggleIsWatched={() => onToggleIsWatched(file)}
                            />
                        </Listbox.Option>
                    ))
                }
            </Listbox.Group>
        </Listbox>
    );
}
type OptionItemProps = {
    label: string;
    className?: string;
    isWatched?: boolean;
    toggleIsWatched: () => void;
};
function OptionItem({ label, isWatched, className, toggleIsWatched }: OptionItemProps) {
    return (
        <div role={"button"} className={"w-full px-1 py-0.5 text-start -outline-offset-4 group-hover:cursor-pointer group-aria-selected:cursor-default"}>
            <div className={cn("pl-2.5 pr-7 pb-1 pt-1.5 rounded relative group-hover:bg-foreground-primary/.0625 group-aria-selected:bg-foreground-primary/.125 truncate text-clip", className)}>
                <div>{label}</div>
                {
                    isWatched !== undefined
                    && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleIsWatched();
                            }}
                            className={
                                cn(
                                    "absolute right-1.5 inset-y-1.5 aspect-square transition-color highlight:bg-background-tertiary rounded",
                                    isWatched ? "text-foreground-primary/.5" : "text-foreground-primary/.125",
                                )
                            }
                        >
                            <TiEye className={"mx-auto"} />
                        </button>
                    )
                }
            </div>
        </div>
    );
}