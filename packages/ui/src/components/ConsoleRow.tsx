import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export type ConsoleRowStatusTone = "normal" | "active" | "dawn" | "warning" | "locked";

export interface ConsoleRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  /** Left indicator rail & border accent tone. */
  statusTone?: ConsoleRowStatusTone;
  /** Compact monospace identifier shown above the title (e.g. "B-04" or "LUKITTU"). */
  code?: string;
  /** Primary item label. */
  title: string;
  /** Optional concise secondary line. */
  subtitle?: string;
  /** Optional left visual slot (e.g. compact ProgressClock or DiceIcon). */
  leading?: React.ReactNode;
  /** Optional right-side status badge/value. */
  badge?: React.ReactNode;
  /** Optional trailing controls (never nested inside a `<button>`). */
  actions?: React.ReactNode;
  /** Optional primary click handler for opening or selecting the row. */
  onClick?: () => void;
  /** Disables row click interaction. */
  disabled?: boolean;
  /** Scoped `data-theme` override. */
  theme?: Theme;
}

function getToneRailClass(tone: ConsoleRowStatusTone): string {
  switch (tone) {
    case "active":
    case "dawn":
      return "border-l-[3px] border-l-[var(--theme-dawn)] border-[color-mix(in_srgb,var(--theme-dawn)_52%,var(--theme-cockpit-border-soft))]";
    case "warning":
      return "border-l-[3px] border-l-[var(--theme-primary)] border-[color-mix(in_srgb,var(--theme-primary)_45%,var(--theme-border-soft))]";
    case "locked":
      return "border-l-[3px] border-l-[var(--theme-accent)] border-[color-mix(in_srgb,var(--theme-accent)_45%,var(--theme-border-soft))]";
    default:
      return "";
  }
}

/**
 * Compact elevated terminal list row for cabin possessions, downtime actions,
 * sector cabins, and GM room rosters.
 *
 * @summary compact elevated console list row with status rail, leading visual, badge, and actions
 */
export const ConsoleRow = React.forwardRef<HTMLDivElement, ConsoleRowProps>(
  (
    {
      className,
      statusTone = "normal",
      code,
      title,
      subtitle,
      leading,
      badge,
      actions,
      onClick,
      disabled = false,
      theme,
      children,
      ...props
    },
    ref,
  ) => {
    const contentNode = (
      <div className="flex items-start gap-3 min-w-0 flex-1 text-left">
        {leading && <div className="shrink-0 pt-0.5">{leading}</div>}
        <div className="min-w-0 flex-1 space-y-0.5">
          {code && (
            <div
              className={cn(
                "font-heading text-xs font-bold uppercase tracking-wider tabular-nums",
                statusTone === "warning"
                  ? "text-[var(--theme-primary)]"
                  : statusTone === "active" || statusTone === "dawn"
                    ? "text-[var(--theme-dawn-muted)]"
                    : statusTone === "locked"
                      ? "text-[var(--theme-accent)]"
                      : "text-text-muted",
              )}
            >
              {code}
            </div>
          )}
          <div className="font-sans text-sm tablet:text-base font-semibold text-[var(--theme-text)] leading-snug break-words">
            {title}
          </div>
          {subtitle && (
            <div className="font-sans text-xs tablet:text-sm text-text-muted leading-relaxed break-words">
              {subtitle}
            </div>
          )}
          {children && <div className="pt-1.5">{children}</div>}
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        data-theme={theme}
        data-status-tone={statusTone}
        className={cn(
          "font-sans rounded-[3px] ds-console-row p-2.5 tablet:p-3 transition-colors duration-150",
          getToneRailClass(statusTone),
          onClick &&
            !disabled &&
            "hover:border-[var(--theme-secondary)] hover:bg-[color-mix(in_srgb,var(--theme-secondary)_9%,var(--theme-cockpit-elevated))]",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col mobile:flex-row mobile:items-center justify-between gap-2.5">
          {onClick ? (
            <button
              type="button"
              disabled={disabled}
              onClick={onClick}
              className={cn(
                "flex-1 min-w-0 flex items-center justify-between gap-2 text-left cursor-pointer rounded-[2px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)]",
                disabled && "opacity-40 cursor-not-allowed pointer-events-none",
              )}
            >
              {contentNode}
              {badge && !actions && <div className="shrink-0">{badge}</div>}
            </button>
          ) : (
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              {contentNode}
              {badge && !actions && <div className="shrink-0">{badge}</div>}
            </div>
          )}

          {(actions || (badge && actions)) && (
            <div className="flex flex-wrap items-center justify-end gap-1.5 shrink-0">
              {badge}
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  },
);

ConsoleRow.displayName = "ConsoleRow";
