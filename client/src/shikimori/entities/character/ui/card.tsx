
import PersonPopoverCard from "@client/shikimori/entities/person/ui/card";
import { EXTERNAL_LINKS } from "@client/shared/api/utils";
import Image from "@client/shared/ui/kit/image";
import ShikijoyLogoLoader from "@client/shared/ui/kit/loaders/shikijoy-logo-loader";
import { ShikimoriPopover, ShikimoriPopoverContent, ShikimoriPopoverTrigger } from "@client/shared/ui/kit/shikimori-popover";
import TextSkeleton from "@client/shared/ui/kit/text-skeleton";
import { useCallback, useMemo, useState } from "react";
import { trpc } from "@client/shared/api/trpc";
import type { CharacterBasic } from "node-shikimori";


type CharacterCardProps = {
    character: CharacterBasic | undefined | null;
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
                    <a className={"group flex flex-col gap-1.5"} href={character ? EXTERNAL_LINKS.shikimori + character.url : undefined}>
                        <Image className={"aspect-shikimori-image size-full rounded"} src={character ? EXTERNAL_LINKS.shikimori + character.image.preview : undefined} />
                        {
                            showName
                                ? (character
                                    ? <p className={"leading-extra-tight group-hover:underline"}>{character.russian ?? character.name}</p>
                                    : (
                                        <div className={"mt-0.5 flex flex-col items-start gap-1"}>
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
    character: CharacterBasic;
};

function CharacterPopoverContent({ character }: CharacterPopoverContentProps) {

    const { data, isLoading } = trpc.shikimori.characters.byId.useQuery({ id: character.id });

    return (
        <div className={"flex h-full gap-3 bg-gradient-to-b from-accent-primary/5 to-transparent p-4"}>
            {
                data
                    ? (
                        <>
                            <Image className={"aspect-shikimori-image h-full w-auto rounded"} src={EXTERNAL_LINKS.shikimori + data.image.original} />
                            <div className={"w-full"}>
                                <header className={"text-xl"}>{character.russian ?? character.name}</header>
                                <p className={"line-clamp-[13] break-words leading-tight"}>{data.description ?? "Нет описания"}</p>
                            </div>
                            <div className={"flex w-16 shrink-0 flex-col gap-3"}>
                                {data.animes[0] && (
                                    <div>
                                        <p>Аниме</p>
                                        <a href={EXTERNAL_LINKS.shikimori + data.animes[0].url}>
                                            <Image
                                                className={"aspect-shikimori-image w-full rounded"}
                                                src={EXTERNAL_LINKS.shikimori + data.animes[0].image.preview}
                                                title={data.animes[0].russian || data.animes[0].name}
                                            />
                                        </a>
                                    </div>
                                )}
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
                        ? <ShikijoyLogoLoader className={"bg-inherit"} />
                        : <span>{"Произошла ошибка :("}</span>
            }
        </div>
    );
}