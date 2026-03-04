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
                    "font-sans text-[var(--theme-text)]",
                    {
                        "text-base leading-relaxed font-normal": variant === "base",
                        "text-lg leading-relaxed font-normal": variant === "large",
                        "text-sm leading-snug font-normal": variant === "small",
                        "text-xl leading-normal font-light opacity-90": variant === "lead",
                        "text-base leading-relaxed opacity-70": variant === "muted",
                        "text-base leading-relaxed font-semibold": variant === "bold",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Text.displayName = "Text";
