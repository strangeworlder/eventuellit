import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { twMerge } from "tailwind-merge";
import { HeadingLevelContext } from "./Heading";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
          "w-full max-w-[1280px] mx-auto space-y-4 tablet:space-y-8 animate-in fade-in duration-500 bg-[var(--theme-bg)] text-[var(--theme-text)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </HeadingLevelContext.Provider>
  );
}
