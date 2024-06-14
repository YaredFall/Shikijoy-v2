import ShikimoriLogo from "@/components/misc/shikimori-logo";
import Badge from "@/components/pages/show/aside/badge";
import Image from "@/components/ui/image";
import TextSkeleton from "@/components/ui/text-skeleton";
import { getExternalLinks, getShikimoriID } from "@/entities/animejoy/show/scraping";
import { cn } from "@/lib/utils";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import { AGE_RATING_MAP, SCORE_RATES, SHOW_KIND_MAP, SHOW_STATUS_MAP } from "@/scraping/shikimori/animes";
import { humanizeShikimoriDate } from "@/scraping/shikimori/misc";
import { ShikijoyAnimeData } from "@/types/shikijoy";
import { EXTERNAL_LINKS, SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import pluralize from "plural-ru";
import { ComponentPropsWithoutRef, useMemo } from "react";
import { TbStarFilled } from "react-icons/tb";

type ShikimoriInfoProps = ComponentPropsWithoutRef<"section">;

export default function ShikimoriInfo({ className, ...otherProps }: ShikimoriInfoProps) {

    const { data: animejoyResponse, isLoading: isLoadingAJPage } = useAnimejoyPage();

    
    const externalLinks = useMemo(() => getExternalLinks(animejoyResponse?.page), [animejoyResponse?.page]);
    const shikimoriID = useMemo(() => getShikimoriID(externalLinks?.["shikimori"]), [externalLinks]);


    const { data: shikijoyResponse, isLoading: isLoadingSJReq } = useShikijoyApi<ShikijoyAnimeData>(SHIKIJOY_API_ROUTES.shikimori_anime(shikimoriID!), {
        enabled: !!shikimoriID,
    });

    const data = useMemo(() => shikijoyResponse?.coreData, [shikijoyResponse?.coreData]);

    const skeletonLength = useMemo(() => new Array(~~(Math.random() * 5) + 9).fill(1), []);


    if (!shikimoriID) return null;

    return (
        <section className={cn("space-y-1", className)} {...otherProps}>
            <div className={"-mt-1 flex items-center justify-between"}>
                <header className={"text-xl"}>Shikimori</header>
                <a
                    href={data ? EXTERNAL_LINKS.shikimori + data.url : undefined}
                    target={"_blank"}
                    className={"cursor-alias rounded-full p-1 transition-colors highlight:bg-foreground-primary/.125"}
                >
                    <ShikimoriLogo className={"size-5 invert"} />
                </a>
            </div>
            <div className={"flex gap-2.5"}>
                <Image className={"aspect-poster w-48 shrink-0 rounded"} src={data ? EXTERNAL_LINKS.shikimori + data.image.original : undefined} />
                {
                    data
                        ? (
                            <div className={"flex flex-col gap-1 leading-none"}>
                                <div className={"mb-0.5 flex items-center gap-2"}>
                                    <Badge>
                                        <TbStarFilled className={"pt-px"} />
                                        <span className={"pt-0.5"}>{data.score ?? "?"}</span>
                                    </Badge>
                                    <span className={"mt-1 text-sm leading-none"}>{SCORE_RATES[parseInt(data.score) - 1]}</span>
                                </div>
                                <div className={"flex flex-wrap gap-x-2 gap-y-1.5 text-sm"}>
                                    <Badge className={"bg-sky-200 pt-0.5"}>{SHOW_KIND_MAP.get(data.kind)}</Badge>
                                    <Badge className={"bg-amber-100 pt-0.5"} title={AGE_RATING_MAP.get(data.rating)!.explained}>
                                        {AGE_RATING_MAP.get(data.rating)!.short}
                                    </Badge>
                                    <Badge className={"bg-emerald-200"}>{SHOW_STATUS_MAP.get(data.status)}</Badge>
                                </div>
                                {data.aired_on
                                    ? (
                                        <div children={(data.status === "ongoing" || data.released_on
                                            ? "С "
                                            : "") + humanizeShikimoriDate(data.aired_on)}
                                        />
                                    )
                                    : ""}
                                {data.released_on
                                    ? (
                                        <div children={`по ${humanizeShikimoriDate(data.released_on)}`} />
                                    )
                                    : ""}
                                <div className={""}>
                                    {`${pluralize(data.episodes || data.episodes_aired, "", "%d эпизода по", "%d эпизодов по")} ${pluralize(data.duration, "%d минуте", "%d минуты", "%d мин.")}`}
                                </div>
                                <div className={""}>
                                    <span>{data.studios.length > 1 ? "Студии: " : "Студия - "}</span>
                                    {data.studios.map((s, i) =>
                                        (<span key={i} children={s.name + (data.studios.at(i)?.name !== data.studios.at(-1)?.name ? ", " : "")} />))}
                                </div>
                                <div className={"flex flex-wrap gap-x-2 gap-y-1.5 text-sm"}>
                                    {data.genres.map((g, i) => (<Badge className={"h-auto pt-px"} children={`${g.russian}`} key={i} />))}
                                </div>
                            </div>
                        )
                        : <div className={"flex w-full flex-col gap-1.5"}><TextSkeleton length={skeletonLength} /></div>
                }
            </div>
        </section>
    );
}