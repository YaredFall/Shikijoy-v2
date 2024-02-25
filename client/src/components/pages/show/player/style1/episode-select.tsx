import { useRef } from "react";
import { TbSelector } from "react-icons/tb";
import { TiEye } from "react-icons/ti";
import { cn } from "@/lib/utils";
import { useAnimejoyLegacyStorage } from "@/query-hooks/useAnimejoyLegacyStorage";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { PlaylistFile, PlaylistPlayer } from "@/types/animejoy";
import Listbox from "@/components/ui/primitives/listbox";
import Popover from "@/components/ui/primitives/popover";

type EpisodeSelectProps = {
    currentPlayer?: PlaylistPlayer;
    currentFile?: PlaylistFile;
    onSelect?: (file: PlaylistFile) => void;
};

export default function EpisodeSelect({ currentPlayer, currentFile, onSelect }: EpisodeSelectProps) {

    const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

    const { studios, players, files } = playlists ?? {};

    const playlist = files?.filter(f => f.player === currentPlayer);

    const listboxRef = useRef<HTMLDivElement>(null);

    const { query, mutation } = useAnimejoyLegacyStorage();

    return (
        <Popover className={"relative"}>
            <Popover.Trigger
                className={cn("h-8 bg-secondary text-foreground-primary w-40 py-1 rounded flex justify-between items-center pl-5 pr-2 group", isLoadingPlaylists && "animate-pulse-slow")}
                onKeyDown={
                    (e) => {
                        if (playlist && e.code === "ArrowDown") {
                            e.preventDefault();
                            listboxRef.current?.focus();
                        }
                    }
                }
            >
                {
                    files
                && (
                    <>
                        {currentFile?.label}
                        <TbSelector className={"ml-auto text-foreground-primary/.5 transition-colors group-hover:text-foreground-primary"} />
                    </>
                )
                }
            </Popover.Trigger>
            <Popover.Content className={"absolute right-0 top-full z-10 mt-1.5 inline-flex max-h-[50vh] gap-0 overflow-hidden rounded bg-background-secondary text-foreground-primary"}>
                <Listbox className={"w-40 overflow-y-auto"} onValueChange={onSelect} ref={listboxRef}>
                    <div className={"pl-3.5 pt-2 text-sm text-foreground-primary/.5"}>{players ? "Серия" : "Плеер"}</div>
                    <Listbox.Group className={"px-0.5 pb-1"} aria-label={"Плеер"}>
                        {
                            playlist?.map((file, i) => (
                                <Listbox.Option key={i} value={file} className={"group px-1 py-0.5 -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default"}>
                                    <OptionItem
                                        label={file.label}
                                        isWatched={query.data?.includes(file)}
                                        toggleWatched={() => {
                                            mutation.mutate({ episode: file });
                                        }}
                                    />
                                </Listbox.Option>
                            ))
                        }
                    </Listbox.Group>
                </Listbox>
            </Popover.Content>
        </Popover>
    );
}
type OptionItemProps = {
    label: string;
    className?: string;
    isWatched?: boolean;
    toggleWatched?: () => void;
};
function OptionItem({ label, isWatched, toggleWatched, className }: OptionItemProps) {
    return (
        <div className={cn("pl-4 py-0.5 rounded relative group-hover:bg-foreground-primary/.0625 group-aria-selected:bg-foreground-primary/.125 truncate text-clip", className)}>
            <span>{label}</span>
            {
                isWatched !== undefined
            && <TiEye className={cn("absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 p-0.5 transition-color", isWatched ? "text-foreground-primary/.5" : "text-foreground-primary/.125")} />
            }
        </div>
    );
}