import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
    component: () => (
        <div className={"space-x-4"}>
            <Link to={"/"}>Home</Link>
            <Link to={"/$category/"} params={{ category: "ongoing" }}>Ongoing</Link>
            <Link to={"/$category/"} params={{ category: "full_tv" }}>Full tv</Link>
            <Outlet />
        </div>
    ),
});