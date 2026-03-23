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
 *
 * Follows the WAI-ARIA pattern for toggle buttons by setting `aria-pressed`.
 */
export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
    ({ className, pressed, theme, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                data-theme={theme}
                aria-pressed={pressed}
                className={cn(
                    "px-3 py-1 rounded-sm text-xs font-bold transition-colors border-2 cursor-pointer",
                    "focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
                    pressed
                        ? "bg-[var(--theme-secondary)] text-[var(--theme-secondary-foreground)] border-[var(--theme-secondary)]"
                        : "bg-transparent text-[var(--theme-text)]/50 border-[var(--theme-text)]/30 hover:border-[var(--theme-text)]/50",
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
