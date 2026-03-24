import React from "react";
import { cn } from "./utils";
import type { Theme } from "./Theme";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    /**
     * Typography variant mapping to design system tokens.
     * - `body` (default): Standard body copy.
     * - `lead`: Introductory / hero copy, slightly larger and lighter.
     * - `small`: Compact secondary information.
     * - `muted`: De-emphasized helper text.
     * - `bold`: Emphasized body text.
     * - `label`: Section labels & category headers (uppercase, tracked).
     * - `caption`: Tiny metadata & footnotes.
     * - `node`: Map/diagram node labels (compact, tracked).
     */
    variant?: "body" | "small" | "lead" | "muted" | "bold" | "label" | "caption" | "node";
    theme?: Theme;
}

/**
 * A standardized Text component that maps to Design System typography tokens and supports theming.
 *
 * **Rule:** `className` on `<Text>` is only for spacing/layout (e.g. `mt-4`, `max-w-prose`).
 * Never use `className` for font properties — create or use an existing variant instead.
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
    ({ className, variant = "body", theme, ...props }, ref) => {
        return (
            <p
                ref={ref}
                data-theme={theme}
                className={cn(
                    "font-sans text-[var(--theme-text)] tracking-[0.015em]",
                    {
                    "text-[1.05rem] leading-[1.7] font-normal": variant === "body",
                        "text-[0.9rem] leading-snug font-normal": variant === "small",
                        "text-[1.25rem] leading-normal font-light": variant === "lead",
                        "text-[1.05rem] leading-[1.7] text-text-muted": variant === "muted",
                        "text-[1.05rem] leading-[1.7] font-semibold": variant === "bold",
                        "text-xs font-black uppercase tracking-widest": variant === "label",
                        "text-[0.75rem] leading-snug text-text-subtle": variant === "caption",
                        "text-[0.6rem] font-semibold tracking-wide leading-tight": variant === "node",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Text.displayName = "Text";
