import { usePlayerContext } from "@client/animejoy/entities/show/playlist/api";
import { PlaylistEpisode } from "@client/animejoy/entities/show/playlist/model";
import { useEffectOnChange } from "@client/shared/hooks/useOnChange";
import { cn } from "@client/shared/lib/cn";
import Listbox from "@client/shared/ui/primitives/listbox";
import { createRef, useCallback, useMemo, useRef } from "react";
import { TiEye } from "react-icons/ti";

type EpisodeSelectProps = {
    onSelect?: (episode: PlaylistEpisode) => void;
};

export default function EpisodeSelect({ onSelect }: EpisodeSelectProps) {

    const { currentEpisode, currentPlaylist, watchstamps } = usePlayerContext("EpisodeSelect");

    const listboxRef = useRef<HTMLDivElement>(null);
    const optionsRefs = useMemo(() => new Map(currentPlaylist?.map(ep => [ep.src as string | undefined, createRef<HTMLLIElement>()])), [currentPlaylist]);

    const onEpisodeChange = useCallback(() => {
        const elRef = optionsRefs.get(currentEpisode?.src);
        if (!elRef?.current) return;

        const { scrollLeft, scrollTop } = document.body;
        elRef.current.scrollIntoView({
            block: "nearest",
            behavior: "instant",
        });
        document.body.scroll(scrollLeft, scrollTop);
    }, [currentEpisode?.src, optionsRefs]);
    useEffectOnChange(currentEpisode, onEpisodeChange);

    return (
        <Listbox className={"h-full overflow-y-auto"} value={currentEpisode} onValueChange={onSelect} ref={listboxRef}>
            {/* <div className="text-sm text-foreground-primary/.5 pl-3.5 pt-2">{players ? "Серия" : "Плеер"}</div> */}
            <Listbox.Group className={"px-0.5 py-1"} aria-label={"Плеер"}>
                {
                    currentPlaylist?.map((episode, i) => {
                        const isWatched = watchstamps.isWatched(episode);
                        return (
                            <Listbox.Option key={i} value={episode} className={"group scroll-m-1"} ref={optionsRefs.get(episode.src)}>
                                <OptionItem
                                    label={episode.label}
                                    isWatched={isWatched}
                                    toggleIsWatched={() => isWatched ? watchstamps.remove(episode) : watchstamps.create(episode)}
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
    toggleIsWatched?: () => void;
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
                                toggleIsWatched?.();
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