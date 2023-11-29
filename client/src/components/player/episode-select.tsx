import { useRef } from "react";
import { TbSelector } from "react-icons/tb";
import { cn } from "../../lib/utils";
import { useAnimejoyPlaylists } from "../../query-hooks/useAnimejoyPlaylist";
import { PlaylistFile, PlaylistPlayer } from "../../types/animejoy";
import Listbox from "../ui/listbox";
import { OptionItem } from "./player-select";
import Popover from "../ui/popover";

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

  return (
    <Popover className="relative">
      <Popover.Trigger className={cn("h-8 bg-secondary text-primary w-36 py-1 rounded flex justify-between items-center pl-5 pr-2 group", isLoadingPlaylists && "animate-pulse-slow")}
        onKeyDown={(e) => {
          if (playlist && e.code === "ArrowDown") {
            e.preventDefault();
            listboxRef.current?.focus();
          }
        }}
      >
        {files &&
          <>
            {currentFile?.label}
            <TbSelector className={"text-primary/.5 group-hover:text-primary transition-colors ml-auto"} />
          </>
        }
      </Popover.Trigger>
      <Popover.Content className="absolute right-0 top-full mt-1 max-h-[50vh] overflow-hidden inline-flex gap-0 bg-secondary text-primary rounded">
        <Listbox className="overflow-y-auto w-36" onValueChange={onSelect} ref={listboxRef}>
          <div className="text-sm text-primary/.5 pl-3.5 pt-2">{players ? "Серия" : "Плеер"}</div>
          <Listbox.Group className="pb-1 px-0.5" aria-label="Плеер">
            {playlist?.map((file, i) => (
              <Listbox.Option key={i} value={file} className={"px-1 py-0.5 group -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default"}>
                <OptionItem label={file.label} />
              </Listbox.Option>
            ))}
          </Listbox.Group>
        </Listbox>
      </Popover.Content>
    </Popover>
  );
}