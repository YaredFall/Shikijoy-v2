import Image from "@/components/ui/image";
import { getExternalLinks, getShowDescriptionFull, getShowEditDate, getShowInfo, getShowPoster, getShowStatus } from "@/entities/animejoy/show/scraping";
import ShowDetails from "@/entities/animejoy/show/ui/show-details";
import { useClientRect } from "@/hooks/useClientRect";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { useMemo, useRef } from "react";
import ShowTitle from "./show-title";

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

    const { data: doc } = useAnimejoyPage();


    const descData = useMemo(() => doc?.page && collectDescData(doc.page), [doc?.page]);

    const titleContainerRef = useRef<HTMLDivElement | null>(null);
    const showTitleRect = useClientRect(titleContainerRef);

    const externalLinks = useMemo(() => getExternalLinks(doc?.page), [doc?.page]);


    return (
        <section className={"relative isolate flex flex-col gap-2 pb-5 pt-4"}>
            {/* <img className={"absolute inset-0 -z-10 size-full opacity-40 brightness-75 blur-2xl contrast-50"} src={descData?.poster ?? ""} aria-hidden /> */}

            <ShowTitle ref={titleContainerRef} />
            <div className={"flex h-80 gap-1.5"}>
                <Image src={descData?.poster} className={"animejoy-poster h-full shrink-0 rounded"} />
                <div className={"flex w-full flex-col rounded px-2"} style={{ gap: GAP + "px" }}>
                    <ShowDetails className={""} data={descData?.details} maxInfoHeight={320} />
                </div>
                <div className={"animejoy-poster flex h-full shrink-0 flex-col gap-[inherit] direct-children:shrink-0 direct-children:rounded direct-children:bg-white/10 direct-children:p-2"}>
                    <section className={""}>
                        <header className={"font-semibold"}>Оценка</header>
                    </section>
                    <section className={""}>
                        <header className={"font-semibold"}>Франшиза</header>
                    </section>
                    {externalLinks && (
                        <section className={"flex-1"}>
                            <header className={"mb-2 font-semibold"}>На других сайтах</header>
                            <ul>
                                {
                                    Object.entries(externalLinks).map(([name, url]) => (
                                        <li><a className={"link capitalize"} href={url}>{name}</a></li>
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