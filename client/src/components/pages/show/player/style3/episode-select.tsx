import Listbox from "@/components/ui/primitives/listbox";
import { SetIsWatchedParams, useWatchedEpisodeStorage } from "@/entities/animejoy/playlist/api";
import { PlaylistEpisode, PlaylistPlayer } from "@/entities/animejoy/playlist/model";
import { useOnChange } from "@/hooks/useOnChange";
import { cn } from "@/lib/utils";
import { useAnimejoyPlaylists } from "@/query-hooks/useAnimejoyPlaylist";
import { getAnimeIdFromPathname } from "@/scraping/animejoy/misc";
import { createRef, useMemo, useRef } from "react";
import { TiEye } from "react-icons/ti";
import { useLocation } from "react-router-dom";
import { useMutationState } from "@tanstack/react-query";

type EpisodeSelectProps = {
    currentPlayer?: PlaylistPlayer;
    currentEpisode?: PlaylistEpisode;
    onSelect?: (episode: PlaylistEpisode) => void;
};

export default function EpisodeSelect({ currentPlayer, currentEpisode, onSelect }: EpisodeSelectProps) {
    const { data: playlists, isLoading: isLoadingPlaylists } = useAnimejoyPlaylists();

    const { studios, players, episodes } = playlists ?? {};

    const playlist = episodes?.filter(e => e.player === currentPlayer);

    const location = useLocation();
    const animejoyAnimeId = useMemo(() => getAnimeIdFromPathname(location.pathname), [location]);

    const listboxRef = useRef<HTMLDivElement>(null);
    const optionsRefs = useMemo(() => new Map(playlist?.map(ep => [ep.src as string | undefined, createRef<HTMLLIElement>()])), [playlist]);

    const { watchedEpisodesQuery, setIsWatchedMutation } = useWatchedEpisodeStorage(animejoyAnimeId, episodes);

    const setIsWatchedQueue = useMutationState({
        filters: {
            mutationKey: ["set-is-watched", animejoyAnimeId],
        },
        select: mutation => mutation.state.variables as SetIsWatchedParams,
    });

    useOnChange(currentEpisode, () => {
        const elRef = optionsRefs.get(currentEpisode?.src);
        elRef?.current?.scrollIntoView({
            block: "nearest",
            behavior: "instant",
        });
    });

    return (
        <Listbox className={"h-full overflow-y-auto"} value={currentEpisode} onValueChange={onSelect} ref={listboxRef}>
            {/* <div className="text-sm text-foreground-primary/.5 pl-3.5 pt-2">{players ? "Серия" : "Плеер"}</div> */}
            <Listbox.Group className={"px-0.5 py-1"} aria-label={"Плеер"}>
                {
                    playlist?.map((episode, i) => {
                        const isWatched = setIsWatchedQueue.findLast(m => m.episode.index === episode.index)?.value ?? watchedEpisodesQuery.data?.watchedIndexes?.has(episode.index);
                        return (
                            <Listbox.Option key={i} value={episode} className={"group scroll-m-1"} ref={optionsRefs.get(episode.src)}>
                                <OptionItem
                                    label={episode.label}
                                    isWatched={isWatched}
                                    toggleIsWatched={() => setIsWatchedMutation.mutate({ episode: episode, value: !isWatched })}
                                />
                            </Listbox.Option>
                        );
                    })
                }
            </Listbox.Group>
        </Listbox>
    );
}
type OptionItemProps = {
    label: string;
    className?: string;
    isWatched?: boolean;
    toggleIsWatched: () => void;
};
function OptionItem({ label, isWatched, className, toggleIsWatched }: OptionItemProps) {
    return (
        <div role={"button"} className={"w-full px-1 py-0.5 text-start -outline-offset-4 group-hover:cursor-pointer group-aria-selected:cursor-default"}>
            <div className={cn("pl-2.5 pr-7 pb-1 pt-1.5 rounded relative group-hover:bg-foreground-primary/.0625 group-aria-selected:bg-foreground-primary/.125 truncate text-clip", className)}>
                <div>{label}</div>
                {
                    isWatched !== undefined
                    && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleIsWatched();
                            }}
                            className={
                                cn(
                                    "absolute right-1.5 inset-y-1.5 aspect-square transition-color highlight:bg-background-tertiary rounded",
                                    isWatched ? "text-foreground-primary/.5" : "text-foreground-primary/.125",
                                )
                            }
                        >
                            <TiEye className={"mx-auto"} />
                        </button>
                    )
                }
            </div>
        </div>
    );
}