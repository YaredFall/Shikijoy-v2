import Image from "@/components/ui/image";
import { getScreenshots } from "@/entities/animejoy/show/scraping";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { useMemo } from "react";

type ScreenshotsProps = Record<never, never>;

export default function Screenshots({ }: ScreenshotsProps) {

    const { data: doc } = useAnimejoyPage();

    const screenshots = useMemo(() => getScreenshots(doc?.page), [doc?.page]);

    return (
        <section className={"-mx-4 flex h-40 justify-center gap-3 bg-black/25 py-6"}>
            { (screenshots ?? [undefined, undefined, undefined]).map(sh => (
                <Image className={"aspect-video h-full w-auto rounded object-contain"} src={sh ?? undefined} />
            ))}
        </section>
    );
}