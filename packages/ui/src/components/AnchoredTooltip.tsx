import React from "react";

import { cn } from "./utils";
import type { Theme } from "./Theme";

export type AnchoredTooltipPlacement =
  | "right"
  | "left"
  | "top"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";
export type AnchoredTooltipVariant = "default" | "button-loading" | "station-description";

/**
 * CSS-anchor-positioned tooltip that attaches to a trigger element via the `anchor-name` CSS property.
 * Use for hover descriptions, station node labels on the game board, and loading-state tooltips on Buttons.
 *
 * @summary CSS-anchor tooltip; placement: right/left/top/bottom variants; pairs with anchor-name on trigger
 */
export interface AnchoredTooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Sijainti ankkurielementin suhteen */
  placement?: AnchoredTooltipPlacement;
  /** Visual variant for contextual tooltip presentation. */
  variant?: AnchoredTooltipVariant;
  /** The theme context to apply, which modifies the component's CSS variables. */
  theme?: Theme;
  /** Explicitly control visibility (ignores hover CSS if provided) */
  isOpen?: boolean;
  /**
   * CSS anchor name of the trigger element (e.g. `--station-node-N`).
   * When provided, uses CSS Anchor Positioning (`anchor(center)` etc.) for
   * exact centering instead of transform-based hacks. The trigger element must
   * have a matching `anchor-name` CSS property set.
   */
  anchorName?: string;
}

/* ── Placement: fallback position classes (used when anchorName is NOT provided) ── */

const placementBase: Record<AnchoredTooltipPlacement, string> = {
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  "bottom-left": "top-full right-0 mt-2",
  "bottom-right": "top-full left-0 mt-2",
  "top-left": "bottom-full right-0 mb-2",
  "top-right": "bottom-full left-0 mb-2",
};

/**
 * Spacing-only classes used alongside CSS Anchor Positioning inline styles.
 * These only supply the margin gap; all inset values come from `anchor()`.
 */
const anchorPlacementBase: Record<AnchoredTooltipPlacement, string> = {
  right: "ml-2",
  left: "mr-2",
  top: "mb-2",
  bottom: "mt-2",
  "bottom-left": "mt-2",
  "bottom-right": "mt-2",
  "top-left": "mb-2",
  "top-right": "mb-2",
};

/**
 * Returns inline CSS styles that use CSS Anchor Positioning (`anchor()`) for
 * precise, transform-free placement. `anchor(center)` ensures cardinal
 * directions are correctly centred without any translate that would be
 * accidentally reset by group-hover utilities.
 *
 * `w-52` (13 rem = 208 px) is baked into `left: calc(anchor(center) - 6.5rem)`
 * for top/bottom, matching the `station-description` variant width.
 */
function anchorPositionStyle(
  placement: AnchoredTooltipPlacement,
  anchorName: string,
): React.CSSProperties {
  // position-anchor is not yet in React.CSSProperties; we cast at the call site.
  const pa = { positionAnchor: anchorName };
  switch (placement) {
    // Below, centred on anchor's horizontal midpoint
    case "bottom":
      return { ...pa, top: "anchor(bottom)", left: "calc(anchor(center) - 6.5rem)" } as React.CSSProperties;
    // Above, centred on anchor's horizontal midpoint
    case "top":
      return { ...pa, bottom: "anchor(top)", left: "calc(anchor(center) - 6.5rem)" } as React.CSSProperties;
    // Right of anchor, centred on its vertical midpoint.
    // translateY uses CSS `transform` (not Tailwind `translate`) so the
    // group-hover translate-y-0 reset cannot interfere.
    case "right":
      return { ...pa, left: "anchor(right)", top: "anchor(center)", transform: "translateY(-50%)" } as React.CSSProperties;
    // Left of anchor, centred on its vertical midpoint
    case "left":
      return { ...pa, right: "anchor(left)", top: "anchor(center)", transform: "translateY(-50%)" } as React.CSSProperties;
    // Below, right edge of tooltip aligned to right edge of anchor
    case "bottom-left":
      return { ...pa, top: "anchor(bottom)", right: "anchor(right)" } as React.CSSProperties;
    // Below, left edge of tooltip aligned to left edge of anchor
    case "bottom-right":
      return { ...pa, top: "anchor(bottom)", left: "anchor(left)" } as React.CSSProperties;
    // Above, right edge of tooltip aligned to right edge of anchor
    case "top-left":
      return { ...pa, bottom: "anchor(top)", right: "anchor(right)" } as React.CSSProperties;
    // Above, left edge of tooltip aligned to left edge of anchor
    case "top-right":
      return { ...pa, bottom: "anchor(top)", left: "anchor(left)" } as React.CSSProperties;
  }
}

