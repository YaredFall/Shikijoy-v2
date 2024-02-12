import CharacterPopoverContent from "@/components/pages/show/characters/character-popover-content";
import { HoverPopover, HoverPopoverContent, HoverPopoverTrigger } from "@/components/ui/hover-popover";
import Image from "@/components/ui/image";
import TextSkeleton from "@/components/ui/text-skeleton";
import { ShikimoriAnimeRole } from "@/types/shikimori";
import { EXTERNAL_LINKS } from "@/utils/fetching";
import { useCallback, useMemo, useState } from "react";

type CharacterCardProps = {
    charData: ShikimoriAnimeRole | undefined;
};

export default function CharacterCard({ charData }: CharacterCardProps) {

    const nameSkeletonLength = useMemo(() => Array(Math.round(Math.random()) + 1).fill(1), []);
    const nameSkeletonStyle = useMemo(() => (i: number) => ({ width: (80 - i * 20) + Math.random() * 20 + "%" }), []);

    const [isOpen, setIsOpen] = useState(false);
    const onOpenChange = useCallback((open: boolean) => {
        setIsOpen(!!charData && open);
    }, [charData]);

    return (
        <HoverPopover open={isOpen} onOpenChange={onOpenChange} className={"relative"}>
            <HoverPopoverTrigger asChild>
                <article className={""}>
                    <a className={"flex flex-col gap-1"} href={charData ? EXTERNAL_LINKS.shikimori + charData.character?.url : undefined}>
                        <Image className={"aspect-shikimori-image rounded"} src={charData ? EXTERNAL_LINKS.shikimori + charData.character!.image.preview : undefined} />
                        {
                            charData
                                ? <p className={"leading-tight"}>{charData.character?.russian || charData.character?.name}</p>
                                : (
                                    <div className={"mt-0.5 flex flex-col gap-1 items-start"}>
                                        <TextSkeleton length={nameSkeletonLength} style={nameSkeletonStyle} />
                                    </div>
                                )
                        }
                    </a>
                </article>
            </HoverPopoverTrigger>
            {charData?.character
                && (
                    <HoverPopoverContent
                        className={"z-50 absolute top-0 left-full ml-2 h-80 aspect-video bg-background-secondary rounded-lg shadow-md"}
                    >
                        <CharacterPopoverContent character={charData.character} />
                    </HoverPopoverContent>
                )}
        </HoverPopover>
    );
}