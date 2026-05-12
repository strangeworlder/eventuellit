import React from "react";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface VotingStandingsItem {
  /** Unique identifier for the ranked option. */
  id: string | number;
  /** Display title of the ranked option. */
  title: string;
}

export interface VotingStandingsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ordered list of results — first item is the current leader. */
  items: VotingStandingsItem[];
  /**
   * Label for the section heading.
   * @default "Tällä hetkellä kärjessä"
   */
  label?: string;
  /**
   * Footer note shown below the rankings.
   * @default "Tulokset päivittyvät reaaliajassa · äänestys on anonyymi"
   */
  footerNote?: string;
  theme?: Theme;
}

// ── Rank visual config ────────────────────────────────────────────────────────
// Mirrors the SelectionCard badge language:
//   1st = alert-triangle + red (--theme-primary)  — critical / primary pick
//   2nd = compass + teal (--theme-secondary)       — backup heading / secondary pick
//   3rd+ = no icon, muted                          — instrument panels fade low-priority rows

interface RankStyle {
  icon?: IconName;
  numeral: string;
  iconColor: string;
  stripe: string | null;
  bgTint: string | null;
  textVariant: "body" | "muted";
  bold: boolean;
}

function getRankStyle(index: number): RankStyle {
  if (index === 0) {
    return {
      icon: "alert-triangle",
      numeral: "text-[var(--theme-primary)]",
      iconColor: "text-[var(--theme-primary)]",
      stripe: "shadow-[inset_3px_0_0_var(--theme-primary)]",
      bgTint: "bg-[color-mix(in_srgb,var(--theme-primary)_5%,transparent)]",
      textVariant: "body",
      bold: true,
    };
  }
  if (index === 1) {
    return {
      icon: "compass",
      numeral: "text-[var(--theme-accent)]",
      iconColor: "text-[var(--theme-accent)]",
      stripe: "shadow-[inset_3px_0_0_var(--theme-accent)]",
      bgTint: "bg-[color-mix(in_srgb,var(--theme-accent)_5%,transparent)]",
      textVariant: "body",
      bold: false,
    };
  }
  return {
    numeral: "text-[var(--theme-text-subtle)]",
    iconColor: "",
    stripe: null,
    bgTint: null,
    textVariant: "muted",
    bold: false,
  };
}

/**
 * Live voting standings panel — an instrument-panel readout of the current
 * ranked mission options. Rank styling mirrors the `SelectionCard` badge
 * language: 1st = alert-triangle / red, 2nd = compass / teal, 3rd+ = muted.
 *
 * @summary ranked voting standings readout; use inside a HeadingLevelProvider context
 */
export const VotingStandings = React.forwardRef<HTMLDivElement, VotingStandingsProps>(
  (
    {
      className,
      items,
      label = "Tällä hetkellä kärjessä",
      footerNote = "Tulokset päivittyvät reaaliajassa · äänestys on anonyymi",
      theme,
      ...props
    },
    ref,
  ) => {
    if (items.length === 0) return null;

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "font-sans rounded-md border border-[var(--theme-border-soft)] bg-[var(--theme-surface-tint)]/20",
          "overflow-hidden",
          className,
        )}
        {...props}
      >
        <HeadingLevelProvider>
          {/* ── Panel header — clean uppercase label, no icon ── */}
          <div className="px-4 py-3 border-b border-[var(--theme-border-soft)]">
            <Heading>
              {label}
            </Heading>
          </div>

          {/* ── Rankings ── */}
          <ol className="divide-y divide-[var(--theme-border-soft)]">
            {items.map((item, index) => {
              const style = getRankStyle(index);
              const rankLabel = `${index + 1}.`;

              return (
                <li
                  key={item.id}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 transition-colors",
                    style.stripe,
                    style.bgTint,
                  )}
                >
                  {/* Rank numeral */}
                  <span
                    className={cn(
                      "font-heading font-black tabular-nums text-sm w-5 shrink-0 leading-none",
                      style.numeral,
                    )}
                    aria-hidden
                  >
                    {rankLabel}
                  </span>

                  {/* Title */}
                  <Text
                    variant={style.textVariant}
                    className={cn(
                      "flex-1 min-w-0 truncate",
                      style.bold && "font-semibold",
                    )}
                  >
                    {item.title}
                  </Text>

                  {/* Rank icon — only 1st and 2nd */}
                  {style.icon && (
                    <Icon
                      name={style.icon}
                      size={13}
                      aria-hidden
                      className={cn("shrink-0", style.iconColor)}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {/* ── Footer note ── */}
          {footerNote && (
            <div className="px-4 py-2 border-t border-[var(--theme-border-soft)]">
              <Text variant="caption" className="uppercase tracking-widest text-[0.6rem]">
                {footerNote}
              </Text>
            </div>
          )}
        </HeadingLevelProvider>
      </div>
    );
  },
);

VotingStandings.displayName = "VotingStandings";
