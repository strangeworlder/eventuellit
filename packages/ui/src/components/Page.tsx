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

export interface PageAsideProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** When true, sticks to the top on desktop so it stays in view while scrolling */
  sticky?: boolean;
}

/**
 * PageAside is a semantic sidebar companion to PageBody.
 * Place it as a sibling to the main content inside a PageBody grid.
 *
 * @example
 * ```tsx
 * <PageBody className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8">
 *   <div>...main content...</div>
 *   <PageAside sticky>...sidebar content...</PageAside>
 * </PageBody>
 * ```
 */
export function PageAside({ children, sticky, className, ...props }: PageAsideProps) {
  return (
    <aside
      className={cn(
        "space-y-8 pt-6",
        sticky && "desktop:sticky desktop:top-0 desktop:self-start",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
