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
        <div className={"fixed bottom-3 left-24 flex gap-4 rounded-md bg-background-secondary px-4 py-2"}>
            {ids.map(id => (<button key={id} onClick={() => navigate(`/tv-serialy/${id}-.html`)}>{id}</button>))}
        </div>
    );
}