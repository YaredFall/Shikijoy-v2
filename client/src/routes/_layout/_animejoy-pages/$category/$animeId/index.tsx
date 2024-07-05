import { getShowTitle } from "@/entities/animejoy/show/scraping";
import { useAnimejoyPage } from "@/shared/api/animejoy";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/$category/$animeId/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { category, animeId } = Route.useParams();
    
    const { data } = useAnimejoyPage(undefined, {
        select: data => ({
            title: getShowTitle(data.document),
        }),
    });

    return (
        <div>
            <div>Hello from {category} id {animeId}</div>
            <pre>
                {JSON.stringify(data?.title, null, 2)}
            </pre>
        </div>
    );
}