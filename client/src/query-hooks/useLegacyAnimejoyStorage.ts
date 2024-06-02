import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAnimeIdFromPathname } from "@/scraping/animejoy/misc";
import { getStoredWatchedEpisodes, toggleStoredWatchedEpisode } from "@/scraping/animejoy/legacy-storage";
import { useAnimejoyPlaylists } from "./useAnimejoyPlaylist";
import { PlaylistFile } from "@/types/animejoy";

export function useLegacyAnimejoyStorage(pathname?: string) {

    const location = useLocation();

    const queryClient = useQueryClient();

    const { data: playlists, isLoading } = useAnimejoyPlaylists(pathname ?? location.pathname);

    const id = getAnimeIdFromPathname(pathname ?? location.pathname);

    const query = useQuery({
        queryKey: ["animejoy", "storage", pathname ?? location.pathname], 
        queryFn: () => {
            console.log("run");
    
            return getStoredWatchedEpisodes(id, playlists?.files);
        },
        enabled: !isLoading && !!playlists,
        staleTime: Infinity,
    });

    const mutation = useMutation({
        mutationFn: async ({ episode, force }: { episode: PlaylistFile; force?: boolean; }) => {
            toggleStoredWatchedEpisode(id, episode, force);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["animejoy", "storage", pathname ?? location.pathname],
            });
        },
    });

    return { query, mutation };
}