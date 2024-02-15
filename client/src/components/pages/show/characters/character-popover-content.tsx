import Image from "@/components/ui/image";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import { ShikimoriCharacter, ShikimoriCharacterOrPerson } from "@/types/shikimori";
import { EXTERNAL_LINKS, SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import LoaderLogo from "@/components/ui/loader-logo";

type CharacterPopoverContentProps = {
    character: ShikimoriCharacterOrPerson;
};

export default function CharacterPopoverContent({ character }: CharacterPopoverContentProps) {

    const { data, isLoading } = useShikijoyApi<ShikimoriCharacter>(SHIKIJOY_API_ROUTES.shikimori_character(character.id));

    return (
        <div className={"h-full p-4 flex gap-3 bg-gradient-to-b from-accent-primary/5 to-transparent"}>
            {
                isLoading
                    ? <LoaderLogo className={"bg-inherit"} />
                    : (
                        <>
                            <Image className={"aspect-shikimori-image h-full w-auto rounded"} src={EXTERNAL_LINKS.shikimori + data?.image.original} />
                            <div className={"w-full"}>
                                <header className={"text-xl"}>{character.russian ?? character.name}</header>
                                <p className={"leading-tight line-clamp-[13]"}>{data?.description ?? "Нет описания"}</p>
                            </div>
                            <div className={"w-16 shrink-0 flex flex-col gap-3"}>
                                <div>
                                    <p>Аниме</p>
                                    <Image className={"w-full aspect-shikimori-image rounded"} src={EXTERNAL_LINKS.shikimori + data?.animes[0].image.preview} />
                                </div>
                                <div>
                                    <p>Сэйю</p>
                                    <Image className={"w-full aspect-shikimori-image rounded"} src={EXTERNAL_LINKS.shikimori + data?.seyu[0].image.preview} />
                                </div>
                            </div>
                        </>
                    )
            }
        </div>
    );
}