// import FranchiseBlock from "@/components/franchise-block";
// import Main from "@/components/layouts/blocks/main/main";
// import ShowAside from "@/components/pages/show/aside/show-aside";
// import Characters from "@/components/pages/show/characters/characters";
// import Description from "@/components/pages/show/description";
// import Screenshots from "@/components/pages/show/screenshots";
// import Container from "@/components/ui/kit/container";
// import { getExternalLinks, getFranchise, getShikimoriID } from "@/entities/animejoy/show/scraping";
// import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
// import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
// import { KnownShowCategory } from "@/types/animejoy";
// import { ShikijoyAnimeData } from "@/types/shikijoy";
// import { SHIKIJOY_API_ROUTES } from "@/utils/fetching";
// import { useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Player from "./player/style3/player";

import Player from "@/animejoy/entities/show/playlist/ui/player";
import Characters from "@/animejoy/entities/show/ui/characters";
import Description from "@/animejoy/entities/show/ui/info";
import FranchiseBlock from "@/animejoy/entities/show/ui/franchise-block";
import Screenshots from "@/animejoy/entities/show/ui/screenshots";
import Container from "@/shared/ui/kit/container";
import { useLoaderData } from "@tanstack/react-router";


export default function ShowPage() {

    const { shikimoriAnimeId } = useLoaderData({ from: "/_layout/_animejoy-pages/$category/$showId/" });

    return (
        <Container className={"relative isolate flex-1 bg-background-primary p-0 direct-children:px-5"}>
            <div className={"absolute inset-0 -z-10 size-full h-[720px] rounded-[inherit] bg-gradient-to-b from-accent-secondary to-transparent opacity-10 saturate-[1000%]"} aria-hidden />
            <Description />
            <FranchiseBlock />
            <Screenshots />
            <div className={"bg-gradient-to-b from-black/5 to-background-primary pb-5 pt-4"}>
                {/* <Player /> */}
                {shikimoriAnimeId && <Characters />}
            </div>
        </Container>
    );
}