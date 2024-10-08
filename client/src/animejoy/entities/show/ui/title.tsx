import type { ShowTitle } from "@client/animejoy/entities/show/model";
import { getShowTitle } from "@client/animejoy/entities/show/scraping";
import { animejoyClient } from "@client/animejoy/shared/api/client";
import { cn } from "@client/shared/lib/cn";
import { forwardRef } from "react";

type ShowTitleProps = {
    className?: string;
};
const ShowTitle = forwardRef<HTMLDivElement, ShowTitleProps>(({ className }, forwardedRef) => {

    const [data] = animejoyClient.page.useSuspenseQuery(undefined, {
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