import React from "react";
import { cn } from "./utils";

export interface ObscuredWrapperProps {
  /** Whether the wrapped content is revealed (interactable) or obscured (blurred). */
  revealed: boolean;
  /** Additional CSS classes to apply to the wrapper element. */
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps content in an obscured overlay that blurs and disables interaction.
 *
 * When `revealed` is `false`, all text elements receive a 5.5px blur and all
 * other elements receive a 1.5px blur.  `pointer-events` and `user-select`
 * are also disabled so the section is completely non-interactable.
 *
 * When `revealed` is `true`, children render normally with zero overhead.
 */
export const ObscuredWrapper = React.forwardRef<HTMLDivElement, ObscuredWrapperProps>(
  ({ revealed, className, children }, ref) => {
    if (revealed) {
      return <>{children}</>;
    }

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("obscured-wrapper", className)}
      >
        {children}
      </div>
    );
  },
);
ObscuredWrapper.displayName = "ObscuredWrapper";
