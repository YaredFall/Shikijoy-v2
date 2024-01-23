import { toAbsolute } from "@/utils/routing";
import { forwardRef, useMemo } from "react";
import { Link as LinkPrimitive, LinkProps } from "react-router-dom";

const Link = forwardRef<HTMLAnchorElement, LinkProps & { absolute?: boolean; }>(({ to, absolute, ...props }, ref) => {

    const toWithSlash = useMemo(() => {
        let newTo = typeof to === "string" ? to : to.pathname;

        if (!newTo) return to;

        if (!newTo.endsWith("/")) newTo += "/";
        if (absolute) toAbsolute(newTo);

        return typeof to === "string" ? newTo : to;

    }, [absolute, to]);

    return (
        <LinkPrimitive ref={ref} to={toWithSlash} {...props} />
    );
});

export { Link };