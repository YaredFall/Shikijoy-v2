import CharacterCard from "@/components/pages/show/characters/character-card";
import { ShikimoriAnimeRole, ShikimoriAnimeRoleType } from "@/types/shikimori";
import { useMemo } from "react";

type CharactersListProps = {
    charsData: ShikimoriAnimeRole[] | undefined;
    role?: ShikimoriAnimeRoleType;
};

export default function CharactersList({ charsData, role }: CharactersListProps) {

    const filteredData = useMemo(() => role ? charsData?.filter(char => char.roles[0] === role) : charsData, [charsData, role]);

    return (
        <div className={"relative"}>
            <div className={"grid grid-auto-fill-[7rem] gap-4"}>
                {
                    (filteredData ?? Array<undefined>(4).fill(undefined)).map((e, i) => (
                        <CharacterCard key={String(e?.character?.id) + i} charData={e} />
                    ))
                }
            </div>
            {
                filteredData && role
                && (
                    <div className={"absolute right-full top-0 vertical-writing-lr rotate-180 text-foreground-primary/.5 text-sm mr-0.5"}>
                        {role === "Main" ? "Основные" : "Второстепенные"}
                    </div>
                )
            }
        </div>
    );
}