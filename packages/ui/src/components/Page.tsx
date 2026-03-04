import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { twMerge } from "tailwind-merge";
import { HeadingLevelContext } from "./Heading";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * Page component serves as a layout wrapper for the main content areas within TabsContent.
 * Enforces standardized max-width, min-width, and centering.
 */
export function Page({ children, className, ...props }: PageProps) {
  return (
    <HeadingLevelContext.Provider value={1}>
      <div
        className={cn(
          "w-full max-w-[1280px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </HeadingLevelContext.Provider>
  );
}
