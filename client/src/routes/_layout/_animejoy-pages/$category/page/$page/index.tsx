import { getShowsList } from "@/animejoy/entities/category/scraping";
import { animejoyPageQueryOptions } from "@/animejoy/shared/api/query/page";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/$category/page/$page/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { category, page } = Route.useParams();
    
    const { data } = useSuspenseQuery({
        ...animejoyPageQueryOptions(),
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