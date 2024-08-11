import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/")({
    component: RouteComponent,

});

function RouteComponent() {
    return (
        <div>
            <div>Hello from homepage</div>
        </div>
    );
}