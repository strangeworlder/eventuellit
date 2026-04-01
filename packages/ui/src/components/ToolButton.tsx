import React from "react";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, shows a spinner and disables interaction. */
  loading?: boolean;
  /** Optional message shown as tooltip text while loading. */
  loadingMessage?: string;
  theme?: Theme;
}

/**
 * Lightweight utility control for edit/manage actions on content surfaces.
 * Use when the button is a tool — not a call to action.
 *
 * Contrasts with `Button`, which uses bold uppercase tracking suited for CTAs like "Tallenna"
 * or "Liity peliin". `ToolButton` uses normal-case, reduced weight, and minimal visual chrome
 * so it reads as part of the content UI rather than as a primary interaction target.
 *
 * Typical uses: "Muokkaa", "Piilota", "Julkaise".
 * For persistent on/off state, prefer `ToggleButton` instead.
 * For navigation or sidebar items, prefer `Button variant="ghost-subtle"`.
 *
 * @summary lightweight utility control for content actions (Muokkaa, Piilota, Julkaise)
 */
export const ToolButton = React.forwardRef<HTMLButtonElement, ToolButtonProps>(
  (
    {
      className,
      loading = false,
      loadingMessage,
      theme,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        data-theme={theme}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-label={loading && loadingMessage ? loadingMessage : undefined}
        className={cn(
          "font-sans inline-flex cursor-pointer items-center gap-1.5 rounded-sm font-medium transition-colors duration-200",
          "px-3 py-1 text-[length:var(--font-size-sm)]",
          "text-text-muted border-2 border-[var(--theme-border-soft)] bg-transparent",
          "hover:text-[var(--theme-text)] hover:border-[var(--theme-border-medium)] hover:bg-[var(--theme-surface-tint)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          "active:bg-[var(--theme-surface-tint)] active:text-[var(--theme-text)]",
          isDisabled &&
            "opacity-40 grayscale-[40%] cursor-not-allowed pointer-events-none",
          className,
        )}
        {...props}
      >
        {loading && (
          <Icon
            name="loader2"
            size={14}
            className="animate-spin shrink-0"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);

ToolButton.displayName = "ToolButton";
