import React from "react";
import { AnchoredTooltip } from "./AnchoredTooltip";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export type UrgencyLevel = "kriittinen" | "normaali" | "joustava";

export interface UrgencyIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The urgency tier to display. */
  urgency: UrgencyLevel;
  /** Optional label override. Defaults to the Finnish tier name. */
  label?: string;
  /** Size variant. */
  size?: "default" | "compact";
  theme?: Theme;
}

const URGENCY_CONFIG = {
  kriittinen: {
    label: "Aikakriittinen",
    tooltip: "Tämä tehtävä vanhenee, jos sitä ei valita nyt.",
    icon: "alert-triangle" as const,
    classes: [
      "border-[var(--theme-primary)] text-[var(--theme-primary)]",
      "bg-[color-mix(in_srgb,var(--theme-primary)_10%,transparent)]",
      "shadow-[0_0_8px_color-mix(in_srgb,var(--theme-primary)_15%,transparent)]",
      "animate-[aspect-pulse_3s_ease-in-out_infinite]",
    ],
  },
  normaali: {
    label: "Normaali",
    tooltip: "Saatavilla toistaiseksi.",
    icon: "clock" as const,
    classes: [
      "border-[var(--theme-secondary)] text-[var(--theme-secondary)]",
      "bg-[color-mix(in_srgb,var(--theme-secondary)_8%,transparent)]",
    ],
  },
  joustava: {
    label: "Joustava",
    tooltip: "Matala prioriteetti — aina saatavilla.",
    icon: "minus" as const,
    classes: [
      "border-[var(--theme-border-medium)] text-[var(--theme-text-subtle)]",
      "bg-transparent",
    ],
  },
} satisfies Record<UrgencyLevel, { label: string; tooltip: string; icon: "alert-triangle" | "clock" | "minus"; classes: string[] }>;

/**
 * Semantic urgency tier indicator for time-sensitive game elements.
 * Three tiers: kriittinen (expires if not selected), normaali, joustava.
 *
 * @summary urgency tier chip: kriittinen (pulsing red) / normaali (teal) / joustava (muted)
 */
export const UrgencyIndicator = React.forwardRef<HTMLDivElement, UrgencyIndicatorProps>(
  ({ className, urgency, label, size = "default", theme, ...props }, ref) => {
    const config = URGENCY_CONFIG[urgency];
    const displayLabel = label ?? config.label;

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "font-sans inline-flex items-center gap-1.5 rounded-sm border font-bold uppercase tracking-widest transition-all duration-300",
          size === "default" && "px-2.5 py-1 text-xs",
          size === "compact" && "px-2 py-0.5 text-[0.65rem]",
          ...config.classes,
          className,
        )}
        {...props}
      >
        <Icon name={config.icon} size={size === "compact" ? 12 : 14} className="shrink-0" aria-hidden />
        <span>{displayLabel}</span>
        <AnchoredTooltip placement="top">{config.tooltip}</AnchoredTooltip>
      </div>
    );
  },
);
UrgencyIndicator.displayName = "UrgencyIndicator";
