import React from "react";

import { cn } from "./utils";
import type { Theme } from "./Theme";

export type AnchoredTooltipPlacement = "right" | "left" | "top" | "bottom";
export type AnchoredTooltipVariant = "default" | "button-loading" | "station-description";

export interface AnchoredTooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Sijainti ankkurielementin suhteen */
  placement?: AnchoredTooltipPlacement;
  /** Visual variant for contextual tooltip presentation. */
  variant?: AnchoredTooltipVariant;
  /** The theme context to apply, which modifies the component's CSS variables. */
  theme?: Theme;
  /** Explicitly control visibility (ignores hover CSS if provided) */
  isOpen?: boolean;
}

/* ── Placement: position + slide-in origin ── */

const placementBase: Record<AnchoredTooltipPlacement, string> = {
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
};

/** Extra transform applied when the tooltip is *hidden* – resolves to none on show. */
const placementHiddenShift: Record<AnchoredTooltipPlacement, string> = {
  right: "translate-x-1.5",
  left: "-translate-x-1.5",
  top: "-translate-y-1.5",
  bottom: "translate-y-1.5",
};

/* ── Variant styles (aligned with AspectTag aesthetic) ── */

const variantClasses: Record<AnchoredTooltipVariant, string> = {
  default: [
    "rounded-md px-3 py-1.5",
    "font-heading text-xs font-bold uppercase tracking-wider",
    "bg-[var(--theme-bg)]/95 text-[var(--theme-text)]",
    "border border-[var(--theme-secondary)]/30",
    "shadow-[0_0_10px_color-mix(in_srgb,var(--theme-secondary)_12%,transparent),inset_0_-1px_0_color-mix(in_srgb,var(--theme-secondary)_10%,transparent)]",
  ].join(" "),

  "button-loading": [
    "rounded-md px-3 py-2",
    "font-heading text-xs font-bold uppercase tracking-widest",
    "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]",
    "border-2 border-[var(--theme-primary-foreground)]/50",
    "shadow-[0_0_14px_color-mix(in_srgb,var(--theme-primary)_30%,transparent),inset_0_-1px_0_color-mix(in_srgb,var(--theme-primary-foreground)_15%,transparent)]",
  ].join(" "),

  "station-description": [
    "rounded-lg px-3 py-3 w-52 leading-relaxed whitespace-normal",
    "font-heading text-xs font-medium tracking-wide",
    "bg-[var(--theme-bg)]/98 text-[var(--theme-text)]/80",
    "border border-[var(--theme-secondary)]/25",
    "shadow-[0_4px_20px_color-mix(in_srgb,var(--theme-bg)_40%,transparent),inset_0_-1px_0_color-mix(in_srgb,var(--theme-secondary)_8%,transparent)]",
  ].join(" "),
};

/**
 * CSS Anchor Positioned tooltip that auto-binds to its previous sibling.
 *
 * Place as a direct next sibling of the element you want to anchor to.
 * The parent element automatically receives `anchor-scope` and the
 * previous sibling receives `anchor-name` via `:has()` CSS rules
 * defined in `styles.css`. The tooltip appears on hover / focus-visible
 * of the previous sibling.
 *
 * @example
 * ```tsx
 * <div>
 *   <button>Hover</button>
 *   <AnchoredTooltip placement="right">Lisätietoja</AnchoredTooltip>
 * </div>
 * ```
 */
export const AnchoredTooltip = React.forwardRef<HTMLSpanElement, AnchoredTooltipProps>(
  ({ placement = "right", variant = "default", className, theme, isOpen, children, ...props }, ref) => {
    if (isOpen === false) return null;

    const hidden = isOpen !== undefined
      ? !isOpen
      : true; // uncontrolled: hidden by default, shown via group-hover

    return (
      <span
        ref={ref}
        role="tooltip"
        data-theme={theme}
        className={cn(
          // ── Base ──
          "anchored-tooltip absolute z-50 select-none",
          "transition-all",
          // ── Asymmetric timing: snappy enter, gentle exit ──
          hidden
            ? "duration-200 ease-in"    // exit: gentle fade-out
            : "duration-150 ease-out",  // enter: snappy pop-in
          variantClasses[variant],
          placementBase[placement],

          // ── Hidden / visible states ──
          hidden && placementHiddenShift[placement],
          hidden && "scale-95",

          isOpen !== undefined
            ? isOpen
              ? "opacity-100 visible pointer-events-auto scale-100"
              : "opacity-0 invisible pointer-events-none"
            : cn(
                "opacity-0 invisible pointer-events-none",
                "group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:scale-100 group-hover:translate-x-0 group-hover:translate-y-0",
                "group-hover:duration-150 group-hover:ease-out",
                "group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:translate-x-0 group-focus-within:translate-y-0",
                "group-focus-within:duration-150 group-focus-within:ease-out",
              ),

          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

AnchoredTooltip.displayName = "AnchoredTooltip";
