import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { PlaylistFile, PlaylistPlayer } from "@/types/animejoy";
import { useLayoutEffect, useState } from "react";
import EpisodeSelect from "./episode-select";
import PlayerIframe from "./player-iframe";
import PlayerSelect from "./player-select";

type PlayerProps = Record<never, never>;

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

    return (
        <section className={"flex flex-col gap-1.5"}>
            <div className={"flex gap-2 w-full justify-between"}>
                <EpisodeSelect currentPlayer={currentPlayer} currentFile={currentFile} onSelect={setCurrentFile} />
                <PlayerSelect currentPlayer={currentPlayer} onSelect={setCurrentPlayer} />
            </div>
            <PlayerIframe key={currentFile?.src} src={currentFile?.src} />
        </section>
    );
}