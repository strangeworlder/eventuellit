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
     * - `station-node`: Label beneath a station die icon — tiny, centred, wraps within the die column width.
     */
    variant?: "body" | "small" | "lead" | "muted" | "bold" | "label" | "caption" | "node" | "station-node";
    theme?: Theme;
}

/**
 * A standardized Text component that maps to Design System typography tokens and supports theming.
 *
 * **Rule:** `className` on `<Text>` is only for spacing/layout (e.g. `mt-4`, `max-w-prose`).
 * Never use `className` for font properties — create or use an existing variant instead.
 *
 * @summary body/UI text with variant scale: body, lead, muted, small, bold, label, caption, node
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
                        "text-base leading-[1.7] font-normal": variant === "body",
                        "text-sm leading-snug font-normal": variant === "small",
                        "text-xl leading-normal font-light": variant === "lead",
                        "text-base leading-[1.7] text-text-muted": variant === "muted",
                        "text-base leading-[1.7] font-semibold": variant === "bold",
                        "text-xs font-black uppercase tracking-widest": variant === "label",
                        "text-xs leading-snug text-text-subtle": variant === "caption",
                        "text-xs font-semibold tracking-wide leading-tight": variant === "node",
                        "text-xs font-semibold tracking-normal leading-tight text-center max-w-16 break-words": variant === "station-node",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Text.displayName = "Text";
