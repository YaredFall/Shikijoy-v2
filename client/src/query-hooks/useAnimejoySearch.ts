import { defaultAnimejoyQueryOptions } from "@/query-hooks/_cfg";
import { getStoryList } from "@/scraping/animejoy/categories";
import { getAlertMessage } from "@/scraping/animejoy/misc";
import { StoryData } from "@/types/animejoy";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import ky from "ky";
import { useQuery } from "@tanstack/react-query";
const parser = new DOMParser();

const formData = new FormData();
formData.append("do", "search");
formData.append("subaction", "search");
formData.append("search_start", "0");
formData.append("full_start", "0");
formData.append("result_from", "1");

export function useAnimejoySearch(searchTerm: string | undefined) {
    return useQuery<StoryData[] | undefined, Error>({
        queryKey: ["animejoy-search", searchTerm],
        queryFn: () => {
            if (searchTerm) {
                formData.set("story", searchTerm);

                return ky.post(EXTERNAL_LINKS.animejoy + "/index.php?do=search", {
                    body: formData,
                }).text().then((page) => {
                    const doc = parser.parseFromString(page, "text/html");

                    const alert = getAlertMessage(doc);
                    if (alert) throw new Error(alert);

                    return getStoryList(doc);
                });
            } else {
                return undefined;
            }
        },
        ...defaultAnimejoyQueryOptions,
        enabled: !!searchTerm && searchTerm.length >= 3,
    });
}