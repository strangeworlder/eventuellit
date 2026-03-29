import React from "react";
import { cn } from "./utils";

const ObscuredContext = React.createContext(false);

/**
 * Hook that returns `true` when the nearest ancestor `ObscuredWrapper`
 * has `revealed={false}`.  Components can use this to self-obscure
 * regardless of nesting depth.
 */
export function useObscured() {
  return React.useContext(ObscuredContext);
}

export interface ObscuredWrapperProps {
  /** Whether the wrapped content is revealed (interactable) or obscured (blurred). */
  revealed: boolean;
  /** Additional CSS classes to apply to the wrapper element. */
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps content in an obscured overlay that blurs and disables interaction.
 * Use for hidden game content that requires a reveal action (e.g. locked lore, GM-only info).
 *
 * When `revealed` is `false`, all text elements receive a 5.5px blur and all
 * other elements receive a 1.5px blur.  `pointer-events` and `user-select`
 * are also disabled so the section is completely non-interactable.
 *
 * A visually-hidden `<span>` announces "Sisältö piilotettu" to screen readers,
 *
 * @summary blur/disable wrapper for hidden content; set revealed={false} to obscure, true to reveal
 * while the blurred visual tree is hidden from AT via `aria-hidden`.
 *
 * Child components that call `useObscured()` will automatically receive the
 * obscured state regardless of nesting depth.
 *
 * When `revealed` is `true`, children render normally with zero overhead.
 */
export const ObscuredWrapper = React.forwardRef<HTMLDivElement, ObscuredWrapperProps>(
  ({ revealed, className, children }, ref) => {
    if (revealed) {
      return <>{children}</>;
    }

    return (
      <ObscuredContext.Provider value={true}>
        {/* Screen-reader announcement: tells AT the section is intentionally hidden */}
        <span className="sr-only">Sisältö piilotettu</span>
        <div ref={ref} aria-hidden="true" className={cn("obscured-wrapper", className)}>
          {children}
        </div>
      </ObscuredContext.Provider>
    );
  },
);
ObscuredWrapper.displayName = "ObscuredWrapper";
