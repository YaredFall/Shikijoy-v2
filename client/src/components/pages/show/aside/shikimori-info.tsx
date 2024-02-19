import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { useShikijoyApi } from "@/query-hooks/useShikijoyApi";
import { getShikimoriID } from "@/scraping/animejoy/shows";
import { ShikijoyAnimeData } from "@/types/shikijoy";
import { EXTERNAL_LINKS, SHIKIJOY_API_ROUTES } from "@/utils/fetching";
import shikimoriLogo from "/images/shikimori_logo.png";
import Image from "@/components/ui/image";
import { useMemo } from "react";
import { humanizeShikimoriDate } from "@/scraping/shikimori/misc";
import pluralize from "plural-ru";
import Badge from "@/components/pages/show/aside/badge";
import { TbStarFilled } from "react-icons/tb";
import { AGE_RATING_MAP, SCORE_RATES, SHOW_KIND_MAP, SHOW_STATUS_MAP } from "@/scraping/shikimori/animes";
import TextSkeleton from "@/components/ui/text-skeleton";
import ShikimoriLogo from "@/components/misc/shikimori-logo";

type ShikimoriInfoProps = Record<never, never>;

export default function ShikimoriInfo({ }: ShikimoriInfoProps) {

    const { data: animejoyResponse, isLoading: isLoadingAJPage } = useAnimejoyPage();

    const shikimoriID = getShikimoriID(animejoyResponse?.page);

    const { data: shikijoyResponse, isLoading: isLoadingSJReq } = useShikijoyApi<ShikijoyAnimeData>(SHIKIJOY_API_ROUTES.shikimori_anime(shikimoriID!), {
        enabled: !!shikimoriID,
    });

    const data = useMemo(() => shikijoyResponse?.coreData, [shikijoyResponse?.coreData]);

    const skeletonLength = useMemo(() => new Array(~~(Math.random() * 5) + 9).fill(1), []);


    if (!shikimoriID) return null;

    return (
        <section>
            <div className={"flex justify-between items-center"}>
                <header className={"text-lg"}>Инфо</header>
                <a
                    href={data ? EXTERNAL_LINKS.shikimori + data.url : undefined}
                    target={"_blank"}
                    className={"rounded-full p-1 highlight:bg-foreground-primary/.125 transition-colors cursor-alias"}
                >
                    <ShikimoriLogo className={"size-5 invert"} />
                </a>
            </div>
            <div className={"flex gap-2.5"}>
                <Image className={"aspect-poster rounded w-48 shrink-0"} src={data ? EXTERNAL_LINKS.shikimori + data.image.original : undefined} />
                {
                    data
                        ? (
                            <div className={"flex flex-col gap-1 leading-none"}>
                                <div className={"flex gap-2 items-center mb-0.5"}>
                                    <Badge>
                                        <TbStarFilled className={"pt-px"} />
                                        <span className={"pt-0.5"}>{data.score ?? "?"}</span>
                                    </Badge>
                                    <span className={"leading-none mt-1 text-sm"}>{SCORE_RATES[parseInt(data.score) - 1]}</span>
                                </div>
                                <div className={"flex gap-x-2 gap-y-1.5 flex-wrap text-sm"}>
                                    <Badge className={"pt-0.5 bg-sky-200"}>{SHOW_KIND_MAP.get(data.kind)}</Badge>
                                    <Badge className={"pt-0.5 bg-amber-100"} title={AGE_RATING_MAP.get(data.rating)!.explained}>
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
                                <div className={"flex gap-x-2 gap-y-1.5 flex-wrap text-sm"}>
                                    {data.genres.map((g, i) => (<Badge className={"pt-px h-auto"} children={`${g.russian}`} key={i} />))}
                                </div>
                            </div>
                        )
                        : <div className={"flex flex-col gap-1.5 w-full"}><TextSkeleton length={skeletonLength} /></div>
                }
            </div>
        </section>
    );
}