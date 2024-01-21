import { useNavigate } from "react-router-dom";

type DevHelperPanelProps = Record<never, never>;

// 3162 - studio + different players
// 2611 - single studio + episode sets
// 595 - no studios + episode sets
// 2308 - no groups
const ids = [3162, 2611, 595, 2308, 1006];

export default function DevHelperPanel({ }: DevHelperPanelProps) {

    const navigate = useNavigate();

    if (!import.meta.env.DEV) return null;

    return (
        <div className={"flex gap-4 fixed bottom-0 px-4 py-2 bg-secondary"}>
            {ids.map(id => (<button key={id} onClick={() => navigate(`/tv-serialy/${id}-.html`)}>{id}</button>))}
        </div>
    );
}