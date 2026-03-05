import React from "react";
import { cn } from "./Heading";

export type Theme =
    | "base"
    | "inverted"
    | "primary-light"
    | "primary-dark"
    | "secondary-light"
    | "secondary-dark"
    | "accent-light"
    | "accent-dark";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    variant?: "base" | "large" | "small" | "lead" | "muted" | "bold";
    theme?: Theme;
}

/**
 * A standardized Text component that maps to Design System typography tokens and supports theming.
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
    ({ className, variant = "base", theme, ...props }, ref) => {
        return (
            <p
                ref={ref}
                data-theme={theme}
                className={cn(
                    "font-sans text-[var(--theme-text)] tracking-[0.015em]",
                    {
                        "text-[1.05rem] leading-[1.7] font-normal": variant === "base",
                        "text-[1.15rem] leading-[1.7] font-normal": variant === "large",
                        "text-[0.9rem] leading-snug font-normal": variant === "small",
                        "text-[1.25rem] leading-normal font-light opacity-90": variant === "lead",
                        "text-[1.05rem] leading-[1.7] opacity-70": variant === "muted",
                        "text-[1.05rem] leading-[1.7] font-semibold": variant === "bold",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Text.displayName = "Text";
