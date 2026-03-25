import React from "react";
import { cn } from "./utils";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  size?: "default" | "large";
  layout?: "inline" | "padded";
}

/**
 * Standardized full-area loading label for async states across applications.
 * Use for full-page or full-section loading. For inline element placeholders use Skeleton.
 *
 * @summary full-area loading label with pulse animation; for element-level placeholders use Skeleton
 */
export const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, message, size = "default", layout = "inline", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-[var(--theme-primary)] animate-pulse uppercase tracking-widest font-black",
        {
          "text-xl": size === "default",
          "text-2xl": size === "large",
          "p-8": layout === "padded",
        },
        className,
      )}
      {...props}
    >
      {message}
    </div>
  ),
);

LoadingState.displayName = "LoadingState";
