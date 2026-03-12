import React from "react";
import { cn } from "./Heading";

export interface GameTermProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * The visual style of the game term.
     * - `default` or `accent`: Emphasized text using the accent color.
     * - `primary`: Emphasized text using the primary color.
     * - `label`: Prominent uppercase label style, useful for inline headers.
     */
    variant?: "default" | "accent" | "primary" | "label";
}

/**
 * A standardized component for emphasizing game terms and creating inline labels 
 * based on the Design System typography tokens.
 */
export const GameTerm = React.forwardRef<HTMLElement, GameTermProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <strong
                ref={ref}
                className={cn(
                    {
                        "[color:color-mix(in_srgb,var(--theme-accent)_40%,var(--theme-text))] font-black": variant === "default" || variant === "accent",
                        "text-[var(--theme-primary)]": variant === "primary",
                        "text-[var(--theme-primary)] font-black uppercase tracking-widest ml-1": variant === "label",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
GameTerm.displayName = "GameTerm";
