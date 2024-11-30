import ShowDetails from "@client/animejoy/entities/show/ui/details";
import { NewsStory, ShowStory } from "@client/animejoy/entities/story/model";
import { cn } from "@client/shared/lib/cn";
import Image from "@client/shared/ui/kit/image";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { MdOutlineModeComment } from "react-icons/md";
import { RxDotFilled, RxTriangleRight } from "react-icons/rx";

type ShowCardProps = {
    data: ShowStory & NewsStory;
};

export default function ShowCard({ data }: ShowCardProps) {
    return (
        <article className={"flex flex-col gap-3"}>
            <header className={"font-medium"}>
                <h2 className={"text-2xl"}>
                    <Link to={data.url}>{data.title.ru}</Link>
                </h2>
                <p className={"text-lg text-foreground-primary/.75"}>{data.title.romanji}</p>
            </header>
            {/* ? 354px is the poster height (reference *animejoy-poster* class) */}
            <div className={cn("flex gap-2", data.poster && "h-[354px]")}>
                {data.poster && (
                    <Link to={data.url || ""} className={"shrink-0"}>
                        <Image className={"animejoy-poster rounded"} src={data.poster} />
                    </Link>
                )}
                {/* ? magic number to correlate to poster height */}
                <ShowDetails data={data} className={"leading-[1.23rem]"} />
            </div>

            {!!data.editDate && <div className={"text-sm text-foreground-primary/.5"}>{data.editDate}</div>}
            <div className={"flex justify-between text-foreground-primary/.75"}>
                <div className={"flex items-center gap-0.5"}>
                    <RxTriangleRight />
                    {data.categories.map((c, i) => (
                        <Fragment key={i}>
                            {!!i && <RxDotFilled className={"text-xs"} />}
                            <Link to={c.path} className={"link-text"}>
                                {c.label}
                            </Link>
                        </Fragment>
                    ))}
                </div>
                <div className={"flex items-center gap-0.5"} title={"Комментарии"}>
                    {data.comments && (
                        <>
                            <MdOutlineModeComment />
                            <span>{data.comments}</span>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}