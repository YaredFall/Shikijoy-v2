import { query as pageQuery, utils as pageUtils } from "@/animejoy/shared/api/client/page";
import { query as playlistQuery, utils as playlistUtils } from "@/animejoy/shared/api/client/playlist";
import { query as searchQuery, utils as searchUtils } from "@/animejoy/shared/api/client/search";
import { useQueryClient } from "@tanstack/react-query";

export const animejoyClient = {
    page: pageQuery,
    show: {
        playlist: playlistQuery,
    },
    search: searchQuery,
};

export const useAnimejoyClientUtils = () => {
    const qc = useQueryClient();
    return {
        invalidate: () => qc.invalidateQueries(),
        page: pageUtils(qc),
        show: {
            playlist: playlistUtils(qc),
        },
        search: searchUtils(qc),
    };
};