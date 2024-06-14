import DotSplitter from "@/components/ui/dot-splitter";
import Image from "@/components/ui/image";
import TextSkeleton from "@/components/ui/text-skeleton";
import { Link } from "@/components/utility/Link";
import ShowDetails from "@/entities/animejoy/show/ui/show-details";
import { StoryData } from "@/types/animejoy";
import { Fragment } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { MdOutlineModeComment } from "react-icons/md";

type StoryCardProps = {
    data: StoryData | undefined;
};

export default function StoryCard({ data }: StoryCardProps) {

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
                {/* ? 354px is the poster height (reference *animejoy-poster* class) */}
                <ShowDetails data={data} maxInfoHeight={354} />
            </div>
            {
                (!data || !!data.editDate)
                && <div className={"text-sm text-foreground-primary/.5"}>{data?.editDate ?? <TextSkeleton className={"my-1.5 block h-3 w-3/4"} length={1} />}</div>
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