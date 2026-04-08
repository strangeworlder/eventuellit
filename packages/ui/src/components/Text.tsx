import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

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
   * - `overline`: Uppercase tracked label in primary accent (section kicker).
   * - `kicker`: Tiny uppercase section labels (placeholder contrast).
   * - `body-relaxed`: Body copy with relaxed line height for long paragraphs.
   * - `node`: Map/diagram node labels (compact, tracked).
   * - `station-node`: Label beneath a station die icon — tiny, centred, wraps within the die column width.
   */
  variant?:
    | "body"
    | "small"
    | "lead"
    | "muted"
    | "bold"
    | "label"
    | "caption"
    | "overline"
    | "kicker"
    | "body-relaxed"
    | "node"
    | "station-node";
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
            "text-[length:var(--font-size-base)] font-normal": variant === "body",
            "text-[length:var(--font-size-sm)] leading-snug font-normal": variant === "small",
            "text-[length:var(--font-size-xl)] leading-normal font-light": variant === "lead",
            "text-[length:var(--font-size-base)] text-[var(--theme-text-muted)]":
              variant === "muted",
            "text-[length:var(--font-size-base)] font-semibold": variant === "bold",
            "text-[length:var(--font-size-xs)] font-black uppercase tracking-widest":
              variant === "label",
            "text-[length:var(--font-size-xs)] leading-snug text-[var(--theme-text-subtle)]":
              variant === "caption",
            "text-[length:var(--font-size-xs)] font-black uppercase tracking-widest text-[var(--theme-primary)]":
              variant === "overline",
            "text-[length:var(--font-size-3xs)] font-black uppercase tracking-widest text-text-placeholder":
              variant === "kicker",
            "text-[length:var(--font-size-base)] leading-relaxed font-normal":
              variant === "body-relaxed",
            "text-[length:var(--font-size-xs)] font-semibold tracking-wide leading-tight":
              variant === "node",
            "text-[length:var(--font-size-xs)] font-semibold tracking-normal leading-tight text-center max-w-16 break-words":
              variant === "station-node",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";
