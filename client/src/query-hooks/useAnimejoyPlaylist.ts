import ky from "ky";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getAnimeIdFromPathname } from "../scraping/animejoy/misc";
import { getPlaylistsData } from "../scraping/animejoy/playlists";
import { PlaylistsResponse } from "../types/animejoy";
import { LINKS } from "../utils";

const parser = new DOMParser();

export function useAnimejoyPlaylists(news_id?: string | number) {

  const location = useLocation();

  const id = getAnimeIdFromPathname(location.pathname);

  const pathname = `/engine/ajax/playlists.php?news_id=${news_id ?? id}&xfield=playlist`;

  return useQuery(
    ["animejoy", "page", pathname],
    async () => {
      const url = LINKS.animejoy + pathname;
      const data = await ky(url).json<PlaylistsResponse>();
      
      if (data.success) {
        return getPlaylistsData(parser.parseFromString(data.response, "text/html").body);
      } else {
        throw new Error("Animejoy playlists query error: " + data.message);
      }
    },
    {
      retry: false,
      refetchInterval: 12 * 60 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  );
}