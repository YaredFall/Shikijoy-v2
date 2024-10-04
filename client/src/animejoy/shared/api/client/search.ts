import { getShowsList } from "@client/animejoy/entities/category/scraping";
import { routeQuery, routeUtils } from "@client/animejoy/shared/api/client/utils";
import { getAlertMessage } from "@client/animejoy/shared/scraping";
import { EXTERNAL_LINKS } from "@client/shared/api/utils";
import isNullish from "@client/shared/lib/isNullish";
import { FetchOptions, ofetch } from "ofetch";

const parser = new DOMParser();

const formData = new FormData();
formData.append("do", "search");
formData.append("subaction", "search");
formData.append("search_start", "0");
formData.append("full_start", "0");
formData.append("result_from", "1");

type Input = {
    term: string;
};
const queryKey = ({ term }: Input) => ["animejoy", "search", term];

const queryFn = async ({ term }: Input, fetchOptions?: FetchOptions<"json">) => {
    formData.set("story", term);
    const response = await ofetch.raw("/index.php?do=search", {
        baseURL: EXTERNAL_LINKS.animejoy,
        body: formData,
        ...fetchOptions,
    });

    const doc = parser.parseFromString(response._data, "text/html");

    const alert = getAlertMessage(doc);
    if (!isNullish(alert)) throw new Error(alert);

    return getShowsList(doc);
};

export const query = routeQuery({
    queryKey,
    queryFn,
});

export const utils = routeUtils({
    queryKey,
    queryFn,
});