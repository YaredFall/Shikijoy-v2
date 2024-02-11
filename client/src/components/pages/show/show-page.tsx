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


type ShowPageProps = Record<never, never>;

export default function ShowPage({ }: ShowPageProps) {

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

    const { data: shikijoyResponse, isLoading: isLoadingSJReq } = useShikijoyApi<ShikijoyAnimeData>(`/shikimori/animes/${shikimoriID}`, {
        enabled: !!shikimoriID,
    });

    return (
        <Main>
            <div className={"space-y-4 py-8"}>
                <header>
                    <LoadableText as={"h1"} isLoading={isLoadingAJPage} placeholderLength={40} className={"font-medium text-2xl"}>{showTitle?.ru}</LoadableText>
                    <LoadableText as={"h2"} isLoading={isLoadingAJPage} placeholderLength={30} className={"font-medium text-lg text-foreground-primary/.5"}>{showTitle?.romanji}</LoadableText>
                </header>
                <FranchiseBlock franchiseData={getFranchise(animejoyResponse?.page)} />
                <Player />
                <Characters charsData={shikijoyResponse?.charData} />
            </div>
        </Main>
    );
}