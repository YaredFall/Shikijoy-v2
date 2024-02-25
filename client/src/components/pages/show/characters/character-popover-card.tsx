import PersonPopoverCard from "@/components/pages/show/characters/person-popover-card";
import Image from "@/components/ui/image";
import LoaderLogo from "@/components/ui/loader-logo";
import { ShikimoriPopover, ShikimoriPopoverContent, ShikimoriPopoverTrigger } from "@/components/ui/shikimori-popover";
import TextSkeleton from "@/components/ui/text-skeleton";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import { ShikimoriCharacter, ShikimoriCharacterOrPerson } from "@/types/shikimori";
import { EXTERNAL_LINKS, SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import { useCallback, useMemo, useState } from "react";


type CharacterCardProps = {
    character: ShikimoriCharacterOrPerson | undefined | null;
    showName?: boolean;
};

export default function CharacterPopoverCard({ character, showName = true }: CharacterCardProps) {

    const nameSkeletonLength = useMemo(() => Array(Math.round(Math.random()) + 1).fill(1), []);
    const nameSkeletonStyle = useMemo(() => (i: number) => ({ width: (80 - i * 20) + Math.random() * 20 + "%" }), []);

    const [isOpen, setIsOpen] = useState(false);

    const onOpenChange = useCallback((open: boolean) => {
        setIsOpen(!!character && open);
    }, [character]);

    return (
        <ShikimoriPopover open={isOpen} onOpenChange={onOpenChange} className={"relative"}>
            <ShikimoriPopoverTrigger asChild>
                <article className={""}>
                    <a className={"flex flex-col gap-1.5 group"} href={character ? EXTERNAL_LINKS.shikimori + character.url : undefined}>
                        <Image className={"aspect-shikimori-image rounded"} src={character ? EXTERNAL_LINKS.shikimori + character.image.preview : undefined} />
                        {
                            showName
                                ? (character
                                    ? <p className={"leading-extra-tight group-hover:underline"}>{character.russian || character.name}</p>
                                    : (
                                        <div className={"mt-0.5 flex flex-col gap-1 items-start"}>
                                            <TextSkeleton className={""} length={nameSkeletonLength} style={nameSkeletonStyle} />
                                        </div>
                                    ))
                                : null
                        }
                    </a>
                </article>
            </ShikimoriPopoverTrigger>
            {
                character
                && (
                    <ShikimoriPopoverContent>
                        <CharacterPopoverContent character={character} />
                    </ShikimoriPopoverContent>
                )
            }
        </ShikimoriPopover>
    );
}

type CharacterPopoverContentProps = {
    character: ShikimoriCharacterOrPerson;
};

function CharacterPopoverContent({ character }: CharacterPopoverContentProps) {

    const { data, isLoading } = useShikijoyApi<ShikimoriCharacter>(SHIKIJOY_API_ROUTES.shikimori_character(character.id));

    return (
        <div className={"h-full p-4 flex gap-3 bg-gradient-to-b from-accent-primary/5 to-transparent"}>
            {
                data
                    ? (
                        <>
                            <Image className={"aspect-shikimori-image h-full w-auto rounded"} src={EXTERNAL_LINKS.shikimori + data.image.original} />
                            <div className={"w-full"}>
                                <header className={"text-xl"}>{character.russian ?? character.name}</header>
                                <p className={"leading-tight line-clamp-[13] break-words"}>{data.description ?? "Нет описания"}</p>
                            </div>
                            <div className={"w-16 shrink-0 flex flex-col gap-3"}>
                                <div>
                                    <p>Аниме</p>
                                    <a href={EXTERNAL_LINKS.shikimori + data.animes[0].url}>
                                        <Image
                                            className={"w-full aspect-shikimori-image rounded"}
                                            src={EXTERNAL_LINKS.shikimori + data.animes[0].image.preview}
                                            title={data.animes[0].russian || data.animes[0].name}
                                        />
                                    </a>
                                </div>
                                {
                                    data.seyu[0]
                                    && (
                                        <div>
                                            <p>Сэйю</p>
                                            {/* <Image className={"w-full aspect-shikimori-image rounded"} src={EXTERNAL_LINKS.shikimori + data.seyu[0]?.image.preview} /> */}
                                            <PersonPopoverCard person={data.seyu[0]} />
                                        </div>
                                    )
                                }
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