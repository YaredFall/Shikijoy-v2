import { IoMdArrowDropright } from "react-icons/io";
import { MdOutlineModeComment } from "react-icons/md";
import TextSkeleton from "@/components/ui/text-skeleton";
import { StoryData } from "@/types/animejoy";
import { useState, useRef, useLayoutEffect, CSSProperties, useCallback, Fragment, useMemo } from "react";
import { Link } from "@/components/utility/Link";
import DotSplitter from "@/components/ui/dot-splitter";
import Image from "@/components/ui/image";

type StoryCardProps = {
    data: StoryData | undefined;
};

export default function StoryCard({ data }: StoryCardProps) {

    const [linesAvailable, setLinesAvailable] = useState(0);
    const infoRef = useRef<HTMLDivElement>(null);

    const determineAvailableLines = useCallback(() => {
        if (infoRef?.current?.clientHeight && data) {
            const lineAvgHeight = infoRef.current.clientHeight / data.info.length;
            const linesUsed = ~~(infoRef.current.clientHeight / lineAvgHeight);
            setLinesAvailable(~~(354 / lineAvgHeight + 0.3) - linesUsed);
        }
    }, [data]);

    useLayoutEffect(() => {
        window.addEventListener("resize", determineAvailableLines);
        return () => {
            window.removeEventListener("resize", determineAvailableLines);
        };
    }, [determineAvailableLines]);

    useLayoutEffect(() => {
        determineAvailableLines();
    }, [determineAvailableLines, data]);

    return (
        <article className={"flex flex-col gap-3"}>
            <header className={"font-medium"}>
                <h2 className={"text-2xl"}>
                    {
                        data?.title.ru
                            ? <Link to={data.url}>{data.title.ru}</Link>
                            : <TextSkeleton className={"h-7"} length={30} />
                    }
                </h2>
                <p className={"text-lg text-foreground-primary/.75"}>{data?.title.romanji ?? <TextSkeleton className={"h-7"} length={30} />}</p>
            </header>
            <div className={"flex gap-2"}>
                <Link to={data?.url || ""} className={"shrink-0"}>
                    {/* <Picture className={"styles.poster"} src={data?.poster} /> */}
                    <Image className={"animejoy-poster rounded"} src={data?.poster} />
                </Link>
                {
                    data
                        ? (
                            <div className={"leading-5 min-w-0 w-full"}>
                                <div ref={infoRef}>
                                    {
                                        data.info.map((e, k) => (
                                            <p key={k}>
                                                <span className={"font-medium"}>{e.label}</span>
                                                {
                                                    e.value.map((v, i) =>
                                                        v.url
                                                            ? <Link key={i} to={v.url} children={v.text} className={"link-text"} />
                                                            : <span key={i} children={v.text} />)
                                                }
                                            </p>
                                        ))
                                    }
                                </div>
                                <div className={"line-clamp-[var(--max-lines)]"} style={{ "--max-lines": linesAvailable } as CSSProperties}>
                                    <span className={"font-medium"}>Описание: </span>
                                    <span>{data.description}</span>
                                </div>
                            </div>
                        )
                        : <InfoSkeleton />
                }
            </div>
            {
                (!data || !!data.editDate)
                && <div className={"text-foreground-primary/.5 text-sm"}>{data?.editDate ?? <TextSkeleton className={"block h-3 my-1.5 w-3/4"} length={1} />}</div>
            }
            <div className={"flex justify-between"}>
                <div className={"flex items-center gap-0.5"}>
                    {
                        data
                            ? (
                                <>
                                    <IoMdArrowDropright className={"text-foreground-primary/.75"} />
                                    {
                                        data.categories.map((c, i) => (
                                            <Fragment key={i}>
                                                {!!i && <DotSplitter />}
                                                <Link absolute to={c.path} className={"link-text"} children={c.name} />
                                            </Fragment>
                                        ))
                                    }
                                </>
                            )
                            : <TextSkeleton className={"my-1 h-4"} length={20} />
                    }
                </div>
                <div className={"flex items-center gap-0.5"} title={"Комментарии"}>
                    {
                        data?.comments?.toString()
                            ? (
                                <>
                                    <MdOutlineModeComment />
                                    <span children={data.comments} />
                                </>
                            )
                            : <TextSkeleton className={"my-1 h-4"} length={4} />
                    }
                </div>
            </div>
        </article>
    );
}

function InfoSkeleton() {
    const determineInfoSkeletonWidth = useCallback(() => ({ width: Math.random() * 60 + 30 + "%" }), []);
    const rows = useMemo(() => Array(11 + ~~(Math.random() * 10)).fill(1), []);

    return (
        <div className={"flex flex-col items-start text-xs gap-1.5 w-full py-1"}>
            <TextSkeleton className={"h-3"} style={determineInfoSkeletonWidth} length={rows} />
        </div>
    );
}