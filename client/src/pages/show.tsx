// import FranchiseBlock from "@client/components/franchise-block";
// import Main from "@client/components/layouts/blocks/main/main";
// import ShowAside from "@client/components/pages/show/aside/show-aside";
// import Characters from "@client/components/pages/show/characters/characters";
// import Description from "@client/components/pages/show/description";
// import Screenshots from "@client/components/pages/show/screenshots";
// import Container from "@client/components/ui/kit/container";
// import { getExternalLinks, getFranchise, getShikimoriID } from "@client/entities/animejoy/show/scraping";
// import { useAnimejoyPage } from "@client/query-hooks/useAnimejoyPage";
// import { useShikijoyApi } from "@client/query-hooks/useShikijoyApi";
// import { KnownShowCategory } from "@client/types/animejoy";
// import { ShikijoyAnimeData } from "@client/types/shikijoy";
// import { SHIKIJOY_API_ROUTES } from "@client/utils/fetching";
// import { useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Player from "./player/style3/player";

import Player from "@client/animejoy/entities/show/playlist/ui/player";
import Characters from "@client/animejoy/entities/show/ui/characters";
import Description from "@client/animejoy/entities/show/ui/info";
import FranchiseBlock from "@client/animejoy/entities/show/ui/franchise-block";
import Screenshots from "@client/animejoy/entities/show/ui/screenshots";
import Container from "@client/shared/ui/kit/container";
import { useLoaderData } from "@tanstack/react-router";


export default function ShowPage() {

    const { shikimoriAnimeId } = useLoaderData({ from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/" });

    return (
        <Container className={"relative isolate flex-1 bg-background-primary p-0 direct-children:px-6"}>
            <div className={"absolute inset-0 -z-10 size-full h-[720px] rounded-[inherit] bg-gradient-to-b from-accent-secondary to-transparent opacity-10 saturate-[1000%]"} aria-hidden />
            <Description />
            <FranchiseBlock />
            <Screenshots />
            <div className={"space-y-6 bg-gradient-to-b from-black/5 to-background-primary py-6"}>
                <Player />
                {shikimoriAnimeId && <Characters />}
            </div>
        </Container>
    );
}