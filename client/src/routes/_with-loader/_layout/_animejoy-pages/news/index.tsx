import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_with-loader/_layout/_animejoy-pages/news/",
)({
    component: () => <div>Hello /_layout/_animejoy-pages/news/!</div>,
});