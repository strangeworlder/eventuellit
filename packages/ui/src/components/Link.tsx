import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { cn } from "./utils";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    external?: boolean;
}

/**
 * A standardized Link component for the Design System.
 * Uses React Router `<Link>` for internal navigation; set `external` for `<a target="_blank">`.
 * For navigation that looks like a button use `<Button>` wrapped in a router link.
 *
 * @summary styled anchor; external prop for new-tab links; for button-styled nav use Button in a Link
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, external, href = "", ...props }, ref) => {
        const classes = cn(
            "text-[var(--theme-accent)] hover:text-[var(--theme-primary)] underline decoration-[var(--theme-accent)]/30 hover:decoration-[var(--theme-primary)] underline-offset-4 transition-colors duration-200 cursor-pointer",
            className
        );

        if (external) {
            return (
                <a
                    ref={ref}
                    href={href}
                    className={classes}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                />
            );
        }

        return (
            <ReactRouterLink
                to={href}
                className={classes}
                {...(props as any)}
            />
        );
    }
);
Link.displayName = "Link";
