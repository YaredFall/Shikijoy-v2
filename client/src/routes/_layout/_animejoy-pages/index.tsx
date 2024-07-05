import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/")({
    component: RouteComponent,

});

function RouteComponent() {
    console.log(Route.parentRoute.useLoaderData());

    return (
        <div>
            <div>Hello from homepage</div>
        </div>
    );
}