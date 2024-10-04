import { getScreenshots } from "@client/animejoy/entities/show/scraping";
import { animejoyClient } from "@client/animejoy/shared/api/client";
import Image from "@client/shared/ui/kit/image";

type ScreenshotsProps = Record<never, never>;

export default function Screenshots({ }: ScreenshotsProps) {

    const [data] = animejoyClient.page.useSuspenseQuery(undefined, {
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