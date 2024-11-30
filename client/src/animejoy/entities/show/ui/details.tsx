import { ShowInfo } from "@client/animejoy/entities/show/model";
import { useLineClamp } from "@client/shared/hooks/useLineClamp";
import { cn } from "@client/shared/lib/cn";
import isNullish from "@client/shared/lib/isNullish";
import TextSkeleton from "@client/shared/ui/kit/text-skeleton";
import { Link } from "@tanstack/react-router";
import { CSSProperties, useCallback, useMemo, useRef } from "react";

type ShowDetailsProps = {
    data: {
        info?: ShowInfo;
        description?: string | string[];
    } | undefined;
    className?: string;
};

export default function ShowDetails({ className, data }: ShowDetailsProps) {

    return (
        <>
            {
                data
                    ? (
                        <div className={cn("w-full min-w-0 leading-5 flex flex-col h-full", className)}>
                            <div>
                                {
                                    data.info?.map((e, k) => (
                                        <p key={k}>
                                            <span className={"font-medium"}>{e.label}</span>
                                            {
                                                e.value.map((v, i) =>
                                                    v.url
                                                        ? <Link key={i} to={v.url} className={"link-text"}>{v.text}</Link>
                                                        : <span key={i}>{v.text}</span>)
                                            }
                                        </p>
                                    ))
                                }
                            </div>

                            <Description data={data.description} labeled={!!data.info} />

                        </div>
                    )
                    : <InfoSkeleton />
            }
        </>
    );
}

function Description({ data, labeled = true }: { data?: string | string[]; labeled?: boolean; }) {

    const descContainerRef = useRef<HTMLDivElement>(null);

    const linesAvailable = useLineClamp(descContainerRef);

    if (isNullish(data)) return null;

    return (
        <div ref={descContainerRef} className={"h-full overflow-hidden"}>
            <div
                className={"line-clamp-[var(--max-lines)]"}
                style={{ "--max-lines": linesAvailable } as CSSProperties}
            >
                {labeled && (
                    <p>
                        <span className={"font-medium"}>Описание: </span>
                        <span>{data instanceof Array ? data[0] : data}</span>
                    </p>
                )}
                {data instanceof Array && data.slice(1).map((p, i) => <p key={i}>{p}</p>)}
            </div>
        </div>
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