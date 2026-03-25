import React from "react";
import { cn } from "./utils";
import type { Theme } from "./Theme";

/**
 * Shimmer loading placeholder for known-shape elements. Prefer this over `LoadingState`
 * for partial/inline updates. `SkeletonText` and `SkeletonCard` are convenience wrappers.
 *
 * @summary shimmer loading placeholder; variant: block/circle/text; use LoadingState for full-area loading
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual shape variant.
   * - `block` (default): Rectangular block for text lines, cards, and general content.
   * - `circle`: Circular shape for avatars and icon placeholders.
   * - `text`: Narrower, shorter block styled for inline text lines.
   */
  variant?: "block" | "circle" | "text";
  /** Height override. Useful for block skeletons representing known-height elements. */
  height?: string | number;
  /** Width override. */
  width?: string | number;
  /** Theme override */
  theme?: Theme;
}

/**
 * Skeleton is a loading placeholder that maintains layout shape while content loads.
 * It uses a theme-aware shimmer animation driven by CSS variables.
 * Use in place of actual content during async data fetches.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "block", height, width, theme, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        aria-hidden="true"
        className={cn(
          "animate-pulse bg-[var(--theme-surface-tint)]",
          {
            "rounded-sm": variant === "block",
            "rounded-full": variant === "circle",
            "rounded-sm h-4 w-full max-w-[80%]": variant === "text",
          },
          className,
        )}
        style={{
          height: variant !== "text" ? height : undefined,
          width: variant !== "text" ? width : undefined,
          aspectRatio: variant === "circle" && !height && !width ? "1" : undefined,
          ...style,
        }}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

// ── Skeleton compositions ──

export interface SkeletonTextProps {
  /** Number of text lines to render */
  lines?: number;
  /** Whether the last line is shorter (typical paragraph ending) */
  lastLineShort?: boolean;
  className?: string;
}

/**
 * A block of skeleton text lines, mimicking a paragraph of loading body copy.
 */
export function SkeletonText({
  lines = 3,
  lastLineShort = true,
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            lastLineShort && i === lines - 1 ? "max-w-[55%]" : "max-w-full",
          )}
        />
      ))}
    </div>
  );
}

export interface SkeletonCardProps {
  /** Include a header skeleton row with avatar + title lines */
  withHeader?: boolean;
  className?: string;
}

/**
 * A card-shaped skeleton with optional header, suitable for content cards and list items.
 */
export function SkeletonCard({ withHeader = true, className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] p-4 space-y-4",
        className,
      )}
      aria-hidden="true"
    >
      {withHeader && (
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" width={40} height={40} />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" className="max-w-[60%]" />
            <Skeleton variant="text" className="max-w-[40%]" />
          </div>
        </div>
      )}
      <SkeletonText lines={3} />
    </div>
  );
}
