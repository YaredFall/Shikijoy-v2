import { getScreenshots } from "@/animejoy/entities/show/scraping";
import { animejoyPageQueryOptions } from "@/animejoy/shared/api";
import Image from "@/shared/ui/kit/image";
import { useSuspenseQuery } from "@tanstack/react-query";

type ScreenshotsProps = Record<never, never>;

export default function Screenshots({ }: ScreenshotsProps) {

    const { data } = useSuspenseQuery({
        ...animejoyPageQueryOptions(),
        select: data => ({
            screenshots: getScreenshots(data.document),
        }),
    });

    return (
        <section className={"flex h-40 justify-center gap-3 bg-black/25 py-6"}>
            {
                (data.screenshots ?? [undefined, undefined, undefined]).map((sh, i) => (
                    <Image key={i} className={"h-full w-auto rounded object-contain data-[loading='true']:aspect-video"} src={sh ?? undefined} />
                ))
            }
        </section>
    );
}