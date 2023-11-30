import { useRef } from "react";
import { TbSelector } from "react-icons/tb";
import { TiEye } from "react-icons/ti";
import { cn } from "../../lib/utils";
import { useAnimejoyLegacyStorage } from "../../query-hooks/useAnimejoyLegacyStorage";
import { useAnimejoyPlaylists } from "../../query-hooks/useAnimejoyPlaylist";
import { PlaylistFile, PlaylistPlayer } from "../../types/animejoy";
import Listbox from "../ui/listbox";
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

  const { query, mutation } = useAnimejoyLegacyStorage();

  return (
    <Popover className="relative">
      <Popover.Trigger className={cn("h-8 bg-secondary text-primary w-40 py-1 rounded flex justify-between items-center pl-5 pr-2 group", isLoadingPlaylists && "animate-pulse-slow")}
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
      <Popover.Content className="z-10 absolute right-0 top-full mt-1.5 max-h-[50vh] overflow-hidden inline-flex gap-0 bg-secondary text-primary rounded">
        <Listbox className="overflow-y-auto w-40" onValueChange={onSelect} ref={listboxRef}>
          <div className="text-sm text-primary/.5 pl-3.5 pt-2">{players ? "Серия" : "Плеер"}</div>
          <Listbox.Group className="pb-1 px-0.5" aria-label="Плеер">
            {playlist?.map((file, i) => (
              <Listbox.Option key={i} value={file} className={"px-1 py-0.5 group -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default"}>
                <OptionItem label={file.label} isWatched={query.data?.includes(file)} toggleWatched={() => { mutation.mutate(file); }} />
              </Listbox.Option>
            ))}
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
    <div className={cn("pl-4 py-0.5 rounded relative group-hover:bg-primary/.0625 group-aria-selected:bg-primary/.125 truncate text-clip", className)}>
      <span>{label}</span>
      {isWatched !== undefined &&
        <TiEye className={cn("absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 p-0.5 transition-color", isWatched ? "text-primary/.5" : "text-primary/.125")} />
      }
    </div>
  );
}