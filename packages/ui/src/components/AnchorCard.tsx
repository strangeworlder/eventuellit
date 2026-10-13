import React from "react";
import type { AnchorCard as AnchorCardData } from "../data/anchors";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { useObscured } from "./ObscuredWrapper";
import { type Theme, useCurrentTheme } from "./Theme";
import { cn, obscureString } from "./utils";

export interface AnchorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The anchor card data containing name, polarities, and description */
  anchor: AnchorCardData;
  /** Whether this card is currently selected */
  selected?: boolean;
  /** Callback fired when the card or select button is clicked */
  onSelect?: () => void;
  /** Custom selection button label (defaults to "Valitse ankkuri") */
  selectLabel?: string;
  /** Whether to render a compact inline view */
  compact?: boolean;
  /** Additional action elements rendered in the card header/footer */
  actions?: React.ReactNode;
  /** Theme context override */
  theme?: Theme;
  /** When true, blurs and disables the card with an obscured visual effect */
  obscured?: boolean;
}

/**
 * Organism representing a player-specific Anchor skill with dual operational polarities.
 * Features side-by-side (rinnakkain) presentation of its two opposing operational polarities.
 * Supports obscured mode for unrevealed or hidden content.
 *
 * @summary Anchor card display with side-by-side dual polarities
 */
export const AnchorCard = React.forwardRef<HTMLDivElement, AnchorCardProps>(
  (
    {
      className,
      anchor,
      selected = false,
      onSelect,
      selectLabel = "Valitse ankkuri",
      compact = false,
      actions,
      theme,
      obscured: obscuredProp,
      ...props
    },
    ref,
  ) => {
    const parentTheme = useCurrentTheme();
    const effectiveTheme = theme ?? parentTheme;
    const contextObscured = useObscured();
    const isObscured = Boolean(obscuredProp || contextObscured);

    return (
      <div
        ref={ref}
        data-theme={effectiveTheme}
        aria-hidden={isObscured ? "true" : undefined}
        className={cn(
          "font-sans rounded-md border transition-all duration-200",
          "bg-[var(--theme-surface)]",
          selected
            ? "border-[var(--theme-primary)] shadow-[0_0_16px_color-mix(in_srgb,var(--theme-primary)_35%,transparent)] ring-1 ring-[var(--theme-primary)]"
            : "border-[var(--theme-border-medium)] shadow-sm hover:border-[var(--theme-primary)]/60 hover:shadow-[0_0_12px_color-mix(in_srgb,var(--theme-primary)_20%,transparent)]",
          isObscured && "obscured-wrapper select-none pointer-events-none",
          className,
        )}
        {...props}
      >
        {/* ── Card Header ── */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--theme-border-soft)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={cn(
                "inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                selected
                  ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]"
                  : "bg-[var(--theme-primary)]/15 text-[var(--theme-primary)]",
              )}
            >
              <Icon name="anchor" size={16} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base tablet:text-lg font-bold tracking-wide uppercase text-[var(--theme-text)] truncate">
                  {isObscured ? obscureString(anchor.name) : anchor.name}
                </h3>
                <Badge variant="outline">Ankkuri</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {actions}
            {onSelect && (
              <Button
                variant={selected ? "solid" : "outline"}
                size="sm"
                disabled={isObscured}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              >
                {selected ? "Valittu" : selectLabel}
              </Button>
            )}
          </div>
        </div>

        {/* ── Card Body ── */}
        <div className="p-4 space-y-4">
          {!compact && anchor.description && (
            <p className="text-sm text-text-muted leading-relaxed italic border-l-2 border-[var(--theme-border-medium)] pl-3">
              {isObscured ? obscureString(anchor.description) : anchor.description}
            </p>
          )}

          {/* ── Side-by-side Dual Polarities (Rinnakkain) ── */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 pt-1">
            {/* Polarity A */}
            <div
              className={cn(
                "rounded-md p-3.5 space-y-1.5 transition-colors border",
                "bg-[var(--theme-primary)]/8 border-[var(--theme-border-soft)] border-l-[3px] border-l-[var(--theme-primary)]",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
                  {isObscured ? obscureString(anchor.polarityA.title) : anchor.polarityA.title}
                </span>
              </div>
              <p className="text-sm text-[var(--theme-text)] leading-snug">
                {isObscured
                  ? obscureString(anchor.polarityA.description)
                  : anchor.polarityA.description}
              </p>
            </div>

            {/* Polarity B */}
            <div
              className={cn(
                "rounded-md p-3.5 space-y-1.5 transition-colors border",
                "bg-[var(--theme-secondary)]/8 border-[var(--theme-border-soft)] border-l-[3px] border-l-[var(--theme-secondary)]",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-secondary)]" />
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--theme-secondary)]">
                  {isObscured ? obscureString(anchor.polarityB.title) : anchor.polarityB.title}
                </span>
              </div>
              <p className="text-sm text-[var(--theme-text)] leading-snug">
                {isObscured
                  ? obscureString(anchor.polarityB.description)
                  : anchor.polarityB.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

AnchorCard.displayName = "AnchorCard";
