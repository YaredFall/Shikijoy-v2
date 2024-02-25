import FranchiseBlock from "@/components/franchise-block";
import Player from "./player/style3/player";
import LoadableText from "@/components/ui/loadablet-text";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { getFranchise, getShikimoriID, getShowTitle } from "@/scraping/animejoy/shows";
import { useLocation, useNavigate } from "react-router-dom";
import Main from "@/components/layouts/blocks/main/main";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import Characters from "@/components/pages/show/characters/characters";
import { ShikijoyAnimeData } from "@/types/shikijoy";
import { SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import ShowAside from "@/components/pages/show/aside/show-aside";
import { KnownShowCategory } from "@/types/animejoy";


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

    const showTitle = getShowTitle(animejoyResponse?.page);

    const shikimoriID = getShikimoriID(animejoyResponse?.page);

    const { data: shikijoyResponse, isLoading: isLoadingSJReq } = useShikijoyApi<ShikijoyAnimeData>(SHIKIJOY_API_ROUTES.shikimori_anime(shikimoriID!), {
        enabled: !!shikimoriID,
    });

    return (
        <>
            <Main>
                <div className={"space-y-4 py-8"}>
                    <header>
                        <LoadableText as={"h1"} isLoading={isLoadingAJPage} placeholderLength={40} className={"text-2xl font-medium"}>{showTitle?.ru}</LoadableText>
                        <LoadableText as={"h2"} isLoading={isLoadingAJPage} placeholderLength={30} className={"text-lg font-medium text-foreground-primary/.5"}>{showTitle?.romanji}</LoadableText>
                    </header>
                    <FranchiseBlock franchiseData={getFranchise(animejoyResponse?.page)} />
                    <Player />
                    {category.path !== "" && <Characters charsData={shikijoyResponse?.charData} />}
                </div>
            </Main>
            <ShowAside category={category} />
        </>
    );
}