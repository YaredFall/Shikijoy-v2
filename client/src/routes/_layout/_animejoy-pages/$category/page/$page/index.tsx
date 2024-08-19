import { getShowsList } from "@/animejoy/entities/category/scraping";
import { animejoyClient } from "@/animejoy/shared/api/client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/$category/page/$page/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { category, page } = Route.useParams();
    
    const [data] = animejoyClient.page.useSuspenseQuery(undefined, {
        select: data => ({
            stories: getShowsList(data.document),
        }),
    });

    return (
        <div>
            <div>Hello from {category} page {page}</div>
            <pre>
                {JSON.stringify(data.stories, null, 2)}
            </pre>
        </div>
    );
}