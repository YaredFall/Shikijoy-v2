import FranchiseBlock from "@/components/franchise-block";
import Main from "@/components/layouts/blocks/main/main";
import ShowAside from "@/components/pages/show/aside/show-aside";
import Characters from "@/components/pages/show/characters/characters";
import Description from "@/components/pages/show/description";
import Screenshots from "@/components/pages/show/screenshots";
import Container from "@/components/ui/kit/container";
import { getExternalLinks, getFranchise, getShikimoriID } from "@/entities/animejoy/show/scraping";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import { KnownShowCategory } from "@/types/animejoy";
import { ShikijoyAnimeData } from "@/types/shikijoy";
import { SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Player from "./player/style3/player";

type ShowPageProps = {
    category: KnownShowCategory;
};

export default function ShowPage({ category }: ShowPageProps) {

    const navigate = useNavigate();
    const location = useLocation();

    const { data: animejoyResponse, isLoading: isLoadingAJPage } = useAnimejoyPage(undefined, (data) => {
        if (data) {
            document.title = data.page.title;
            if (location.pathname !== data.pathname) {
                navigate(data.pathname, { replace: true });
            }
        }
    });


    const externalLinks = useMemo(() => getExternalLinks(animejoyResponse?.page), [animejoyResponse?.page]);
    const shikimoriID = useMemo(() => getShikimoriID(externalLinks?.["shikimori"]), [externalLinks]);

    const { data: shikijoyResponse, isLoading: isLoadingSJReq } = useShikijoyApi<ShikijoyAnimeData>(SHIKIJOY_API_ROUTES.shikimori_anime(shikimoriID!), {
        enabled: !!shikimoriID,
    });


    return (
        <>
            <Main className={""}>
                <Container className={"relative isolate overflow-hidden bg-background-primary p-0 direct-children:px-5"}>
                    <div className={"absolute inset-0 -z-10 size-full h-[720px] bg-gradient-to-b from-accent-secondary to-transparent opacity-10 saturate-[1000%]"} aria-hidden />
                    <Description />
                    <Screenshots />
                    <div className={"bg-gradient-to-b from-black/5 to-background-primary pb-5 pt-4"}>
                        <Player />
                        <FranchiseBlock franchiseData={getFranchise(animejoyResponse?.page)} />
                        {category.path !== "" && <Characters charsData={shikijoyResponse?.charData} />}
                    </div>
                </Container>
            </Main>
            <ShowAside category={category} />
        </>
    );
}