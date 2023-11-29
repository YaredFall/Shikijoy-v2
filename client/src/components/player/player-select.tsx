import { Root as Separator } from "@radix-ui/react-separator";
import { useRef, useState } from "react";
import { TbSelector } from "react-icons/tb";
import { cn } from "../../lib/utils";
import { useAnimejoyPlaylists } from "../../query-hooks/useAnimejoyPlaylist";
import { PlaylistPlayer, PlaylistStudio } from "../../types/animejoy";
import Listbox from "../ui/listbox";
import Popover from "../ui/popover";

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
    <div className="flex gap-px items-baseline">
      {!!currentPlayer?.studio && <span className="pl-5 pr-5 text-sm text-primary/.5">{currentPlayer?.studio.label}</span>}
      <Popover className="relative">
        <Popover.Trigger className={cn("h-8 bg-secondary text-primary w-36 py-1 rounded flex justify-between items-center pl-5 pr-2 group", isLoadingPlaylists && "animate-pulse-slow")}
          onKeyDown={(e) => {
            if (playlists && e.code === "ArrowDown") {
              e.preventDefault();
              (studios ? studioListboxRef : playerListboxRef).current?.focus();
            }
          }}
        >
          {players &&
            <>
              {currentPlayer?.label}
              <TbSelector className={"text-primary/.5 group-hover:text-primary transition-colors ml-auto"} />
            </>
          }
        </Popover.Trigger>
        <Popover.Content className="absolute right-0 top-full mt-1 inline-flex gap-0 bg-secondary text-primary rounded" >
          {studios &&
            <>
              <Listbox
                ref={studioListboxRef}
                value={selectedStudio}
                onValueChange={(newStudio) => {
                  setSelectedStudio(newStudio);
                  setTimeout(() => {
                    playerListboxRef.current?.focus();
                  }, 0);
                }}
              >
                <div className="text-sm text-primary/.5 pl-3.5 pt-2">Студия</div>
                <Listbox.Group className="pb-1 px-0.5 w-36" aria-label="Студия">
                  {studios.map((studio, i) => (
                    <Listbox.Option key={i} value={studio} className="px-1 py-0.5 group -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default" onKeyDown={(e) => {
                      if (e.code === "ArrowRight") {
                        setSelectedStudio(studio);
                        setTimeout(() => {
                          playerListboxRef.current?.focus();
                        }, 0);
                      }
                    }}>
                      <OptionItem label={studio.label} itemsCount={studioPlayers(studio)?.length} />
                    </Listbox.Option>
                  ))}
                </Listbox.Group>
              </Listbox>
              <Separator orientation="vertical" className="w-px bg-primary/.25 my-2" />
            </>
          }
          <Listbox
            ref={playerListboxRef}
            value={currentPlayer?.studio === selectedStudio ? currentPlayer : undefined}
            onValueChange={onSelect}
            onKeyDown={(e) => {
              if (e.code === "ArrowLeft") {
                studioListboxRef.current?.focus();
              }
            }}
          >
            <div className="text-sm text-primary/.5 pl-3.5 pt-2">Плеер</div>
            <Listbox.Group className="pb-1 px-0.5 w-36" aria-label="Плеер">
              {studioPlayers(selectedStudio)?.map((player, i) => (
                <Listbox.Option key={i} value={player} className={"px-1 py-0.5 group -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default"}>
                  <OptionItem label={player.label} itemsCount={playerFiles(player)?.length} />
                </Listbox.Option>
              ))}
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

export function OptionItem({ label, itemsCount, className }: OptionItemProps) {
  return (
    <div className={cn("pl-4 py-0.5 rounded relative group-hover:bg-primary/.0625 group-aria-selected:bg-primary/.125 truncate text-clip", className)}>
      <span>{label}</span>
      {!!itemsCount && <span className="absolute right-2 top-px flex h-full items-center text-xs text-primary/.5">{itemsCount}</span>}
    </div>
  );
}
