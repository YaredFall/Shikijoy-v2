import { Root as Separator } from "@radix-ui/react-separator";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { PlaylistPlayer, PlaylistStudio } from "@/types/animejoy";
import Listbox from "@/components/ui/listbox";
import { getFullStudioName } from "@/scraping/animejoy/playlists";

type PlayerSelectProps = {
    currentPlayer?: PlaylistPlayer;
    onSelect?: (player: PlaylistPlayer) => void;
};

export default function PlayerSelect({ currentPlayer, onSelect }: PlayerSelectProps) {

    const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

    const { studios, players, files } = playlists ?? {};

    if (!isLoadingPlaylists && !players) return null;

    const studioPlayers = (studio: PlaylistStudio | undefined) => players?.filter(p => !studio || p.studio === studio);
    const playerFiles = (player: PlaylistPlayer) => files?.filter(f => f.player === player);


    return (
        <Listbox
            value={currentPlayer}
            onValueChange={
                (newVal) => {
                    onSelect && onSelect(newVal);
                }
            }
            className={"w-full overflow-y-auto h-full py-1 "}
        >
            {
                (studios ?? [undefined]).map((studio, i) => (
                    <Fragment key={i}>
                        {
                            studio
                            && (
                                <div className={"text-foreground-primary/.5 pt-2.5 px-3.5 flex justify-between items-center"}>
                                    <span>{getFullStudioName(studio.label)}</span>
                                    <span className={"text-xs text-foreground-primary/.25"}>{Math.max(...(studioPlayers(studio)?.map(p => playerFiles(p)?.length ?? 0) ?? []))}</span>
                                </div>
                            )
                        }
                        <div className={"w-full px-3"}><Separator className={"h-px w-full bg-foreground-primary/.125 mb-0.5"} /></div>
                        <Listbox.Group className={"px-0.5 w-full"} aria-label={studio?.label ?? "Плеер"}>
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
    );
}

type OptionItemProps = {
    label: string;
    itemsCount?: number | string;
    className?: string;
};

function OptionItem({ label, itemsCount, className }: OptionItemProps) {
    return (
        <button className={"px-1 py-0.5 -outline-offset-4 group-hover:cursor-pointer group-aria-selected:cursor-default text-start w-full"}>
            <div className={cn("pl-2.5 pb-1 pt-1.5 rounded relative group-hover:bg-foreground-primary/.0625 group-aria-selected:bg-foreground-primary/.125 truncate text-clip", className)}>
                <span>{label}</span>
                {!!itemsCount && <span className={"absolute right-2 top-px flex h-full items-center text-xs text-foreground-primary/.5"}>{itemsCount}</span>}
            </div>
        </button>
    );
}