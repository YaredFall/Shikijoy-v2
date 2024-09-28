import { AGE_RATING_MAP, SCORE_RATES, SHOW_KIND_MAP, SHOW_STATUS_MAP, humanizeShikimoriDate } from "@/shared/api/shikimori/utils";
import { trpc } from "@/shared/api/trpc";
import { EXTERNAL_LINKS } from "@/shared/api/utils";
import { cn } from "@/shared/lib/cn";
import isNullish from "@/shared/lib/isNullish";
import Badge from "@/shared/ui/kit/badge";
import Image from "@/shared/ui/kit/image";
import ShikimoriLogo from "@/shared/ui/misc/shikimori-logo";
import { useLoaderData } from "@tanstack/react-router";
import pluralize from "plural-ru";
import { ComponentPropsWithoutRef } from "react";
import { TbStarFilled } from "react-icons/tb";

type ShikimoriInfoProps = ComponentPropsWithoutRef<"section">;

export default function ShikimoriInfo({ className, ...otherProps }: ShikimoriInfoProps) {

    const { shikimoriAnimeId } = useLoaderData({
        from: "/_with-loader/_layout/_animejoy-pages/$category/$showId/",
    });

    if (isNullish(shikimoriAnimeId)) throw new Error("`ShikimoriInfo` component requires `shikimoriAnimeId` to be defined");

    const [data] = trpc.shikimori.anime.byId.useSuspenseQuery({ id: +shikimoriAnimeId });
    return (
        <section className={cn("space-y-1", className)} {...otherProps}>
            <div className={"-mt-1 flex items-center justify-between"}>
                <header className={"text-xl"}>Shikimori</header>
                <a
                    href={EXTERNAL_LINKS.shikimori + data.url}
                    target={"_blank"}
                    className={"cursor-alias rounded-full p-1 transition-colors highlight:bg-foreground-primary/.125"}
                    rel={"noreferrer"}
                >
                    <ShikimoriLogo className={"size-5 invert"} />
                </a>
            </div>
            <div className={"flex gap-2.5"}>
                <Image className={"aspect-poster w-48 shrink-0 rounded"} src={EXTERNAL_LINKS.shikimori + data.image.original} />
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
                            <div>
                                {(data.status === "ongoing" || data.released_on
                                    ? "С "
                                    : "") + humanizeShikimoriDate(data.aired_on)}
                            </div>
                        )
                        : ""}
                    {data.released_on
                        ? (
                            <div>{`по ${humanizeShikimoriDate(data.released_on)}`}</div>
                        )
                        : ""}
                    <div className={""}>
                        {`${pluralize(data.episodes || data.episodes_aired, "", "%d эпизода по", "%d эпизодов по")} ${pluralize(data.duration, "%d минуте", "%d минуты", "%d мин.")}`}
                    </div>
                    <div className={""}>
                        <span>{data.studios.length > 1 ? "Студии: " : "Студия - "}</span>
                        {data.studios.map((s, i) =>
                            (<span key={i}>{s.name + (data.studios.at(i)?.name !== data.studios.at(-1)?.name ? ", " : "")}</span>))}
                    </div>
                    <div className={"flex flex-wrap gap-x-2 gap-y-1.5 text-sm"}>
                        {data.genres.map((g, i) => (<Badge className={"h-auto pt-px"} key={i}>{g.russian}</Badge>))}
                    </div>
                </div>
            </div>
        </section>
    );
}