
import ShowDetails from "@/animejoy/entities/show/ui/details";
import { ShowStory } from "@/animejoy/entities/story/model";
import Image from "@/shared/ui/kit/image";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { MdOutlineModeComment } from "react-icons/md";

type ShowCardProps = {
    data: ShowStory;
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
            <div className={"flex gap-2"}>
                <Link to={data.url || ""} className={"shrink-0"}>
                    <Image className={"animejoy-poster rounded"} src={data.poster} />
                </Link>
                {/* ? 354px is the poster height (reference *animejoy-poster* class) */}
                <ShowDetails data={data} maxInfoHeight={354} />
            </div>
            {
                !!data.editDate
                && (
                    <div className={"text-sm text-foreground-primary/.5"}>
                        {data.editDate}
                    </div>
                )
            }
            <div className={"flex justify-between"}>
                <div className={"flex items-center gap-0.5"}>
                    <IoMdArrowDropright className={"text-foreground-primary/.75"} />
                    {
                        data.categories.map((c, i) => (
                            <Fragment key={i}>
                                {/* {!!i && <DotSplitter />} */}
                                <Link to={c.path} className={"link-text"}>{c.label}</Link>
                            </Fragment>
                        ))
                    }
                </div>
                <div className={"flex items-center gap-0.5"} title={"Комментарии"}>
                    {
                        data.comments
                        && (
                            <>
                                <MdOutlineModeComment />
                                <span>{data.comments}</span>
                            </>
                        )
                    }
                </div>
            </div>
        </article>
    );
}