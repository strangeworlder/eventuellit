import React from "react";
import { cn } from "./utils";

// ── Stack ──

/**
 * Flexbox column/row wrapper with a consistent gap scale.
 * Use instead of writing raw `flex flex-col gap-*` wrappers.
 * For multi-column grids use `Grid`; for max-width centering use `Container`.
 *
 * @summary flex column/row with gap scale; direction: column (default) or row; alternatives: Grid, Container
 */
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Direction of the stack.
   * - `column` (default): Vertical stacking.
   * - `row`: Horizontal stacking.
   */
  direction?: "column" | "row";
  /**
   * Gap between children using the Tailwind spacing scale.
   * Defaults to 4 (1rem).
   */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  /** Align-items value */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justify-content value */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** When true, wraps children (only relevant for row direction) */
  wrap?: boolean;
  /** Render as a different element */
  as?: React.ElementType;
}

const gapClasses: Record<NonNullable<StackProps["gap"]>, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
};

const alignClasses: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyClasses: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

/**
 * Stack arranges children in a single-axis flex layout.
 * Use this instead of raw `div + flex + gap-*` for predictable, token-aligned spacing.
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "column",
      gap = 4,
      align,
      justify,
      wrap = false,
      as: Component = "div",
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "flex",
          direction === "column" ? "flex-col" : "flex-row",
          gapClasses[gap],
          align && alignClasses[align],
          justify && justifyClasses[justify],
          wrap && "flex-wrap",
          className,
        )}
        {...props}
      />
    );
  },
);
Stack.displayName = "Stack";

// ── Grid ──

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns.
   * Accepts a fixed number or a responsive object.
   */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  /**
   * Responsive column counts. Keys are DS breakpoints.
   * e.g. `{ base: 1, tablet: 2, desktop: 3 }`
   */
  responsive?: Partial<
    Record<"base" | "mobile" | "tablet" | "desktop" | "x-wide", 1 | 2 | 3 | 4 | 6 | 12>
  >;
  /** Gap between grid cells using the Tailwind spacing scale */
  gap?: 0 | 2 | 4 | 6 | 8 | 10 | 12;
  /** Render as a different element */
  as?: React.ElementType;
}

const colClasses: Record<NonNullable<GridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const gridGapClasses: Record<NonNullable<GridProps["gap"]>, string> = {
  0: "gap-0",
  2: "gap-2",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

const responsivePrefixes: Record<string, string> = {
  base: "",
  mobile: "mobile:",
  tablet: "tablet:",
  desktop: "desktop:",
  "x-wide": "x-wide:",
};

/**
 * Grid lays out children in a CSS grid.
 * Use this instead of raw `div + grid-cols-*` for responsive, token-aligned grids.
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, responsive, gap = 4, as: Component = "div", ...props }, ref) => {
    const responsiveClasses = responsive
      ? Object.entries(responsive)
          .map(([bp, c]) => `${responsivePrefixes[bp] ?? ""}grid-cols-${c}`)
          .join(" ")
      : "";

    return (
      <Component
        ref={ref}
        className={cn("grid", colClasses[cols], responsiveClasses, gridGapClasses[gap], className)}
        {...props}
      />
    );
  },
);
Grid.displayName = "Grid";

// ── Container ──

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width constraint.
   * - `page` (default): 1280px — matches `Page` component max-width.
   * - `prose`: 65ch — ideal for long-form reading content.
   * - `wide`: 1536px — for very wide dashboard layouts.
   * - `full`: no constraint.
   */
  size?: "prose" | "page" | "wide" | "full";
  /** Horizontal padding. Defaults to true. */
  padded?: boolean;
  /** Render as a different element */
  as?: React.ElementType;
}

const containerSizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  prose: "max-w-prose",
  page: "max-w-[1280px]",
  wide: "max-w-[1536px]",
  full: "max-w-none",
};

/**
 * Container centers content horizontally with a max-width constraint.
 * Use this instead of raw `mx-auto max-w-*`.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "page", padded = true, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "mx-auto w-full",
          containerSizeClasses[size],
          padded && "px-4 tablet:px-6",
          className,
        )}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";
