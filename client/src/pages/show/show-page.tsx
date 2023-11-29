import { useLocation, useNavigate } from "react-router-dom";
import { useAnimejoyPage } from "../../query-hooks/useAnimejoyPage";
import { getFranchise, getShowTitle } from "../../scraping/animejoy/shows";
import Player from "../../components/player/player";
import LoadableText from "../../components/ui/loadablet-text";
import FranchiseBlock from "../../components/franchise-block";

type ShowPageProps = {};

export default function ShowPage({ }: ShowPageProps) {

  //3162 - studio + different players
  //2611 - single studio + episode sets
  //595 - no studios + episode sets
  //2308 - no groups
  const ids = [3162, 2611, 595, 2308, 1006];

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
    <main className="px-8 py-6">
      <div className="flex gap-4 fixed bottom-0 px-4 py-2 bg-secondary">
        {ids.map(id => (<button key={id} onClick={() => navigate(`/tv-serialy/${id}-.html`)}>{id}</button>))}
      </div>
      <header>
        <LoadableText as="h1" isLoading={isLoadingPage} placeholderLength={40} className="font-semibold text-2xl">{showTitle?.ru}</LoadableText>
        <LoadableText as="h2" isLoading={isLoadingPage} placeholderLength={30} className="font-semibold text-lg text-primary/.5">{showTitle?.romanji}</LoadableText>
      </header>
      <FranchiseBlock franchiseData={getFranchise(data?.page)} />
      <Player />

    </main>
  );
}