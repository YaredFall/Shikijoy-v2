import CharacterPopoverCard from "@/components/pages/show/characters/character-popover-card";
import Image from "@/components/ui/image";
import LoaderLogo from "@/components/ui/loader-logo";
import { ShikimoriPopover, ShikimoriPopoverContent, ShikimoriPopoverTrigger } from "@/components/ui/shikimori-popover";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import { ShikimoriCharacterOrPerson, ShikimoriPerson } from "@/types/shikimori";
import { EXTERNAL_LINKS, SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import { useCallback, useState } from "react";


interface PersonCardProps {
    person: ShikimoriCharacterOrPerson | undefined | null;
}

export default function PersonPopoverCard({ person }: PersonCardProps) {

    const [isOpen, setIsOpen] = useState(false);

    const onOpenChange = useCallback((open: boolean) => {
        setIsOpen(!!person && open);
    }, [person]);

    return (
        <ShikimoriPopover open={isOpen} onOpenChange={onOpenChange} className={"relative"}>
            <ShikimoriPopoverTrigger asChild>
                <article className={""}>
                    <a className={"flex flex-col gap-1.5"} href={person ? EXTERNAL_LINKS.shikimori + person.url : undefined}>
                        <Image className={"aspect-shikimori-image rounded"} src={person ? EXTERNAL_LINKS.shikimori + person.image.preview : undefined} />
                    </a>
                </article>
            </ShikimoriPopoverTrigger>
            {
                person
                && (
                    <ShikimoriPopoverContent>
                        <PersonPopoverContent person={person} />
                    </ShikimoriPopoverContent>
                )
            }
        </ShikimoriPopover>
    );
}

type PersonPopoverContentProps = {
    person: ShikimoriCharacterOrPerson;
};

function PersonPopoverContent({ person }: PersonPopoverContentProps) {

    const { data, isLoading } = useShikijoyApi<ShikimoriPerson>(SHIKIJOY_API_ROUTES.shikimori_person(person.id));

    return (
        <div className={"h-full p-4 flex gap-3 bg-gradient-to-b from-accent-primary/5 to-transparent"}>
            {
                data
                    ? (
                        <>
                            <Image className={"aspect-shikimori-image h-full w-auto rounded"} src={EXTERNAL_LINKS.shikimori + data.image.original} />
                            <div className={"w-ful flex flex-col justify-between"}>
                                <header className={"text-xl"}>{person.russian || person.name}</header>
                                <ul className={"grid grid-cols-4 grid-rows-2 gap-2.5"}>
                                    {
                                        data.roles.slice(0, 8).map((role, i) => (
                                            <li key={i} className={"w-auto"}>
                                                <CharacterPopoverCard character={role.characters[0]} showName={false} />
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </>
                    )
                    : isLoading
                        ? <LoaderLogo className={"bg-inherit"} />
                        : <span>{"Произошла ошибка :("}</span>
            }
        </div>
    );
}