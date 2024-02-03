import { defaultAnimejoyQueryOptions } from "@/query-hooks/_cfg";
import { getStoryList } from "@/scraping/animejoy/categories";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import ky from "ky";
import { useQuery } from "react-query";
const parser = new DOMParser();

const formData = new FormData();
formData.append("do", "search");
formData.append("subaction", "search");
formData.append("search_start", "0");
formData.append("full_start", "0");
formData.append("result_from", "1");

export function useAnimejoySearch(searchTerm: string | undefined) {
    return useQuery(["animejoy-search", searchTerm], () => {
        if (searchTerm && searchTerm.length >= 3) {

            formData.set("story", searchTerm);

            return ky.post(EXTERNAL_LINKS.animejoy + "/index.php?do=search", {
                body: formData,
            }).text().then((page) => {
                const doc = parser.parseFromString(page, "text/html");

                return getStoryList(doc);
            });
        } else {
            return undefined;
        }
    }, defaultAnimejoyQueryOptions);
}