import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual style of the code element.
   * - `inline` (default): Inline monospace snippet with a tinted background.
   * - `kbd`: Keyboard shortcut styling with border.
   */
  variant?: "inline" | "kbd";
  /** Theme override */
  theme?: Theme;
}

/**
 * Code renders inline monospace text for code snippets, terminal commands,
 * file paths, and keyboard shortcuts.
 *
 * For block code (multi-line), use the `<pre><code>` pattern directly or
 * the `MarkdownRenderer` which handles fenced code blocks.
 */
export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant = "inline", theme, children, ...props }, ref) => {
    const Component = variant === "kbd" ? "kbd" : "code";

    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        data-theme={theme}
        className={cn(
          "font-mono rounded-sm text-[0.875em] leading-none",
          {
            "bg-[var(--theme-surface-tint)] text-[var(--theme-text)] px-1.5 py-0.5":
              variant === "inline",
            "bg-[var(--theme-surface-tint)] text-[var(--theme-text)] px-1.5 py-0.5 border border-[var(--theme-border-medium)] shadow-[inset_0_-2px_0_var(--theme-border-medium)]":
              variant === "kbd",
          },
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Code.displayName = "Code";
