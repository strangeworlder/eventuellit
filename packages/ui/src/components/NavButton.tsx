import * as React from "react";
import { Button, type ButtonProps } from "./Button";
import { cn } from "./utils";

export interface NavButtonProps extends ButtonProps {
  /** When true, renders a small primary-color dot to indicate pending notifications. */
  showBadge?: boolean;
}

/**
 * Navigation button with optional notification badge. Extends `Button` with a
 * small attention dot for indicating actionable items. Use in sidebars, nav
 * rails, or any navigation context where badge state is needed.
 *
 * @summary navigation button with optional notification dot; extends Button
 */
export const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ showBadge = false, className, children, ...props }, ref) => {
    return (
      <span className="relative inline-flex w-full">
        <Button ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </Button>
        {showBadge && (
          <output className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="sr-only">Ilmoitus</span>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--theme-primary)] opacity-50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--theme-primary)] shadow-sm" />
          </output>
        )}
      </span>
    );
  },
);
NavButton.displayName = "NavButton";
