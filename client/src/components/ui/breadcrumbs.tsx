import DotSplitter from "@/components/ui/dot-splitter";
import { Link } from "@/components/utility/Link";
import { ShowCategory } from "@/types/animejoy";
import { HOME_AS_CATEGORY, SHOW_CATEGORIES, toAbsolute } from "@/utils/routing";
import { Fragment, useMemo } from "react";
import { useMatches } from "react-router-dom";

type BreadcrumbsProps = Record<never, never>;

export default function Breadcrumbs({ }: BreadcrumbsProps) {
    const matches = useMatches();

    const segments = useMemo(() => matches.reduce((res, match) => {
        const route = SHOW_CATEGORIES.find(r => toAbsolute(r.path) === toAbsolute(match.pathname));
        if (route) res.push(route);
        return res;
    }, new Array<ShowCategory>()), [matches]);

    const crumbs = useMemo(() => {
        let currentUrl = "";
        return segments.map(({ path, name }) => {
            currentUrl += toAbsolute(path);
            return ({
                path: currentUrl,
                name,
            });
        });
    }, [segments]);

    return (
        <nav className={"h-header-width bg-black/15 absolute top-0 left-header-width right-0 pr-8"}>
            <div className={"h-full mr-aside-width flex items-center gap-2 text-sm px-8"}>
                <Link absolute to={HOME_AS_CATEGORY.path} className={"link"}>ShikiJoy</Link>
                {
                    crumbs.map(({ path, name }, i) => (
                        <Fragment key={path + i}>
                            <DotSplitter />
                            <Link to={path} className={"link"}>{name}</Link>
                        </Fragment>
                    ))
                }
            </div>
        </nav>
    );
}