import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";
import { cn } from "./utils";
import type { Theme } from "./Theme";
import type { FactionColor } from "./FactionBadge";
import { FACTION_COLOR_VARS } from "./FactionBadge";

export type { FactionColor } from "./FactionBadge";

export interface EntityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Entity display name */
  name: string;
  /** Secondary line — faction ethos or NPC role */
  subtitle?: string;
  /** Optional image URL (portrait or emblem) */
  imageUrl?: string;
  /**
   * Faction icon shown centered in the header zone when no imageUrl is provided.
   * For the three main factions: flame (Tuhkan puolue), cog (KW-konsortio), drama (Ekklesia).
   */
  iconName?: IconName;
  /** Faction color identity — used for header gradient and accent stripe */
  color?: FactionColor;
  /** Overlay badge in the card header (e.g. parent faction name) */
  parentLabel?: string;
  /**
   * faction: wider header with ghost initial letter — for main/sub faction cards.
   * npc: slightly shorter header — for NPC portrait cards.
   */
  variant?: "faction" | "npc";
  /** Navigation href — makes the whole card a stretched RouterLink */
  href?: string;
  /** Theme override */
  theme?: Theme;
}

/**
 * Identity card for factions and NPCs. Renders a color-coded visual header zone
 * (image or ghost-initial placeholder), entity name, subtitle, and optional
 * parent-faction overlay badge. When href is provided the card is fully clickable
 * via a stretched RouterLink that sits above the background but below interactive children.
 *
 * @summary faction/NPC identity card; color header; stretched RouterLink when href set; faction/npc variants
 */
export const EntityCard = React.forwardRef<HTMLDivElement, EntityCardProps>(
  (
    {
      name,
      subtitle,
      imageUrl,
      iconName,
      color = "secondary",
      parentLabel,
      variant = "faction",
      href,
      theme,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const c = FACTION_COLOR_VARS[color];
    const headerCls = variant === "npc" ? "h-20" : "h-24";

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "font-sans rounded-xl overflow-hidden relative group",
          "border-2 border-[var(--theme-border-soft)] bg-[var(--theme-bg)] text-[var(--theme-text)] shadow-md",
          href && [
            "cursor-pointer transition-all duration-500 ease-in",
            "hover:shadow-[0_0_20px_color-mix(in_srgb,var(--theme-secondary)_25%,transparent)]",
            "hover:-translate-y-1 hover:border-[var(--theme-border-medium)] hover:duration-300 hover:ease-out",
            "active:translate-y-0 active:shadow-sm active:duration-75",
          ],
          className,
        )}
        {...props}
      >
        {/* Stretched link — covers the whole card; sits above background but below any interactive children */}
        {href && (
          <RouterLink
            to={href}
            className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2"
            aria-label={name}
            tabIndex={0}
          />
        )}

        {/* Color header zone */}
        <div
          className={cn("relative overflow-hidden", headerCls)}
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${c} 18%, transparent), color-mix(in srgb, ${c} 6%, transparent))`,
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ opacity: 0.65 }}
            />
          ) : (
            <>
              {/* Ghost initial — always present as a faint background glyph */}
              <div
                className="absolute inset-0 flex items-end justify-end p-2 select-none"
                aria-hidden="true"
              >
                <span
                  className="font-heading font-black leading-none"
                  style={{ fontSize: "5rem", color: c, opacity: 0.08 }}
                >
                  {name.charAt(0)}
                </span>
              </div>
              {/* Faction icon — centered, prominent when provided */}
              {iconName && (
                <div
                  className="absolute inset-0 flex items-center justify-center select-none"
                  aria-hidden="true"
                >
                  <Icon
                    name={iconName}
                    size={variant === "npc" ? 28 : 36}
                    style={{ color: c, opacity: 0.45 }}
                  />
                </div>
              )}
            </>
          )}

          {/* Bottom accent stripe */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ backgroundColor: c, opacity: 0.5 }}
          />

          {/* Parent faction overlay badge */}
          {parentLabel && (
            <div
              className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider font-sans"
              style={{
                border: `1px solid ${c}`,
                color: c,
                backgroundColor: `color-mix(in srgb, ${c} 14%, transparent)`,
              }}
            >
              {parentLabel}
            </div>
          )}
        </div>

        {/* Content area */}
        <HeadingLevelProvider>
          <div className="p-4 flex flex-col gap-1.5">
            <Heading className="font-bold leading-tight">{name}</Heading>
            {subtitle && <Text variant="body">{subtitle}</Text>}
            {children}
          </div>
        </HeadingLevelProvider>
      </div>
    );
  },
);
EntityCard.displayName = "EntityCard";
