import type { Role } from "node-shikimori";
import { useMemo } from "react";
import { trpc } from "@client/shared/api/trpc";
import isNullish from "@client/shared/lib/isNullish";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@client/shared/ui/primitives/disclosure";
import CharacterPopoverCard from "@client/shikimori/entities/character/ui/card";
import { useLoaderData } from "@tanstack/react-router";

export default function Characters() {

    const { shikimoriAnimeId } = useLoaderData({ from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/" });

    if (isNullish(shikimoriAnimeId)) throw new Error("`Characters` component requires `shikimoriAnimeId` to be defined");
 
    
    const { data } = trpc.shikimori.anime.roles.useQuery({ id: +shikimoriAnimeId });

    if (!data) return "Chokoladki";

    return (
        <section className={"space-y-2"}>
            <Disclosure>
                <div className={"flex justify-between gap-2"}>
                    <header className={"text-2xl"}>Персонажи</header>
                    <DisclosureTrigger className={"text-foreground-primary/.5 highlight:text-foreground-primary/.75 text-sm transition-colors"}>
                        {isOpen => `${isOpen ? "Скрыть" : "Показать"} второстепенных`}
                    </DisclosureTrigger>
                </div>
                <div className={"space-y-4"}>
                    <CharactersList characters={data} role={"Main"} />
                    <DisclosureContent>
                        <CharactersList characters={data} role={"Supporting"} />
                    </DisclosureContent>
                </div>
            </Disclosure>
        </section>
    );
}

type CharactersListProps = {
    characters: Role[];
    role?: Role["roles"][number];
};

function CharactersList({ characters, role }: CharactersListProps) {

    const filteredData = useMemo(() => role ? characters.filter(char => char.roles[0] === role) : characters, [characters, role]);

    return (
        <div className={"relative"}>
            <div className={"grid-auto-fill-[7rem] grid gap-4"}>
                {
                    filteredData.map((e, i) => (
                        <CharacterPopoverCard key={String(e.character?.id) + i} character={e.character} />
                    ))
                }
            </div>
            {
                role && (
                    <div className={"text-foreground-primary/.5 vertical-writing-lr absolute right-full top-0 mr-0.5 rotate-180 text-sm"}>
                        {role === "Main" ? "Основные" : "Второстепенные"}
                    </div>
                )
            }
        </div>
    );
}