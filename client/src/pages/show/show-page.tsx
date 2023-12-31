import { useLocation, useNavigate } from "react-router-dom";
import FranchiseBlock from "../../components/franchise-block";
import Player from "../../components/player/style2/player";
import LoadableText from "../../components/ui/loadablet-text";
import { useAnimejoyPage } from "../../query-hooks/useAnimejoyPage";
import { getFranchise, getShowTitle } from "../../scraping/animejoy/shows";

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
    <main className="px-8 py-6 max-w-7xl flex flex-col gap-4">
      <div className="flex gap-4 fixed bottom-0 px-4 py-2 bg-secondary">
        {ids.map(id => (<button key={id} onClick={() => navigate(`/tv-serialy/${id}-.html`)}>{id}</button>))}
      </div>
      <header>
        <LoadableText as="h1" isLoading={isLoadingPage} placeholderLength={40} className="font-medium text-2xl">{showTitle?.ru}</LoadableText>
        <LoadableText as="h2" isLoading={isLoadingPage} placeholderLength={30} className="font-medium text-lg text-primary/.5">{showTitle?.romanji}</LoadableText>
      </header>
      <FranchiseBlock franchiseData={getFranchise(data?.page)} />
      <Player />
    </main>
  );
}