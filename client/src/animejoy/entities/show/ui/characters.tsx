import CharacterPopoverCard from "@client/shikimori/entities/character/ui/card";
import isNullish from "@client/shared/lib/isNullish";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@client/shared/ui/primitives/disclosure";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo } from "react";
import { trpc } from "@client/shared/api/trpc";
import type { Role } from "node-shikimori";


// type CharactersProps = {
//     charsData: ShikimoriAnimeRole[] | undefined;
// };

export default function Characters() {

    const { shikimoriAnimeId } = useLoaderData({ from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/" });

    if (isNullish(shikimoriAnimeId)) throw new Error("`Characters` component requires `shikimoriAnimeId` to be defined");
 
    
    const [data] = trpc.shikimori.anime.roles.useSuspenseQuery({ id: +shikimoriAnimeId });

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