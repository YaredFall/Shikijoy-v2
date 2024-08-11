import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_animejoy-pages/news/$id/")({
    component: () => <div>Hello /_layout/_animejoy-pages/news/$id/!</div>,
});