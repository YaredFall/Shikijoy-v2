import { useLayoutEffect, useRef, useState } from "react";
import { useAnimejoyPlaylists } from "../../../query-hooks/useAnimejoyPlaylist";
import { PlaylistFile, PlaylistPlayer } from "../../../types/animejoy";
import EpisodeSelect from "./episode-select";
import PlayerIframe from "./player-iframe";
import PlayerSelect from "./player-select";
import { useAnimejoyLegacyStorage } from "../../../query-hooks/useAnimejoyLegacyStorage";

type PlayerProps = {

};

export default function Player({ }: PlayerProps) {

  const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

  const { studios, players, files } = playlists ?? {};

  const [currentPlayer, setCurrentPlayer] = useState<PlaylistPlayer | undefined>();
  const [currentFile, setCurrentFile] = useState<PlaylistFile | undefined>();

  useLayoutEffect(() => {
    setCurrentPlayer(players?.[0]);
  }, [players]);

  useLayoutEffect(() => {
    setCurrentFile(files?.find(f => f.player === currentPlayer));
  }, [files, currentPlayer]);

  const portalContainerRef = useRef<HTMLDivElement>(null);

  const { query, mutation } = useAnimejoyLegacyStorage();

  return (
    <section className="flex flex-col gap-1.5 font-light">
      <div className="flex gap-2 w-full justify-between items-end">
        <div className="flex gap-3 items-baseline pb-1">
          <header className="text-xl leading-none">{currentFile?.label}</header>
          {currentFile && query.data?.includes(currentFile) && <span className="text-xs text-primary/.5 leading-none">Посмотрено</span>}
        </div>
        <PlayerSelect currentPlayer={currentPlayer} onSelect={setCurrentPlayer} portalContainerRef={portalContainerRef} />
      </div>
      <div className="flex h-min relative pr-48">
        <PlayerIframe key={currentFile?.src} src={currentFile?.src} />
        <div className="absolute right-0 w-48 h-full pl-1.5">
          <div className="rounded overflow-hidden h-full border-2 border-primary/.0625 relative" ref={portalContainerRef}>
            <EpisodeSelect currentPlayer={currentPlayer} currentFile={currentFile} onSelect={setCurrentFile} />
          </div>
        </div>
      </div>
    </section>
  );
}