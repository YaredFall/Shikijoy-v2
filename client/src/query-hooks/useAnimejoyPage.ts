import ky from "ky";
import { useLayoutEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getOriginalPathname } from "@/scraping/animejoy/misc";
import { EXTERNAL_LINKS } from "@/utils/fetching";

const parser = new DOMParser();

export type PageData = { page: Document; pathname: string };

export function useAnimejoyPage(pathname?: string, onDataChange?: (data?: PageData) => void) {

    const location = useLocation();

    const dataRef = useRef<PageData>();

    const query = useQuery(
        ["animejoy", "page", pathname ?? location.pathname],
        async () => {
            const url = EXTERNAL_LINKS.animejoy + (pathname ?? location.pathname);

            const response = await ky(url);
            const html = await response.text();
            return ({
                page: parser.parseFromString(html, "text/html"),
                pathname: getOriginalPathname(response.url)
            });
        },
        {
            retry: false,
            refetchInterval: 12 * 60 * 60 * 1000,
            staleTime: 12 * 60 * 60 * 1000,
            refetchOnWindowFocus: false
        }
    );

    useLayoutEffect(() => {
        if (dataRef.current !== query.data) {
            dataRef.current = query.data;
            onDataChange && onDataChange(query.data);
        }
    }, [query.data, onDataChange]);


    return query;
}