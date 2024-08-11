import { ShikimoriAnimeCoreData, ShikimoriAnimeRole } from "@/shared/api/shikimori/types";

export type ShikijoyAnimeData = {
    coreData: ShikimoriAnimeCoreData;
    charData: Array<ShikimoriAnimeRole>;
};