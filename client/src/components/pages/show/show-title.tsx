import LoadableText from "@/components/ui/loadablet-text";
import type { ShowTitle } from "@/entities/animejoy/show/model";
import { getShowTitle } from "@/entities/animejoy/show/scraping";
import { cn } from "@/lib/utils";
import { useAnimejoyPage } from "@/query-hooks/useAnimejoyPage";
import { forwardRef, useMemo } from "react";

type ShowTitleProps = {
    className?: string;
};

const ShowTitle = forwardRef<HTMLDivElement, ShowTitleProps>(({ className }, forwardedRef) => {

    const { data: doc } = useAnimejoyPage();

    const title = useMemo(() => getShowTitle(doc?.page), [doc?.page]);

    return (
        <header className={className} ref={forwardedRef}>
            <LoadableText
                as={"h1"}
                isLoading={!title}
                placeholderLength={40}
                className={cn(
                    "text-3xl font-medium mb-0.5",
                    Number(title?.ru.length) > 40 && "text-2xl",
                )}
            >
                {title?.ru}
            </LoadableText>
            <LoadableText
                as={"h2"}
                isLoading={!title}
                placeholderLength={30}
                className={cn(
                    "text-xl font-medium text-foreground-primary/.75",
                    Number(title?.romanji.length) > 40 && "text-lg",
                )}
            >
                {title?.romanji}
            </LoadableText>
        </header>
    );
});

export default ShowTitle;