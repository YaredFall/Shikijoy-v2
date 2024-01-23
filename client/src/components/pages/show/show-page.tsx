import FranchiseBlock from "@/components/franchise-block";
import Player from "./player/style2/player";
import LoadableText from "@/components/ui/loadablet-text";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { getFranchise, getShowTitle } from "@/scraping/animejoy/shows";
import { useLocation, useNavigate } from "react-router-dom";
import Main from "@/components/layouts/blocks/main/main";


type ShowPageProps = Record<never, never>;

export default function ShowPage({ }: ShowPageProps) {

    const navigate = useNavigate();
    const location = useLocation();

    const { data, isLoading: isLoadingPage } = useAnimejoyPage(undefined, (data) => {
        if (data) {
            document.title = data.page.title;
            if (location.pathname !== data.pathname) {
                navigate(data.pathname, { replace: true });
            }
        }
    });

    const showTitle = getShowTitle(data?.page);

    return (
        <Main>
            <div className={"space-y-4 py-8"}>
                <header>
                    <LoadableText as={"h1"} isLoading={isLoadingPage} placeholderLength={40} className={"font-medium text-2xl"}>{showTitle?.ru}</LoadableText>
                    <LoadableText as={"h2"} isLoading={isLoadingPage} placeholderLength={30} className={"font-medium text-lg text-primary/.5"}>{showTitle?.romanji}</LoadableText>
                </header>
                <FranchiseBlock franchiseData={getFranchise(data?.page)} />
                <Player />
            </div>
        </Main>
    );
}