import { useLocation, useNavigate } from "react-router-dom";
import { useAnimejoyPage } from "../../query-hooks/useAnimejoyPage";
import Player from "../../components/player/player";

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

  return (
    <main className="px-8 py-6">
      <div className="flex gap-4 fixed bottom-0 px-4 py-2 bg-secondary">
        {ids.map(id => (<button key={id} onClick={() => navigate(`/tv-serialy/${id}-.html`)}>{id}</button>))}
      </div>
      <Player />

    </main>
  );
}