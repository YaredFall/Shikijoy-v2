import { useRef } from "react";
import { TbSelector } from "react-icons/tb";
import { TiEye } from "react-icons/ti";
import { cn } from "../../../lib/utils";
import { useAnimejoyLegacyStorage } from "../../../query-hooks/useAnimejoyLegacyStorage";
import { useAnimejoyPlaylists } from "../../../query-hooks/useAnimejoyPlaylist";
import { PlaylistFile, PlaylistPlayer } from "../../../types/animejoy";
import Listbox from "../../ui/listbox";
import Popover from "../../ui/popover";

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
    <Listbox className="overflow-y-auto h-full" value={currentFile} onValueChange={onSelect} ref={listboxRef}>
      {/* <div className="text-sm text-primary/.5 pl-3.5 pt-2">{players ? "Серия" : "Плеер"}</div> */}
      <Listbox.Group className="py-1.5 px-0.5" aria-label="Плеер">
        {playlist?.map((file, i) => (
          <Listbox.Option key={i} value={file} className={"px-1 py-0.5 group -outline-offset-4 hover:cursor-pointer aria-selected:cursor-default"}>
            <OptionItem label={file.label} isWatched={query.data?.includes(file)} />
          </Listbox.Option>
        ))}
      </Listbox.Group>
    </Listbox>
  );
}
type OptionItemProps = {
  label: string;
  className?: string;
  isWatched?: boolean;
};
function OptionItem({ label, isWatched, className }: OptionItemProps) {
  return (
    <div className={cn("pl-2.5 pr-7 pb-0.5 pt-1 rounded relative group-hover:bg-primary/.0625 group-aria-selected:bg-primary/.125 truncate text-clip", className)}>
      <span>{label}</span>
      {isWatched !== undefined &&
        <TiEye className={cn("absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 p-0.5 transition-color", isWatched ? "text-primary/.5" : "text-primary/.125")} />
      }
    </div>
  );
}