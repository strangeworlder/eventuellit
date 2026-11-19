import React from "react";
import { Icon, type IconName } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export type ConsolePillTone = "neutral" | "secondary" | "alert" | "accent" | "dawn";

export interface ConsolePillProps {
  /** Semantic color emphasis matching the event/telemetry type. */
  tone?: ConsolePillTone;
  /** Optional leading icon. */
  icon?: IconName;
  /** Highlights the pill as currently toggled/selected (valid when interactive). */
  active?: boolean;
  /** When provided, renders an interactive `<button type="button">` pill. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible label override for interactive pills. */
  "aria-label"?: string;
  /** Optional tooltip text. */
  title?: string;
  /** Scoped `data-theme` override. */
  theme?: Theme;
  /** Extra classes for layout spacing. */
  className?: string;
  /** Pill label content. */
  children: React.ReactNode;
}

function getToneClasses(tone: ConsolePillTone, active: boolean) {
  if (tone === "alert") {
    return cn(
      "border-[var(--theme-primary)] text-[var(--theme-text)]",
      active
        ? "bg-[color-mix(in_srgb,var(--theme-primary)_24%,var(--theme-cockpit-surface))]"
        : "bg-[color-mix(in_srgb,var(--theme-cockpit-surface)_90%,var(--theme-primary))]",
    );
  }
  if (tone === "secondary") {
    return cn(
      "border-[var(--theme-secondary)] text-[var(--theme-text)]",
      active
        ? "bg-[color-mix(in_srgb,var(--theme-secondary)_26%,var(--theme-cockpit-surface))] shadow-[0_0_12px_color-mix(in_srgb,var(--theme-secondary)_26%,transparent)]"
        : "bg-[color-mix(in_srgb,var(--theme-cockpit-surface)_90%,var(--theme-secondary))]",
    );
  }
  if (tone === "accent") {
    return cn(
      "border-[var(--theme-accent)] text-[var(--theme-text)]",
      active
        ? "bg-[color-mix(in_srgb,var(--theme-accent)_24%,var(--theme-cockpit-surface))]"
        : "bg-[color-mix(in_srgb,var(--theme-cockpit-surface)_90%,var(--theme-accent))]",
    );
  }
  if (tone === "dawn") {
    return cn(
      "border-[var(--theme-dawn)] text-[var(--theme-text)]",
      active
        ? "bg-[color-mix(in_srgb,var(--theme-dawn)_28%,var(--theme-cockpit-surface))] shadow-[0_0_12px_color-mix(in_srgb,var(--theme-dawn)_26%,transparent)]"
        : "bg-[color-mix(in_srgb,var(--theme-dawn)_18%,var(--theme-cockpit-surface))]",
    );
  }
  return cn(
    active
      ? "border-[var(--theme-dawn)] bg-[color-mix(in_srgb,var(--theme-dawn)_18%,var(--theme-cockpit-surface))] text-[var(--theme-text)] shadow-[0_0_12px_color-mix(in_srgb,var(--theme-dawn)_22%,transparent)]"
      : "border-[var(--theme-cockpit-border-soft)] bg-[var(--theme-cockpit-elevated)] text-text-muted",
  );
}

/**
 * Compact floating telemetry pill for ship status, active dice counters, and deck filters.
 *
 * @summary elevated monospace telemetry badge or interactive toggle pill
 */
export const ConsolePill = React.forwardRef<HTMLDivElement | HTMLButtonElement, ConsolePillProps>(
  (
    {
      tone = "neutral",
      icon,
      active = false,
      onClick,
      theme,
      className,
      children,
      title,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const sharedClass = cn(
      "font-heading inline-flex items-center gap-1.5 rounded-[3px] border px-2.5 py-1 backdrop-blur-md",
      "text-xs font-semibold tracking-wide leading-snug whitespace-nowrap",
      "shadow-[var(--shadow-interactive),inset_0_1px_0_var(--theme-cockpit-rim)] transition-all duration-150",
      getToneClasses(tone, active),
      onClick &&
        "min-h-9 cursor-pointer hover:text-[var(--theme-text)] hover:border-[var(--theme-secondary)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)]",
      className,
    );

    const iconEl = icon ? (
      <Icon
        name={icon}
        size={13}
        className={cn(
          "shrink-0",
          tone === "alert"
            ? "text-[var(--theme-primary)]"
            : tone === "dawn" || (tone === "neutral" && active)
              ? "text-[var(--theme-dawn)]"
              : tone === "secondary"
                ? "text-[var(--theme-secondary)]"
                : tone === "accent"
                  ? "text-[var(--theme-accent)]"
                  : "text-current",
        )}
        aria-hidden="true"
      />
    ) : null;

    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          data-theme={theme}
          aria-pressed={active}
          aria-label={ariaLabel}
          title={title}
          onClick={onClick}
          className={sharedClass}
        >
          {iconEl}
          <span>{children}</span>
        </button>
      );
    }

    if (ariaLabel) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role="status"
          data-theme={theme}
          aria-label={ariaLabel}
          title={title}
          className={sharedClass}
        >
          {iconEl}
          <span>{children}</span>
        </div>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-theme={theme}
        title={title}
        className={sharedClass}
      >
        {iconEl}
        <span>{children}</span>
      </div>
    );
  },
);

ConsolePill.displayName = "ConsolePill";
