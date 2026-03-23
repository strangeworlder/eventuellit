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

const placementClasses: Record<AnchoredTooltipPlacement, string> = {
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
};

const variantClasses: Record<AnchoredTooltipVariant, string> = {
  default:
    "rounded-sm bg-[var(--theme-bg)]/95 px-2 py-1 text-[var(--theme-text)] shadow-md border border-[var(--theme-secondary)]/40 font-semibold",
  "button-loading":
    "rounded-sm bg-[var(--theme-primary)] px-3 py-2 text-[var(--theme-primary-foreground)] shadow-md border-2 border-[var(--theme-primary-foreground)]/60 font-bold uppercase tracking-widest",
  "station-description":
    "rounded-lg bg-[var(--theme-bg)]/98 px-3 py-3 text-[var(--theme-text)]/80 shadow-xl border border-[var(--theme-secondary)]/30 font-normal whitespace-normal w-52 leading-relaxed",
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

    return (
      <span
        ref={ref}
        role="tooltip"
        data-theme={theme}
        className={cn(
          "anchored-tooltip absolute font-sans text-xs tracking-[0.015em] z-50",
          variantClasses[variant],
          // If controlled, strictly use isOpen boolean. If uncontrolled, use group-hover for CSS-only tooltips.
          isOpen !== undefined
            ? isOpen
              ? "opacity-100 visible pointer-events-auto"
              : "opacity-0 invisible pointer-events-none"
            : "opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto",
          placementClasses[placement],
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
