import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * Visual style of the separator.
   * - `soft` (default): Uses `--theme-border-soft` — subtle divider between related sections.
   * - `medium`: Uses `--theme-border-medium` — more prominent division.
   * - `strong`: Uses the primary theme color for a decorative accent divider.
   */
  variant?: "soft" | "medium" | "strong";
  /**
   * Orientation of the separator.
   * - `horizontal` (default)
   * - `vertical`: Use inside a flex-row container with an explicit height.
   */
  orientation?: "horizontal" | "vertical";
  /** Decorative separators don't convey meaning; non-decorative ones have role="separator" */
  decorative?: boolean;
  /** Theme override */
  theme?: Theme;
}

/**
 * Separator is a visual divider between sections or groups of content.
 * Defaults to decorative (aria-hidden) since most dividers are presentational.
 */
export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  (
    { className, variant = "soft", orientation = "horizontal", decorative = true, theme, ...props },
    ref,
  ) => {
    return (
      <hr
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        aria-hidden={decorative ? "true" : undefined}
        data-theme={theme}
        className={cn(
          "border-0 shrink-0",
          {
            // Horizontal
            "w-full h-px": orientation === "horizontal",
            // Vertical
            "h-full w-px self-stretch": orientation === "vertical",
          },
          {
            "bg-[var(--theme-border-soft)]": variant === "soft",
            "bg-[var(--theme-border-medium)]": variant === "medium",
            "bg-[var(--theme-primary)]": variant === "strong",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = "Separator";
