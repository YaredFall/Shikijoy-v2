import { Root as Separator } from "@radix-ui/react-separator";
import { Fragment, RefObject, useRef, useState } from "react";
import { TbSelector } from "react-icons/tb";
import { cn } from "../../../lib/utils";
import { useAnimejoyPlaylists } from "../../../query-hooks/useAnimejoyPlaylist";
import { PlaylistPlayer, PlaylistStudio } from "../../../types/animejoy";
import Listbox from "../../ui/listbox";
import Popover from "../../ui/popover";
import { Root as Portal } from "@radix-ui/react-portal";
import { getFullStudioName } from "../../../scraping/animejoy/playlists";

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
    <div className="flex items-end">
      {!!currentPlayer?.studio && <span className="px-2.5 pb-1 leading-none text-sm text-primary/.5">{fullStudioName}</span>}
      <Popover className="relative w-48 pl-1.5" open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Popover.Trigger className={cn("w-full bg-secondary text-primary h-7.5 pb-0.5 pt-1.5 rounded flex justify-between items-end pl-4 pr-3.5 group border-2 border-secondary", isLoadingPlaylists && "animate-pulse-slow")}
          onKeyDown={(e) => {
            if (playlists && e.code === "ArrowDown") {
              e.preventDefault();
              (playerListboxRef).current?.focus();
            }
          }}
        >
          {players &&
            <>
              <span className="leading-none">{currentPlayer?.label}</span>
              <TbSelector className={"text-primary/.5 group-hover:text-primary transition-colors ml-auto mb-px"} />
            </>
          }
        </Popover.Trigger>
        <Portal container={portalContainerRef?.current}>
          <Popover.Content className="absolute z-10 left-0 right-0 top-0 h-full inline-flex gap-0 bg-secondary text-primary rounded overflow-y-auto" >
            <Listbox
              ref={playerListboxRef}
              value={currentPlayer}
              onValueChange={(newVal) => {
                onSelect && onSelect(newVal);
                setIsPopoverOpen(false);
              }}
              className="w-full"
            >
              {(studios ?? [undefined]).map((studio, i) => (
                <Fragment key={i}>
                  {!!i && <div className="w-full px-3"><Separator className="h-px w-full bg-primary/.125" /></div>}
                  <Listbox.Group className="py-1.5 px-0.5 w-full" aria-label={studio?.label ?? "Плеер"}>
                    {studioPlayers(studio)?.map((player, i) => (
                      <Listbox.Option key={i} value={player} className={"px-1 py-0.5 group -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default"}>
                        <OptionItem label={player.label} itemsCount={playerFiles(player)?.length} />
                      </Listbox.Option>
                    ))}
                  </Listbox.Group>
                </Fragment>
              ))}
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
    <div className={cn("pl-2.5 pt-1 pb-0.5 rounded relative group-hover:bg-primary/.0625 group-aria-selected:bg-primary/.125 truncate text-clip", className)}>
      <span>{label}</span>
      {!!itemsCount && <span className="absolute right-2 top-px flex h-full items-center text-xs text-primary/.5">{itemsCount}</span>}
    </div>
  );
}
