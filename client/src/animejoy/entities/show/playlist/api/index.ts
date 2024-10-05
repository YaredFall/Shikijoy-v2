import { useLocalWathcstamps } from "@client/animejoy/entities/show/playlist/api/localStorage";
import { PlaylistEpisode } from "@client/animejoy/entities/show/playlist/model";
import { trpc } from "@client/shared/api/trpc";
import { useEffectOnChange } from "@client/shared/hooks/useOnChange";
import { useCallback, useMemo, useState } from "react";


function getLastWatchedEpisodeByIndex(watchedEpisodes: PlaylistEpisode[] | undefined): PlaylistEpisode | undefined {
    let maxIndex = -1;
    let result: PlaylistEpisode | undefined = undefined;

    watchedEpisodes?.forEach((we) => {
        if (we.index > maxIndex) {
            maxIndex = we.index;
            result = we;
        }
    });

    return result;
}

export function useWatchStamps(animejoyAnimeId: string, episodes: PlaylistEpisode[] | undefined) {


    const { data: shikimoriUser } = trpc.shikimori.users.whoami.useQuery();

    const localWatchstamps = useLocalWathcstamps(animejoyAnimeId, episodes);

    const [watchMap, setWatchMap] = useState(new Map(localWatchstamps.watchMap));

    const remoteQuery = trpc.shikijoy.watchstamps.get.useQuery({ animejoyAnimeId }, {
        enabled: !!shikimoriUser,
        refetchOnWindowFocus: query => +Date.now() - query.state.dataUpdatedAt >= 5000 ? "always" : false,
    });

    const createMutation = trpc.shikijoy.watchstamps.create.useMutation({
        mutationKey: ["watchstamps", "create"],
        onMutate: (variable) => {
            watchMap.set(variable.src, variable.createdAt);
            setWatchMap(new Map(watchMap));
            localWatchstamps.createWatchstamp(variable.src, variable.createdAt);
        },
    });
    const removeMutation = trpc.shikijoy.watchstamps.remove.useMutation({
        mutationKey: ["watchstamps", "remove"],
        onMutate: (variable) => {
            watchMap.delete(variable.src);
            setWatchMap(new Map(watchMap));
            localWatchstamps.removeWatchstamp(variable.src);
        },
    });

    const onRemoteDataChange = useCallback(() => {
        const results = new Map(watchMap);

        remoteQuery.data?.forEach((timestamp) => {
            const existentStamp = results.get(timestamp.src);
            if (!existentStamp) {
                // TODO: remote has more info
                results.set(timestamp.src, timestamp.createdAt);
                localWatchstamps.createWatchstamp(timestamp.src, timestamp.createdAt);

            } else if (existentStamp !== timestamp.createdAt) {
                // TODO: timestamps are different
                console.log("timestamps are different for ", timestamp.src);
            }

        });
        if (results.size > (remoteQuery.data?.length ?? 0)) {
            // TODO: not synced
            console.log("some watchstamps not synced with remote storage");
        }

        setWatchMap(results);
    }, [localWatchstamps, remoteQuery.data, watchMap]);
    useEffectOnChange(remoteQuery.dataUpdatedAt, onRemoteDataChange);


    const watched = useMemo(() => episodes?.filter(e => watchMap.has(e.src)), [episodes, watchMap]);
    const last = useMemo(() => getLastWatchedEpisodeByIndex(watched), [watched]);

    const isWatched = useCallback((episode: PlaylistEpisode) => {
        return watchMap.has(episode.src);
    }, [watchMap]);

    const create = useCallback((episode: PlaylistEpisode) => {
        const stamp = new Date().toISOString();

        createMutation.mutate({ animejoyAnimeId, src: episode.src, createdAt: stamp });
    }, [animejoyAnimeId, createMutation]);
    const remove = useCallback((episode: PlaylistEpisode) => {
        removeMutation.mutate({ animejoyAnimeId, src: episode.src });
    }, [animejoyAnimeId, removeMutation]);

    const isLoading = useMemo(() => remoteQuery.isLoading || !episodes, [episodes, remoteQuery.isLoading]);

    return {
        watchMap,
        isLoading,
        watched,
        last,
        isWatched,
        create,
        remove,
    };
}