/** Extra transform applied when the tooltip is *hidden* – resolves to none on show. */
const placementHiddenShift: Record<AnchoredTooltipPlacement, string> = {
  right: "translate-x-1.5",
  left: "-translate-x-1.5",
  top: "-translate-y-1.5",
  bottom: "translate-y-1.5",
  "bottom-left": "translate-y-1.5",
  "bottom-right": "translate-y-1.5",
  "top-left": "-translate-y-1.5",
  "top-right": "-translate-y-1.5",
};

/* ── Variant styles (aligned with AspectTag aesthetic) ── */

const variantClasses: Record<AnchoredTooltipVariant, string> = {
  default: [
    "rounded-md px-3 py-1.5",
    "font-heading text-xs font-bold uppercase tracking-wider",
    "bg-[var(--theme-bg)]/95 text-[var(--theme-text)]",
    "border border-[var(--theme-border-soft)]",
    "shadow-[0_0_10px_color-mix(in_srgb,var(--theme-secondary)_12%,transparent),inset_0_-1px_0_color-mix(in_srgb,var(--theme-secondary)_10%,transparent)]",
  ].join(" "),

  "button-loading": [
    "rounded-md px-3 py-2",
    "font-heading text-xs font-bold uppercase tracking-widest",
    "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]",
    "border-2 border-[var(--theme-primary-foreground)]",
    "shadow-[0_0_14px_color-mix(in_srgb,var(--theme-primary)_30%,transparent),inset_0_-1px_0_color-mix(in_srgb,var(--theme-primary-foreground)_15%,transparent)]",
  ].join(" "),

  "station-description": [
    "rounded-lg px-3 py-3 w-52 leading-relaxed whitespace-normal",
    "font-heading text-xs font-medium tracking-wide",
    "bg-[var(--theme-bg)]/98 text-[var(--theme-text)]",
    "border border-[var(--theme-border-soft)]",
    "shadow-[0_4px_20px_color-mix(in_srgb,var(--theme-bg)_40%,transparent),inset_0_-1px_0_color-mix(in_srgb,var(--theme-secondary)_8%,transparent)]",
  ].join(" "),
};

/**
 * CSS Anchor Positioned tooltip.
 *
 * **Basic usage** (sibling-based, parent gets `anchor-scope` via `:has()`):
 * Place as a direct next sibling of the trigger element. The parent element
 * automatically receives `anchor-scope` and the previous sibling receives
 * `anchor-name` via `:has()` CSS rules defined in `styles.css`.
 *
 * **Explicit anchor** (`anchorName` prop):
 * Set `anchor-name` on the trigger via inline style and pass the same name as
 * `anchorName`. This enables `anchor(center)` centering that is immune to the
 * group-hover translate reset.
 *
 * @example
 * ```tsx
 * // Sibling pattern
 * <div>
 *   <button>Hover</button>
 *   <AnchoredTooltip placement="right">Lisätietoja</AnchoredTooltip>
 * </div>
 *
 * // Explicit anchor pattern
 * <button style={{ anchorName: "--my-btn" } as CSSProperties}>Hover</button>
 * <AnchoredTooltip anchorName="--my-btn" placement="bottom">Info</AnchoredTooltip>
 * ```
 */
export const AnchoredTooltip = React.forwardRef<HTMLSpanElement, AnchoredTooltipProps>(
  ({ placement = "right", variant = "default", className, theme, isOpen, anchorName, style, children, ...props }, ref) => {
    if (isOpen === false) return null;

    const hidden = isOpen !== undefined
      ? !isOpen
      : true; // uncontrolled: hidden by default, shown via group-hover

    const useAnchor = !!anchorName;
    const positionClasses = useAnchor
      ? anchorPlacementBase[placement]
      : placementBase[placement];
    const anchorStyle = useAnchor
      ? anchorPositionStyle(placement, anchorName!)
      : undefined;

    return (
      <span
        ref={ref}
        role="tooltip"
        data-theme={theme}
        style={{ ...anchorStyle, ...style }}
        className={cn(
          // ── Base ──
          "anchored-tooltip absolute z-50 select-none",
          "transition-all",
          // ── Asymmetric timing: snappy enter, gentle exit ──
          hidden
            ? "duration-200 ease-in"    // exit: gentle fade-out
            : "duration-150 ease-out",  // enter: snappy pop-in
          variantClasses[variant],
          positionClasses,

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
