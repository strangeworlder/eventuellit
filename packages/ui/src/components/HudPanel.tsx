import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface HudPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual framing intent for telemetry panels. */
  variant?: "default" | "accent" | "dawn" | "alert" | "locked";
  /** Monospace uppercase coordinate or subsystem header code, e.g. "KANSI-02 // HYTTI-B3". */
  headerCode?: string;
  /** Panel heading rendered in the top telemetry strip. */
  title?: string;
  /** Optional right-aligned status badge or telemetry readout inside the header strip. */
  statusSlot?: React.ReactNode;
  /** Optional footer strip separated by a crisp hairline divider. */
  footer?: React.ReactNode;
  /** Reduces internal padding for dense sidebars or lists. */
  compact?: boolean;
  /** Scoped `data-theme` override. */
  theme?: Theme;
}

const CHAMFER_CLIP_PATH =
  "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))";

/**
 * Chamfered HUD container with sharp 45-degree corner cuts and `var(--theme-*)` telemetry chrome.
 * Use inside ship/terminal views for structured subsystems, cabin cards, and downtime panels.
 *
 * @summary chamfered HUD panel with optional headerCode, title, statusSlot, and theme variants
 */
export const HudPanel = React.forwardRef<HTMLDivElement, HudPanelProps>(
  (
    {
      className,
      variant = "default",
      headerCode,
      title,
      statusSlot,
      footer,
      compact = false,
      theme,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const hasHeader = Boolean(headerCode || title || statusSlot);

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "relative font-sans text-[var(--theme-text)] transition-all duration-200",
          variant === "accent" &&
            "drop-shadow-[0_0_14px_color-mix(in_srgb,var(--theme-secondary)_20%,transparent)]",
          variant === "dawn" &&
            "drop-shadow-[0_0_14px_color-mix(in_srgb,var(--theme-dawn)_22%,transparent)]",
          variant === "alert" &&
            "drop-shadow-[0_0_14px_color-mix(in_srgb,var(--theme-primary)_22%,transparent)]",
          className,
        )}
        style={style}
        {...props}
      >
        {/* Outer clipped frame acts as a razor-sharp 1.5px chamfered border */}
        <div
          className={cn("p-[1.5px]", {
            "bg-[var(--theme-cockpit-border)]": variant === "default",
            "bg-[var(--theme-secondary)]": variant === "accent",
            "bg-[var(--theme-dawn)]": variant === "dawn",
            "bg-[var(--theme-primary)]": variant === "alert",
            "bg-[var(--theme-cockpit-border-soft)]": variant === "locked",
          })}
          style={{ clipPath: CHAMFER_CLIP_PATH }}
        >
          <div
            className={cn(
              "relative",
              variant === "locked"
                ? "bg-[color-mix(in_srgb,var(--theme-cockpit-surface)_85%,var(--theme-bg))]"
                : "bg-[var(--theme-cockpit-surface)]",
            )}
            style={{ clipPath: CHAMFER_CLIP_PATH }}
          >
            {hasHeader && (
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2 border-b",
                  compact ? "px-3 py-2" : "px-4 py-2.5 tablet:px-5",
                  {
                    "border-[var(--theme-cockpit-border-soft)] bg-[var(--theme-cockpit-header)]":
                      variant === "default" || variant === "locked",
                    "border-[color-mix(in_srgb,var(--theme-secondary)_40%,transparent)] bg-[color-mix(in_srgb,var(--theme-secondary)_12%,var(--theme-cockpit-surface))]":
                      variant === "accent",
                    "border-[color-mix(in_srgb,var(--theme-dawn)_44%,transparent)] bg-[color-mix(in_srgb,var(--theme-dawn)_14%,var(--theme-cockpit-surface))]":
                      variant === "dawn",
                    "border-[color-mix(in_srgb,var(--theme-primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--theme-primary)_14%,var(--theme-cockpit-surface))]":
                      variant === "alert",
                  },
                )}
              >
                <div className="min-w-0 space-y-0.5">
                  {headerCode && (
                    <div
                      className={cn(
                        "font-heading text-xs font-semibold uppercase tracking-wider",
                        variant === "alert"
                          ? "text-[var(--theme-primary)]"
                          : variant === "accent"
                            ? "text-[var(--theme-secondary)]"
                            : variant === "locked"
                              ? "text-text-muted"
                              : "text-[var(--theme-dawn-muted)]",
                      )}
                    >
                      {headerCode}
                    </div>
                  )}
                  {title && (
                    <div className="font-heading text-sm tablet:text-base font-bold tracking-wide text-[var(--theme-text)] leading-snug">
                      {title}
                    </div>
                  )}
                </div>
                {statusSlot && <div className="shrink-0 flex items-center gap-2">{statusSlot}</div>}
              </div>
            )}

            <div className={cn(compact ? "p-3" : "p-4 tablet:p-5")}>{children}</div>

            {footer && (
              <div
                className={cn(
                  "border-t border-[var(--theme-cockpit-border-soft)] bg-[var(--theme-cockpit-header)]",
                  compact ? "px-3 py-2" : "px-4 py-3 tablet:px-5",
                )}
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

HudPanel.displayName = "HudPanel";
