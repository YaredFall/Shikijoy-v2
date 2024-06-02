import ky from "ky";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAnimeIdFromPathname } from "@/scraping/animejoy/misc";
import { getPlaylistsData } from "@/scraping/animejoy/playlists";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import { defaultAnimejoyQueryOptions } from "@/query-hooks/_cfg";
import { Playlists, PlaylistsResponse } from "@/types/animejoy";

const parser = new DOMParser();

export function useAnimejoyPlaylists(pathname?: string) {

    const location = useLocation();

    const id = getAnimeIdFromPathname(pathname ?? location.pathname);

    const requestPathname = `/engine/ajax/playlists.php?news_id=${id}&xfield=playlist`;

    return useQuery(
        {
            queryKey: ["animejoy", "page", requestPathname],
            queryFn: async () => {
                const url = EXTERNAL_LINKS.animejoy + requestPathname;
                const data = await ky(url).json<PlaylistsResponse>();

                if (data.success) {
                    return getPlaylistsData(parser.parseFromString(data.response, "text/html").body);
                } else {
                    throw new Error("Animejoy playlists query error: " + data.message);
                }
            },
            ...defaultAnimejoyQueryOptions,
        },
    );
}