import AuthCallbackPage from "@/pages/auth-callback";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
    code: z.string().min(1),
});

export const Route = createFileRoute("/shikijoy/auth-callback")({
    component: RouteComponent,
    validateSearch: searchSchema.parse,
});

function RouteComponent() {
    const { code } = Route.useSearch();
    return <AuthCallbackPage code={code} />;
}