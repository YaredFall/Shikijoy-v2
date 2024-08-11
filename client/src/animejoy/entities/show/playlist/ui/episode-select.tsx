import { SetIsWatchedParams, useWatchedEpisodeStorage } from "@/animejoy/entities/show/playlist/api";
import { PlaylistEpisode, PlaylistPlayer } from "@/animejoy/entities/show/playlist/model";
import { animejoyShowPlaylistQueryOptions } from "@/animejoy/shared/api/query/playlist";
import { useEffectOnChange } from "@/shared/hooks/useOnChange";
import { cn } from "@/shared/lib/cn";
import Listbox from "@/shared/ui/primitives/listbox";
import { useMutationState, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { createRef, useMemo, useRef } from "react";
import { TiEye } from "react-icons/ti";

type EpisodeSelectProps = {
    currentPlayer?: PlaylistPlayer;
    currentEpisode?: PlaylistEpisode;
    onSelect?: (episode: PlaylistEpisode) => void;
};

export default function EpisodeSelect({ currentPlayer, currentEpisode, onSelect }: EpisodeSelectProps) {

    const { showId: animejoyAnimeId } = useParams({ from: "/_layout/_animejoy-pages/$category/$showId/" });

    const { data: { /* studios, players, */ episodes } } = useSuspenseQuery(animejoyShowPlaylistQueryOptions({
        id: animejoyAnimeId,
    }));

    const playlist = useMemo(() => episodes?.filter(e => e.player === currentPlayer), [currentPlayer, episodes]);

    const listboxRef = useRef<HTMLDivElement>(null);
    const optionsRefs = useMemo(() => new Map(playlist?.map(ep => [ep.src as string | undefined, createRef<HTMLLIElement>()])), [playlist]);

    const { watchedEpisodesQuery, setIsWatchedMutation } = useWatchedEpisodeStorage(animejoyAnimeId, episodes);

    const setIsWatchedQueue = useMutationState({
        filters: {
            mutationKey: ["set-is-watched", animejoyAnimeId],
        },
        select: mutation => mutation.state.variables as SetIsWatchedParams,
    });

    useEffectOnChange(currentEpisode, () => {
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