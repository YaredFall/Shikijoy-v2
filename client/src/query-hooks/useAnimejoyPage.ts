import ky from "ky";
import { useLayoutEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getOriginalPathname } from "@/scraping/animejoy/misc";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import { useGlobalLoading } from "@/stores/global-loading";
import { defaultAnimejoyQueryOptions } from "@/query-hooks/_cfg";

const parser = new DOMParser();

export type PageData = { page: Document; pathname: string; };

export function useAnimejoyPage(pathname?: string, onDataChange?: (data?: PageData) => void) {

    const { isLoading, decrease, increase } = useGlobalLoading(state => ({
        isLoading: state.isLoading(),
        decrease: state.decrease,
        increase: state.increase,
    }));

    const location = useLocation();

    const dataRef = useRef<PageData>();

    const firstLoadRef = useRef(true);
    useLayoutEffect(() => {
        if (isLoading) increase();

        return () => {
            decrease();
        };
    }, []);

    const query = useQuery(
        ["animejoy", "page", pathname ?? location.pathname],
        async () => {


            const url = EXTERNAL_LINKS.animejoy + (pathname ?? location.pathname);

            const response = await ky(url);
            const html = await response.text();

            return ({
                page: parser.parseFromString(html, "text/html"),
                pathname: getOriginalPathname(response.url),
            });
        },
        defaultAnimejoyQueryOptions,
    );

    useLayoutEffect(() => {
        if (dataRef.current !== query.data) {
            dataRef.current = query.data;
            onDataChange && onDataChange(query.data);

            if (firstLoadRef.current) decrease();
        }
    }, [query.data, onDataChange]);


    return query;
}