import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Icon } from "./Icon";
import { cn } from "./utils";

export type FactionColor = "primary" | "secondary" | "accent";

export const FACTION_COLOR_VARS: Record<FactionColor, string> = {
  primary: "var(--color-primary-400)",
  secondary: "var(--color-secondary-400)",
  accent: "var(--color-accent-400)",
};

/** One step up the scale — used as the hover target for link badges. */
export const FACTION_COLOR_HOVER_VARS: Record<FactionColor, string> = {
  primary: "var(--color-primary-300)",
  secondary: "var(--color-secondary-300)",
  accent: "var(--color-accent-300)",
};

/** Stepped-down scale color for muted/disrupting states — no opacity hacks. */
export const FACTION_COLOR_MUTED_VARS: Record<FactionColor, string> = {
  primary: "var(--color-primary-600)",
  secondary: "var(--color-secondary-600)",
  accent: "var(--color-accent-600)",
};

/** One step up from muted — used as the hover target for disrupting indicators. */
export const FACTION_COLOR_MUTED_HOVER_VARS: Record<FactionColor, string> = {
  primary: "var(--color-primary-500)",
  secondary: "var(--color-secondary-500)",
  accent: "var(--color-accent-500)",
};

export interface FactionBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The faction's display name */
  factionName: string;
  /** Parent faction name shown as muted prefix: "Parent › Subfaction" */
  parentFactionName?: string;
  /** Faction color identity — maps to the global palette */
  color?: FactionColor;
  /**
   * Secondary color for hybrid factions.
   * When set, the color indicator shows a diagonal split between primary and secondary colors.
   * The card border becomes a vertical gradient between the two colors.
   */
  secondaryColor?: FactionColor;
  /**
   * Faction icon. In the card variant replaces the color dot with a recognizable symbol.
   * Ignored in the inline variant (dot is used instead for compactness).
   */
  iconName?: import("./Icon").IconName;
  /** Router href — renders inner element as a RouterLink when provided */
  href?: string;
  /** inline: compact pill for use in prose; card: left-bordered block for sidebars */
  variant?: "inline" | "card";
  /** Marks this faction as a disruptor, not a ruler — adds a zap indicator */
  disrupting?: boolean;
}

const COLOR_TRANSITION = "color 180ms ease, background-color 180ms ease, border-color 180ms ease";

/**
 * Color-coded faction identity tag. Optionally links to the faction detail page.
 * Usable inline in prose (pill) or as a block element in sidebar context (card).
 *
 * @summary faction identity badge; color-coded dot + name; inline/card variants; optional RouterLink
 */
export const FactionBadge = React.forwardRef<HTMLDivElement, FactionBadgeProps>(
  (
    {
      factionName,
      parentFactionName,
      color = "secondary",
      secondaryColor,
      iconName,
      href,
      variant = "inline",
      disrupting = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState(false);

    const c = href && hovered ? FACTION_COLOR_HOVER_VARS[color] : FACTION_COLOR_VARS[color];
    const cMuted =
      href && hovered ? FACTION_COLOR_MUTED_HOVER_VARS[color] : FACTION_COLOR_MUTED_VARS[color];
    const c2 = secondaryColor
      ? href && hovered
        ? FACTION_COLOR_HOVER_VARS[secondaryColor]
        : FACTION_COLOR_VARS[secondaryColor]
      : null;

    const innerCls = cn(
      "inline-flex items-center gap-1.5 font-sans font-semibold",
      variant === "inline" && "px-2 py-0.5 rounded-full text-xs tracking-wide",
      variant === "card" && "px-3 py-2 rounded-md text-sm border-l-2",
      href && "cursor-pointer",
    );

    const cardStyle: React.CSSProperties =
      variant === "card"
        ? c2
          ? {
              // Hybrid: gradient border-left simulated via background-image on the border side
              borderColor: "transparent",
              borderLeftColor: "transparent",
              borderImage: `linear-gradient(180deg, ${c} 0%, ${c2} 100%) 1`,
              backgroundColor: `color-mix(in srgb, ${c} 6%, color-mix(in srgb, ${c2} 6%, transparent))`,
              transition: COLOR_TRANSITION,
            }
          : {
              borderColor: c,
              backgroundColor: `color-mix(in srgb, ${c} 8%, transparent)`,
              transition: COLOR_TRANSITION,
            }
        : {};

    const hoverHandlers = href
      ? {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        }
      : {};

    const inner = (
      <>
        {/* card variant with iconName: show faction icon instead of dot */}
        {variant === "card" && iconName ? (
          <Icon
            name={iconName}
            size={14}
            style={{
              color: disrupting ? cMuted : c,
              flexShrink: 0,
              transition: COLOR_TRANSITION,
            }}
            aria-hidden="true"
          />
        ) : c2 ? (
          // Hybrid: diagonal split dot
          <span
            className={cn("shrink-0 rounded-full block", disrupting ? "w-1.5 h-1.5" : "w-2 h-2")}
            style={{
              background: `linear-gradient(135deg, ${c} 50%, ${c2} 50%)`,
              transition: COLOR_TRANSITION,
            }}
            aria-hidden="true"
          />
        ) : (
          <span
            className={cn("shrink-0 rounded-full block", disrupting ? "w-1.5 h-1.5" : "w-2 h-2")}
            style={{ backgroundColor: c, transition: COLOR_TRANSITION }}
            aria-hidden="true"
          />
        )}
        {c2 ? (
          <>
            {parentFactionName && (
              <span className="text-text-subtle font-normal" style={{ transition: COLOR_TRANSITION }}>
                {parentFactionName} {"\u203a"}{" "}
              </span>
            )}
            <span
              style={{
                // Always use base palette for gradient — hover uses filter:brightness below
                background: `linear-gradient(135deg, ${FACTION_COLOR_VARS[color]} 30%, ${FACTION_COLOR_VARS[secondaryColor!]} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                // filter:brightness transitions smoothly — unlike gradient/color on clipped text
                filter: href && hovered ? "brightness(1.35)" : "brightness(1)",
                transition: "filter 180ms ease",
              }}
            >
              {factionName}
            </span>
          </>
        ) : (
          <span style={{ color: c, transition: COLOR_TRANSITION }}>
            {parentFactionName && (
              <span className="text-text-subtle font-normal">
                {parentFactionName} {"\u203a"}{" "}
              </span>
            )}
            {factionName}
          </span>
        )}
        {disrupting && (
          <Icon name="zap" size={10} style={{ color: cMuted, transition: COLOR_TRANSITION }} />
        )}
      </>
    );

    return (
      <div ref={ref} className={cn("inline-flex font-sans", className)} {...props}>
        {href ? (
          <RouterLink
            to={href}
            className={cn(innerCls, "no-underline")}
            style={cardStyle}
            {...hoverHandlers}
          >
            {inner}
          </RouterLink>
        ) : (
          <span className={innerCls} style={cardStyle} {...hoverHandlers}>
            {inner}
          </span>
        )}
      </div>
    );
  },
);
FactionBadge.displayName = "FactionBadge";
