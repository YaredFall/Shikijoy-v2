import { useWatchStamps } from "@client/animejoy/entities/show/playlist/api/useWatchstamps";
import { PlaylistEpisode, PlaylistPlayer, PlaylistStudio } from "@client/animejoy/entities/show/playlist/model";
import { createContext } from "@client/shared/ui/utils/context";

export type PlayerContext = {
    studios: PlaylistStudio[] | undefined;
    players: PlaylistPlayer[] | undefined;
    episodes: PlaylistEpisode[] | undefined;
    currentPlayer: PlaylistPlayer | undefined;
    currentEpisode: PlaylistEpisode | undefined;
    currentPlaylist: PlaylistEpisode[] | undefined;
    watchstamps: ReturnType<typeof useWatchStamps>;
};

export const [usePlayerContext, PlayerContextProvider] = createContext<PlayerContext>("Player", undefined!);
export { useWatchStamps };