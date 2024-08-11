
import CharacterPopoverCard from "@/shikimori/entities/character/ui/card";
import { SHIKIJOY_API_QUERY_OPTIONS } from "@/shared/api/shikijoy/query";
import { ShikimoriCharacterOrPerson } from "@/shared/api/shikimori/types";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import Image from "@/shared/ui/kit/image";
import ShikijoyLogoLoader from "@/shared/ui/kit/loaders/shikijoy-logo-loader";
import { ShikimoriPopover, ShikimoriPopoverContent, ShikimoriPopoverTrigger } from "@/shared/ui/kit/shikimori-popover";
import { useQuery } from "@tanstack/react-query";
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

    // const { data, isLoading } = useShikijoyApi<ShikimoriPerson>(SHIKIJOY_API_ROUTES.shikimori_person(person.id));
    const { data, isLoading } = useQuery(SHIKIJOY_API_QUERY_OPTIONS.shikimori_person(person.id));

    return (
        <div className={"flex h-full gap-3 bg-gradient-to-b from-accent-primary/5 to-transparent p-4"}>
            {
                data
                    ? (
                        <>
                            <Image className={"aspect-shikimori-image h-full w-auto rounded"} src={EXTERNAL_LINKS.shikimori + data.image.original} />
                            <div className={"flex w-full flex-col justify-between"}>
                                <header className={"text-xl"}>{person.russian ?? person.name}</header>
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
                        ? <ShikijoyLogoLoader className={"bg-inherit"} />
                        : <span>{"Произошла ошибка :("}</span>
            }
        </div>
    );
}