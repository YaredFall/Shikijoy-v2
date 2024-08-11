import type { ShowTitle } from "@/animejoy/entities/show/model";
import { getShowTitle } from "@/animejoy/entities/show/scraping";
import { animejoyPageQueryOptions } from "@/animejoy/shared/api/query/page";
import { cn } from "@/shared/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { forwardRef } from "react";

type ShowTitleProps = {
    className?: string;
};
const ShowTitle = forwardRef<HTMLDivElement, ShowTitleProps>(({ className }, forwardedRef) => {

    const { data } = useSuspenseQuery({
        ...animejoyPageQueryOptions(),
        select: data => ({
            title: getShowTitle(data.document),
        }),
    });

    return (
        <header className={className} ref={forwardedRef}>
            <h1 className={cn(
                "text-3xl font-medium mb-0.5",
                Number(data.title.ru.length) > 40 && "text-2xl",
            )}
            >
                {data.title.ru}
            </h1>
            <h2 className={cn(
                "text-xl font-medium text-foreground-primary/.75",
                Number(data.title.romanji.length) > 40 && "text-lg",
            )}
            >
                {data.title.romanji}
            </h2>
        </header>
    );
});
ShowTitle.displayName = "ShowTitle";

export default ShowTitle;