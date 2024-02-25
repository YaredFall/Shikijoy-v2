import { Root as Separator } from "@radix-ui/react-separator";
import { useRef, useState } from "react";
import { TbSelector } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { PlaylistPlayer, PlaylistStudio } from "@/types/animejoy";
import Listbox from "@/components/ui/primitives/listbox";
import Popover from "@/components/ui/primitives/popover";

type PlayerSelectProps = {
    currentPlayer?: PlaylistPlayer;
    onSelect?: (player: PlaylistPlayer) => void;
};

export default function PlayerSelect({ currentPlayer, onSelect }: PlayerSelectProps) {

    const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

    const { studios, players, files } = playlists ?? {};

    const [selectedStudio, setSelectedStudio] = useState(currentPlayer?.studio ?? players?.[0].studio);

    const studioListboxRef = useRef<HTMLDivElement>(null);
    const playerListboxRef = useRef<HTMLDivElement>(null);

    if (!isLoadingPlaylists && !players) return null;

    const studioPlayers = (studio: PlaylistStudio | undefined) => players?.filter(p => !studio || p.studio === studio);
    const playerFiles = (player: PlaylistPlayer) => files?.filter(f => f.player === player);

    return (
        <div className={"flex items-baseline gap-px"}>
            {!!currentPlayer?.studio && <span className={"px-5 text-sm text-foreground-primary/.5"}>{currentPlayer?.studio.label}</span>}
            <Popover className={"relative"}>
                <Popover.Trigger
                    className={cn("h-8 bg-secondary text-foreground-primary w-36 py-1 rounded flex justify-between items-center pl-5 pr-2 group", isLoadingPlaylists && "animate-pulse-slow")}
                    onKeyDown={
                        (e) => {
                            if (playlists && e.code === "ArrowDown") {
                                e.preventDefault();
                                (studios ? studioListboxRef : playerListboxRef).current?.focus();
                            }
                        }
                    }
                >
                    {
                        players
                    && (
                        <>
                            {currentPlayer?.label}
                            <TbSelector className={"ml-auto text-foreground-primary/.5 transition-colors group-hover:text-foreground-primary"} />
                        </>
                    )
                    }
                </Popover.Trigger>
                <Popover.Content className={"absolute right-0 top-full z-10 mt-1.5 inline-flex gap-0 rounded bg-background-secondary text-foreground-primary"}>
                    {
                        studios
                    && (
                        <>
                            <Listbox
                                ref={studioListboxRef}
                                value={selectedStudio}
                                onValueChange={
                                    (newStudio) => {
                                        setSelectedStudio(newStudio);
                                        setTimeout(() => {
                                            playerListboxRef.current?.focus();
                                        }, 0);
                                    }
                                }
                            >
                                <div className={"pl-3.5 pt-2 text-sm text-foreground-primary/.5"}>Студия</div>
                                <Listbox.Group className={"w-36 px-0.5 pb-1"} aria-label={"Студия"}>
                                    {
                                        studios.map((studio, i) => (
                                            <Listbox.Option
                                                key={i}
                                                value={studio}
                                                className={"group px-1 py-0.5 -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default"}
                                                onKeyDown={
                                                    (e) => {
                                                        if (e.code === "ArrowRight") {
                                                            setSelectedStudio(studio);
                                                            setTimeout(() => {
                                                                playerListboxRef.current?.focus();
                                                            }, 0);
                                                        }
                                                    }
                                                }
                                            >
                                                <OptionItem label={studio.label} itemsCount={studioPlayers(studio)?.length} />
                                            </Listbox.Option>
                                        ))
                                    }
                                </Listbox.Group>
                            </Listbox>
                            <Separator orientation={"vertical"} className={"my-2 w-px bg-foreground-primary/.25"} />
                        </>
                    )
                    }
                    <Listbox
                        ref={playerListboxRef}
                        value={currentPlayer?.studio === selectedStudio ? currentPlayer : undefined}
                        onValueChange={onSelect}
                        onKeyDown={
                            (e) => {
                                if (e.code === "ArrowLeft") {
                                    studioListboxRef.current?.focus();
                                }
                            }
                        }
                    >
                        <div className={"pl-3.5 pt-2 text-sm text-foreground-primary/.5"}>Плеер</div>
                        <Listbox.Group className={"w-36 px-0.5 pb-1"} aria-label={"Плеер"}>
                            {
                                studioPlayers(selectedStudio)?.map((player, i) => (
                                    <Listbox.Option key={i} value={player} className={"group px-1 py-0.5 -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default"}>
                                        <OptionItem label={player.label} itemsCount={playerFiles(player)?.length} />
                                    </Listbox.Option>
                                ))
                            }
                        </Listbox.Group>
                    </Listbox>
                </Popover.Content>
            </Popover>
        </div>
    );
}

type OptionItemProps = {
    label: string;
    itemsCount?: number | string;
    className?: string;
};

function OptionItem({ label, itemsCount, className }: OptionItemProps) {
    return (
        <div className={cn("pl-4 py-0.5 rounded relative group-hover:bg-foreground-primary/.0625 group-aria-selected:bg-foreground-primary/.125 truncate text-clip", className)}>
            <span>{label}</span>
            {!!itemsCount && <span className={"absolute right-2 top-px flex h-full items-center text-xs text-foreground-primary/.5"}>{itemsCount}</span>}
        </div>
    );
}