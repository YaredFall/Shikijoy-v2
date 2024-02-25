import CharacterPopoverCard from "@/components/pages/show/characters/character-popover-card";
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
            <div className={"grid gap-4 grid-auto-fill-[7rem]"}>
                {
                    (filteredData ?? Array<undefined>(4).fill(undefined)).map((e, i) => (
                        <CharacterPopoverCard key={String(e?.character?.id) + i} character={e?.character} />
                    ))
                }
            </div>
            {
                filteredData && role
                && (
                    <div className={"absolute right-full top-0 mr-0.5 rotate-180 text-sm text-foreground-primary/.5 vertical-writing-lr"}>
                        {role === "Main" ? "Основные" : "Второстепенные"}
                    </div>
                )
            }
        </div>
    );
}