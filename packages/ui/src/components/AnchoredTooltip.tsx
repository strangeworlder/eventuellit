import React from "react";

import { cn } from "./Heading";
import type { Theme } from "./Theme";

export type AnchoredTooltipPlacement = "right" | "left" | "top" | "bottom";
export type AnchoredTooltipVariant = "default" | "button-loading";

export interface AnchoredTooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Sijainti ankkurielementin suhteen */
  placement?: AnchoredTooltipPlacement;
  /** Visual variant for contextual tooltip presentation. */
  variant?: AnchoredTooltipVariant;
  /** The theme context to apply, which modifies the component's CSS variables. */
  theme?: Theme;
}

const placementClasses: Record<AnchoredTooltipPlacement, string> = {
  right: "[left:anchor(right)] [top:anchor(center)] -translate-y-1/2",
  left: "[right:anchor(left)] [top:anchor(center)] -translate-y-1/2",
  top: "[left:anchor(center)] [bottom:anchor(top)] -translate-x-1/2",
  bottom: "[left:anchor(center)] [top:anchor(bottom)] -translate-x-1/2",
};

const variantClasses: Record<AnchoredTooltipVariant, string> = {
  default:
    "rounded-sm bg-[var(--theme-bg)]/95 px-2 py-1 text-[var(--theme-text)] shadow-md border border-[var(--theme-secondary)]/40 font-semibold",
  "button-loading":
    "rounded-sm bg-[var(--theme-primary)] px-3 py-2 text-[var(--theme-primary-foreground)] shadow-md border-2 border-[var(--theme-primary-foreground)]/60 font-bold uppercase tracking-widest",
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
  ({ placement = "right", variant = "default", className, theme, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="tooltip"
        data-theme={theme}
        className={cn(
          "anchored-tooltip",
          "pointer-events-none absolute max-w-xs overflow-hidden text-ellipsis whitespace-nowrap font-sans text-xs font-semibold tracking-[0.015em]",
          variantClasses[variant],
          "opacity-0 transition-opacity duration-150",
          "[position-anchor:--tooltip-anchor]",
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
