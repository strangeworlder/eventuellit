import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the button is currently in the pressed/active state */
  pressed: boolean;
  theme?: Theme;
}

/**
 * A two-state toggle button that communicates its pressed state visually.
 * Uses the secondary colour token when active and a muted outline when inactive.
 * Sets `aria-pressed` following the WAI-ARIA toggle button pattern.
 * For a full-width on/off toggle with a label use Switch instead.
 *
 * @summary compact pressed/unpressed toggle button with aria-pressed; for labelled toggles use Switch
 */
export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ className, pressed, theme, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-theme={theme}
        aria-pressed={pressed}
        className={cn(
          "font-sans inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-semibold tracking-wide cursor-pointer transition-all duration-150 active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          "disabled:opacity-40 disabled:grayscale-[40%] disabled:pointer-events-none disabled:shadow-none",
          pressed
            ? "ds-control-checked text-[var(--theme-secondary-foreground)]"
            : "ds-btn-outline text-text-muted hover:text-[var(--theme-text)]",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

ToggleButton.displayName = "ToggleButton";
