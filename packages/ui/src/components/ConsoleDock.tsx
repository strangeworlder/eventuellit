import React from "react";
import { Icon, type IconName } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface ConsoleDockProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional compact strip rendered directly above the main dock (e.g. deck filter pills). */
  utilityBar?: React.ReactNode;
  /** Accessible label for the dock navigation landmark. */
  ariaLabel?: string;
  /** Scoped `data-theme` override. */
  theme?: Theme;
}

/**
 * Floating bottom thumb-dock for full-viewport game HUD navigation.
 * Hosts primary navigation actions in comfortable touch targets and an optional
 * utility strip above it for contextual filters (such as ship deck selectors).
 *
 * @summary floating bottom thumb-dock with utility strip and high-contrast game nav buttons
 */
export const ConsoleDock = React.forwardRef<HTMLElement, ConsoleDockProps>(
  (
    { className, utilityBar, ariaLabel = "Aluksen pikavalikko", theme, children, ...props },
    ref,
  ) => {
    return (
      <div
        data-theme={theme}
        className={cn(
          "font-sans flex flex-col desktop:flex-row desktop:items-center desktop:justify-between gap-2 desktop:gap-4 w-full max-w-6xl mx-auto",
          className,
        )}
      >
        {utilityBar && (
          <div className="w-full desktop:w-auto flex justify-center desktop:justify-start">
            <div className="ds-console-pod drop-shadow-[0_10px_22px_rgb(0_0_0_/_0.42)]">
              <div className="px-2 py-1 flex flex-wrap items-center justify-center gap-1.5">
                {utilityBar}
              </div>
            </div>
          </div>
        )}

        <nav
          ref={ref}
          aria-label={ariaLabel}
          className={cn(
            "w-full desktop:w-auto desktop:min-w-[26rem] ds-console-pod drop-shadow-[0_12px_26px_rgb(0_0_0_/_0.48)]",
          )}
          {...props}
        >
          <div className="p-1.5 grid auto-cols-fr grid-flow-col gap-1.5">{children}</div>
        </nav>
      </div>
    );
  },
);

ConsoleDock.displayName = "ConsoleDock";

export interface ConsoleDockItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon rendered inside the dock action. */
  icon: IconName;
  /** Short action label visible under or beside the icon. */
  label: string;
  /** Marks the currently active route or mode (`aria-current="page"`). */
  active?: boolean;
  /** Optional numeric or status badge (e.g. remaining 5n20 dice count). */
  badge?: string | number;
  /** Scoped `data-theme` override. */
  theme?: Theme;
}

/**
 * Single touch-friendly action item inside `ConsoleDock`.
 *
 * @summary elevated dock item button with active indicator bar and optional badge
 */
export const ConsoleDockItem = React.forwardRef<HTMLButtonElement, ConsoleDockItemProps>(
  ({ className, icon, label, active = false, badge, disabled, theme, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        data-theme={theme}
        aria-current={active ? "page" : undefined}
        disabled={disabled}
        className={cn(
          "relative min-h-11 px-2.5 py-1.5 rounded-[3px] flex flex-col tablet:flex-row items-center justify-center gap-1 tablet:gap-2 cursor-pointer transition-all duration-150 overflow-hidden",
          "font-heading text-xs tablet:text-sm font-bold tracking-wide",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)]",
          active
            ? "border border-[var(--theme-dawn)] bg-[color-mix(in_srgb,var(--theme-dawn)_15%,var(--theme-cockpit-surface))] text-[var(--theme-text)] shadow-[0_0_14px_color-mix(in_srgb,var(--theme-dawn)_24%,transparent)]"
            : "border border-transparent bg-transparent text-text-muted hover:text-[var(--theme-text)] hover:border-[var(--theme-cockpit-border)] hover:bg-[var(--theme-cockpit-elevated)]",
          disabled && "opacity-40 grayscale-[40%] cursor-not-allowed pointer-events-none",
          className,
        )}
        {...props}
      >
        {active && (
          <span
            aria-hidden="true"
            className="absolute top-0 left-2.5 right-2.5 h-[2px] bg-[var(--theme-dawn)] shadow-[0_0_8px_var(--theme-dawn)]"
          />
        )}
        <Icon
          name={icon}
          size={17}
          className={cn("shrink-0", active ? "text-[var(--theme-dawn)]" : "text-current")}
          aria-hidden="true"
        />
        <span className="truncate leading-none">{label}</span>

        {badge !== undefined && badge !== null && (
          <span
            className={cn(
              "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full font-heading text-xs font-bold tabular-nums leading-none",
              active
                ? "bg-[var(--theme-dawn)] text-[var(--theme-dawn-foreground)]"
                : "border border-[var(--theme-dawn)] bg-[color-mix(in_srgb,var(--theme-dawn)_16%,var(--theme-cockpit-surface))] text-[var(--theme-dawn-muted)]",
            )}
          >
            {badge}
          </span>
        )}
      </button>
    );
  },
);

ConsoleDockItem.displayName = "ConsoleDockItem";
