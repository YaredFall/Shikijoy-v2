import { PlaylistsResponse } from "@/animejoy/entities/show/playlist/model";
import { getPlaylistsData } from "@/animejoy/entities/show/playlist/scraping";
import { routeQuery, routeUtils } from "@/animejoy/shared/api/client/utils";
import { getAnimeIdFromPathname } from "@/animejoy/shared/scraping";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { FetchOptions, ofetch } from "ofetch";

const parser = new DOMParser();

type Input = {
    id: string;
};
const queryKey = ({ id }: Input) => ["animejoy", "show-playlist", id];

const queryFn = async ({ id }: Input, fetchOptions?: FetchOptions<"json">) => {
    const response = await ofetch<PlaylistsResponse>(
        `/engine/ajax/playlists.php?news_id=${getAnimeIdFromPathname(id)}&xfield=playlist`,
        {
            baseURL: EXTERNAL_LINKS.animejoy,
            credentials: "include",
            responseType: "json",
            ...fetchOptions,
        });

    if (!response.success) {
        console.error({ response });
        console.log(response.success, typeof response.success);
        for (const key in response) {
            console.log({ key });
        }
        throw new Error("Failed to get show playlists");
    }

    return getPlaylistsData(parser.parseFromString(response.response, "text/html").body);
};

export const query = routeQuery({
    queryKey,
    queryFn,
});

export const utils = routeUtils({
    queryKey,
    queryFn,
});