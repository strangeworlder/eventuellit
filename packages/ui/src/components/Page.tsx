import type React from "react";
import { HeadingLevelContext } from "./Heading";
import { cn } from "./utils";

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  theme?: string;
}

/**
 * Page component serves as a layout wrapper for the main content areas within TabsContent.
 * Enforces standardized max-width, min-width, and centering.
 */
export function Page({ children, className, theme, ...props }: PageProps) {
  return (
    <HeadingLevelContext.Provider value={1}>
      <div
        data-theme={theme}
        className={cn(
          "w-full max-w-[1280px] mx-auto animate-in fade-in duration-500 bg-[var(--theme-bg)] text-[var(--theme-text)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </HeadingLevelContext.Provider>
  );
}

export interface PageBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * PageBody provides standardized padding, spacing, and fade-in animation for
 * the main content area below Hero within a Page. Use this instead of manually
 * applying `px-4 space-y-8 animate-in fade-in` on wrapper divs.
 */
export function PageBody({ children, className, ...props }: PageBodyProps) {
  return (
    <div
      className={cn(
        "px-4 tablet:px-0 pt-6 tablet:pt-8 space-y-8 pb-16 animate-in fade-in duration-500",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
