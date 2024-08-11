import CharacterPopoverCard from "@/shikimori/entities/character/ui/card";
import { SHIKIJOY_API_QUERY_OPTIONS } from "@/shared/api/shikijoy/query";
import { ShikimoriAnimeRole, ShikimoriAnimeRoleType } from "@/shared/api/shikimori/types";
import isNullish from "@/shared/lib/isNullish";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/shared/ui/primitives/disclosure";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo } from "react";


// type CharactersProps = {
//     charsData: ShikimoriAnimeRole[] | undefined;
// };

export default function Characters() {

    const { shikimoriAnimeId } = useLoaderData({ from: "/_layout/_animejoy-pages/$category/$showId/" });

    if (isNullish(shikimoriAnimeId)) throw new Error("`Characters` component requires `shikimoriAnimeId` to be defined");
 
    const { data } = useSuspenseQuery({
        ...SHIKIJOY_API_QUERY_OPTIONS.shikimori_anime(shikimoriAnimeId),
        select: data => data.charData,
    });

    return (
        <section className={"space-y-2"}>
            <Disclosure>
                <div className={"flex justify-between gap-2"}>
                    <header className={"text-2xl"}>Персонажи</header>
                    <DisclosureTrigger className={"text-sm text-foreground-primary/.5 transition-colors highlight:text-foreground-primary/.75"}>
                        {isOpen => `${isOpen ? "Скрыть" : "Показать"} второстепенных`}
                    </DisclosureTrigger>
                </div>
                <div className={"space-y-4"}>
                    <CharactersList charsData={data} role={"Main"} />
                    <DisclosureContent>
                        <CharactersList charsData={data} role={"Supporting"} />
                    </DisclosureContent>
                </div>
            </Disclosure>
        </section>
    );
}

type CharactersListProps = {
    charsData: ShikimoriAnimeRole[];
    role?: ShikimoriAnimeRoleType;
};

function CharactersList({ charsData, role }: CharactersListProps) {

    const filteredData = useMemo(() => role ? charsData.filter(char => char.roles[0] === role) : charsData, [charsData, role]);

    return (
        <div className={"relative"}>
            <div className={"grid gap-4 grid-auto-fill-[7rem]"}>
                {
                    filteredData.map((e, i) => (
                        <CharacterPopoverCard key={String(e.character?.id) + i} character={e.character} />
                    ))
                }
            </div>
            {
                role && (
                    <div className={"absolute right-full top-0 mr-0.5 rotate-180 text-sm text-foreground-primary/.5 vertical-writing-lr"}>
                        {role === "Main" ? "Основные" : "Второстепенные"}
                    </div>
                )
            }
        </div>
    );
}