import { getExternalLinks, getShowDescriptionFull, getShowEditDate, getShowInfo, getShowPoster, getShowStatus } from "@/animejoy/entities/show/scraping";
import ShowDetails from "./details";
import ShowTitle from "./title";
import Image from "@/shared/ui/kit/image";
import { useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { animejoyPageQueryOptions } from "@/animejoy/shared/api";
type DescriptionProps = Record<never, never>;

function collectDescData(page: Document) {
    return {
        poster: getShowPoster(page),
        details: {
            info: getShowInfo(page),
            description: getShowDescriptionFull(page),
        },
        editDate: getShowEditDate(page),
        status: getShowStatus(page),
    };
}

const GAP = 8;

export default function Description({ }: DescriptionProps) {


    const { data } = useSuspenseQuery({
        ...animejoyPageQueryOptions(),
        select: data => ({
            description: collectDescData(data.document),
            externalLinks: getExternalLinks(data.document),
        }),
    });

    const titleContainerRef = useRef<HTMLDivElement | null>(null);

    return (
        <section className={"relative isolate flex flex-col gap-2 pb-5 pt-4"}>
            {/* <img className={"absolute inset-0 -z-10 size-full opacity-40 brightness-75 blur-2xl contrast-50"} src={descData?.poster ?? ""} aria-hidden /> */}

            <ShowTitle ref={titleContainerRef} />
            <div className={"flex h-80 gap-1.5"}>
                <Image src={data.description.poster} className={"animejoy-poster h-full shrink-0 rounded"} />
                <div className={"flex w-full flex-col rounded px-2"} style={{ gap: GAP + "px" }}>
                    <ShowDetails className={""} data={data.description.details} maxInfoHeight={320} />
                </div>
                <div className={"flex h-full shrink-0 flex-col gap-[inherit] direct-children:shrink-0 direct-children:rounded direct-children:bg-white/10 direct-children:px-3 direct-children:py-2"}>
                    <section className={""}>
                        <header className={"font-semibold"}>Оценка</header>
                    </section>
                    {data.externalLinks && (
                        <section className={"flex-1"}>
                            <header className={"mb-2 font-semibold"}>На других сайтах</header>
                            <ul>
                                {
                                    Object.entries(data.externalLinks).map(([name, url], i) => (
                                        <li key={i}><a className={"link capitalize"} href={url}>{name}</a></li>
                                    ))
                                }
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </section>
    );
}