import React from "react";
import { HeadingLevelContext } from "./Heading";
import { Stack } from "./Layout";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface UtilityPageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Theme override */
  theme?: Theme;
}

/**
 * Centered viewport layout for utility pages (login, verify, error, etc.).
 * Sets heading context to h1. Content is vertically and horizontally centered
 * with a constrained width and entry animation. Use instead of Page + Hero
 * when the page is a single-purpose interaction, not a content page.
 *
 * @summary centered utility page layout (login, verify, error); sets h1 context; max-w-md
 */
export const UtilityPage = React.forwardRef<HTMLDivElement, UtilityPageProps>(
  ({ children, className, theme, ...props }, ref) => {
    return (
      <HeadingLevelContext.Provider value={1}>
        <div
          ref={ref}
          data-theme={theme}
          className={cn(
            "flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 bg-[var(--theme-bg)] text-[var(--theme-text)] animate-in fade-in slide-in-from-bottom-8 duration-700",
            className,
          )}
          {...props}
        >
          <Stack gap={8} align="center" className="w-full max-w-md">
            {children}
          </Stack>
        </div>
      </HeadingLevelContext.Provider>
    );
  },
);
UtilityPage.displayName = "UtilityPage";
