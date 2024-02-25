import { Root as Separator } from "@radix-ui/react-separator";
import { Fragment, RefObject, useRef, useState } from "react";
import { TbSelector } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { PlaylistPlayer, PlaylistStudio } from "@/types/animejoy";
import Listbox from "@/components/ui/primitives/listbox";
import Popover from "@/components/ui/primitives/popover";
import { Root as Portal } from "@radix-ui/react-portal";
import { getFullStudioName } from "@/scraping/animejoy/playlists";

type PlayerSelectProps = {
    currentPlayer?: PlaylistPlayer;
    onSelect?: (player: PlaylistPlayer) => void;
    portalContainerRef?: RefObject<HTMLDivElement>;
};

export default function PlayerSelect({ currentPlayer, onSelect, portalContainerRef }: PlayerSelectProps) {

    const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

    const { studios, players, files } = playlists ?? {};

    const playerListboxRef = useRef<HTMLDivElement>(null);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    if (!isLoadingPlaylists && !players) return null;

    const studioPlayers = (studio: PlaylistStudio | undefined) => players?.filter(p => !studio || p.studio === studio);
    const playerFiles = (player: PlaylistPlayer) => files?.filter(f => f.player === player);

    const fullStudioName = getFullStudioName(currentPlayer?.studio?.label);


    return (
        <div className={"flex items-end"}>
            {!!currentPlayer?.studio && <span className={"px-2.5 pb-1 text-sm leading-none text-foreground-primary/.5"}>{fullStudioName}</span>}
            <Popover className={"relative w-48"} open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Popover.Trigger
                    className={cn("w-full bg-background-secondary text-foreground-primary pb-[3px] pt-2 h-8 rounded flex justify-between items-end pl-4 pr-3.5 group border-2 border-secondary", isLoadingPlaylists && "animate-pulse-slow")}
                    onKeyDown={
                        (e) => {
                            if (playlists && e.code === "ArrowDown") {
                                e.preventDefault();
                                (playerListboxRef).current?.focus();
                            }
                        }
                    }
                >
                    {
                        players
                        && (
                            <>
                                <span className={"leading-none"}>{currentPlayer?.label}</span>
                                <TbSelector className={"mb-px ml-auto text-foreground-primary/.5 transition-colors group-hover:text-foreground-primary"} />
                            </>
                        )
                    }
                </Popover.Trigger>
                <Portal container={portalContainerRef?.current}>
                    <Popover.Content className={"absolute -inset-0.5 z-10 inline-flex gap-0 overflow-y-auto rounded border-2 border-transparent bg-background-secondary text-foreground-primary"}>
                        <Listbox
                            ref={playerListboxRef}
                            value={currentPlayer}
                            onValueChange={
                                (newVal) => {
                                    onSelect && onSelect(newVal);
                                    setIsPopoverOpen(false);
                                }
                            }
                            className={"w-full"}
                        >
                            {
                                (studios ?? [undefined]).map((studio, i) => (
                                    <Fragment key={i}>
                                        {!!i && <div className={"w-full px-3"}><Separator className={"h-px w-full bg-foreground-primary/.125"} /></div>}
                                        {
                                            studio
                                            && (
                                                <div className={"-mb-1.5 flex items-center justify-between px-3.5 pt-1 text-foreground-primary/.5"}>
                                                    <span>{getFullStudioName(studio.label)}</span>
                                                    <span className={"text-xs text-foreground-primary/.25"}>{Math.max(...(studioPlayers(studio)?.map(p => playerFiles(p)?.length ?? 0) ?? []))}</span>
                                                </div>
                                            )
                                        }
                                        <Listbox.Group className={"w-full px-0.5 py-1"} aria-label={studio?.label ?? "Плеер"}>
                                            {
                                                studioPlayers(studio)?.map((player, i) => (
                                                    <Listbox.Option key={i} value={player} className={"group"}>
                                                        <OptionItem label={player.label} />
                                                    </Listbox.Option>
                                                ))
                                            }
                                        </Listbox.Group>
                                    </Fragment>
                                ))
                            }
                        </Listbox>
                    </Popover.Content>
                </Portal>
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
        <button className={"w-full px-1 py-0.5 text-start -outline-offset-4 group-hover:cursor-pointer group-aria-selected:cursor-default"}>
            <div className={cn("pl-2.5 pb-1 pt-1.5 rounded relative group-hover:bg-foreground-primary/.0625 group-aria-selected:bg-foreground-primary/.125 truncate text-clip", className)}>
                <span>{label}</span>
                {!!itemsCount && <span className={"absolute right-2 top-px flex h-full items-center text-xs text-foreground-primary/.5"}>{itemsCount}</span>}
            </div>
        </button>
    );
}