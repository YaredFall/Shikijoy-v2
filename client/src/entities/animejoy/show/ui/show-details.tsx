import TextSkeleton from "@/components/ui/text-skeleton";
import { ShowInfo } from "@/entities/animejoy/show/model";
import { cn } from "@/lib/utils";
import { CSSProperties, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type ShowDetailsProps = {
    data: {
        info: ShowInfo;
        description?: string | string[];
    } | undefined;
    maxInfoHeight?: number;
    className?: string;
};

export default function ShowDetails({ className, data, maxInfoHeight }: ShowDetailsProps) {

    const [linesAvailable, setLinesAvailable] = useState(Infinity);
    const infoRef = useRef<HTMLDivElement>(null);

    const determineAvailableLines = useCallback(() => {
        if (infoRef?.current?.clientHeight && data) {
            if (!maxInfoHeight) return;
            // * if line height is different between lines
            // const infoChildren = Array.from(infoRef.current.children);
            // const lineAvgHeight = infoChildren.reduce((acc, child) => acc + parseFloat(window.getComputedStyle(child).lineHeight), 0) / infoChildren.length;
            const lineAvgHeight = parseFloat(window.getComputedStyle(infoRef.current).lineHeight);
            setLinesAvailable(Math.round((maxInfoHeight - infoRef.current.clientHeight) / lineAvgHeight));
        }
    }, [data, maxInfoHeight]);

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
        <>
            {
                data
                    ? (
                        /* ? magic number to make div height less or equal 354px (poster height) */
                        <div className={cn("w-full min-w-0 leading-[1.229rem]", className)}>
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
                                <Description data={data.description} />
                            </div>
                        </div>
                    )
                    : <InfoSkeleton />
            }
        </>
    );
}

function Description({ data }: { data?: string | string[]; }) {
    if (!data) return null;
    return (
        <>
            <p>
                <span className={"font-medium"}>Описание: </span>
                <span>{data instanceof Array ? data[0] : data}</span>
            </p>
            {data instanceof Array && data.slice(1).map(p => <p>{p}</p>)}
        </>
    );
}

function InfoSkeleton() {
    const determineInfoSkeletonWidth = useCallback(() => ({ width: Math.random() * 60 + 30 + "%" }), []);
    const rows = useMemo(() => Array(11 + ~~(Math.random() * 10)).fill(1), []);

    return (
        <div className={"flex w-full flex-col items-start gap-1.5 py-1 text-xs"}>
            <TextSkeleton className={"h-3"} style={determineInfoSkeletonWidth} length={rows} />
        </div>
    );
}