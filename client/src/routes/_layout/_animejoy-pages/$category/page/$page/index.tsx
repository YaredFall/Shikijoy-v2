import { getStoryList } from "@/entities/animejoy/category/scraping";
import { useAnimejoyPage } from "@/shared/api/animejoy";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/$category/page/$page/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { category, page } = Route.useParams();
    
    const { data } = useAnimejoyPage(undefined, {
        select: data => ({
            stories: getStoryList(data.document),
        }),
    });

    return (
        <div>
            <div>Hello from {category} page {page}</div>
            <pre>
                {JSON.stringify(data?.stories, null, 2)}
            </pre>
        </div>
    );
}