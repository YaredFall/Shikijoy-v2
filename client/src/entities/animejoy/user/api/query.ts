import { getAnimejoyUserFromHeader } from "@/entities/animejoy/user/scraping";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { useMemo } from "react";


export function useAnimejoyUser() {
    const pageQuery = useAnimejoyPage();
    const animejoyUser = useMemo(() => getAnimejoyUserFromHeader(pageQuery.data?.page), [pageQuery.data?.page]);

    return { ...pageQuery, data: animejoyUser };
}