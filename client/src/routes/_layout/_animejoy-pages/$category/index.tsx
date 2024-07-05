import { KnownCategorySchema } from "@/shared/routing/category";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_layout/_animejoy-pages/$category/")({
    component: RouteComponent,
    parseParams: z.object({ category: KnownCategorySchema }).parse,
    onError: (error) => {
        console.log({ error });
        throw notFound();
    },
});

function RouteComponent() {
    const { category } = Route.useParams();

    return (
        <div>Hello from {category}</div>
    );
}