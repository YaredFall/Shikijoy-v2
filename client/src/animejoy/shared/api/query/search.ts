import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { UseQueryOptions } from "@tanstack/react-query";
import { FetchOptions, ofetch } from "ofetch";
import { defaultAnimejoyQueryOptions } from "../defaults";
import anyOfSignals from "@/shared/lib/any-of-signals";
import { getAlertMessage } from "@/animejoy/shared/scraping";
import isNullish from "@/shared/lib/isNullish";
import { getShowsList } from "@/animejoy/entities/category/scraping";
import { ShowStory } from "@/animejoy/entities/story/model";
const parser = new DOMParser();

const formData = new FormData();
formData.append("do", "search");
formData.append("subaction", "search");
formData.append("search_start", "0");
formData.append("full_start", "0");
formData.append("result_from", "1");

export const animejoySearchQueryKey = (pathname?: string) => ["animejoy", "search", pathname ?? location.pathname];

export type AnimejoySearchQueryOptions<TData = ShowStory[] | undefined> = (params: {
    searchTerm: string;
    fetchOptions?: FetchOptions<"text"> | undefined;
}) => UseQueryOptions<ShowStory[] | undefined, Error, TData, string[]>;

export const animejoySearchQueryOptions: AnimejoySearchQueryOptions = ({ searchTerm, fetchOptions }) => ({
    queryKey: animejoySearchQueryKey(searchTerm),
    queryFn: async ({ signal }) => {
        formData.set("story", searchTerm);
        const response = await ofetch.raw("/index.php?do=search", {
            baseURL: EXTERNAL_LINKS.animejoy,
            body: formData,
            signal: anyOfSignals(signal, fetchOptions?.signal),
        });

        const doc = parser.parseFromString(response._data, "text/html");

        const alert = getAlertMessage(doc);
        if (!isNullish(alert)) throw new Error(alert);

        return getShowsList(doc);
    },
    enabled: !!searchTerm,
    ...defaultAnimejoyQueryOptions,
});