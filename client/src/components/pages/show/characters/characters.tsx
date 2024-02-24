import CharactersList from "@/components/pages/show/characters/characters-list";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/components/ui/primitives/disclosure";
import { ShikimoriAnimeRole } from "@/types/shikimori";

type CharactersProps = {
    charsData: ShikimoriAnimeRole[] | undefined;
};

export default function Characters({ charsData }: CharactersProps) {
    return (
        <section className={"space-y-2"}>
            <Disclosure>
                <div className={"flex justify-between gap-2"}>
                    <header className={"text-2xl"}>Персонажи</header>
                    <DisclosureTrigger className={"text-sm text-foreground-primary/.5 highlight:text-foreground-primary/.75 transition-colors"}>
                        { isOpen => `${isOpen ? "Скрыть" : "Показать"} второстепенных`}
                    </DisclosureTrigger>
                </div>
                <div className={"space-y-4"}>
                    <CharactersList charsData={charsData} role={"Main"} />
                    <DisclosureContent>
                        <CharactersList charsData={charsData} role={"Supporting"} />
                    </DisclosureContent>
                </div>
            </Disclosure>
        </section>
    );
}