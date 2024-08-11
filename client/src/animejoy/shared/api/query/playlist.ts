import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { UseSuspenseQueryOptions } from "@tanstack/react-query";
import { FetchOptions, ofetch } from "ofetch";
import { defaultAnimejoyQueryOptions } from "../defaults";
import anyOfSignals from "@/shared/lib/any-of-signals";
import { Playlists, PlaylistsResponse } from "@/animejoy/entities/show/playlist/model";
import { getPlaylistsData } from "@/animejoy/entities/show/playlist/scraping";
import { getAnimeIdFromPathname } from "@/animejoy/shared/scraping";

const parser = new DOMParser();

export const animejoyShowPlaylistQueryKey = (id: string) => ["animejoy", "show-playlist", id];

export type AnimejoyShowPlaylistQueryOptions<TData = Playlists> = (params: {
    id: string;
    fetchOptions?: FetchOptions<"json"> | undefined;
}) => UseSuspenseQueryOptions<Playlists, Error, TData, string[]>;

export const animejoyShowPlaylistQueryOptions: AnimejoyShowPlaylistQueryOptions = ({ id, fetchOptions }) => ({
    queryKey: animejoyShowPlaylistQueryKey(id),
    queryFn: async ({ signal }) => {

        const response = await ofetch<PlaylistsResponse>(
            `/engine/ajax/playlists.php?news_id=${getAnimeIdFromPathname(id)}&xfield=playlist`,
            {
                baseURL: EXTERNAL_LINKS.animejoy,
                credentials: "include",
                responseType: "json",
                ...fetchOptions,
                signal: anyOfSignals(signal, fetchOptions?.signal),
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
    },
    ...defaultAnimejoyQueryOptions,
});