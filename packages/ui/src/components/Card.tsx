import React from "react";
import { cn } from "./Button";
import { Heading, HeadingLevelProvider } from "./Heading";

/**
 * Defines the available theme options for theming the Card and its children.
 */
export type Theme =
  | "base"
  | "inverted"
  | "primary-light"
  | "primary-dark"
  | "secondary-light"
  | "secondary-dark"
  | "accent-light"
  | "accent-dark";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The visual style variant of the card. */
  variant?: "default" | "success" | "subtle" | "rule";
  /** The theme context to apply, which modifies the component's CSS variables. */
  theme?: Theme;
}

/**
 * The core container block for the Card subcomponent architecture.
 * Groups related concepts, providing thematic backgrounds, borders, and shadows.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", theme, children, ...props }, ref) => (
    <div
      ref={ref}
      data-theme={theme}
      className={cn(
        "rounded-sm text-[var(--theme-text)] overflow-visible relative group",
        {
          "border-2 border-[var(--theme-primary)] bg-[var(--theme-bg)]": variant === "default",
          "border-2 border-[var(--theme-secondary)]/50 bg-[var(--theme-secondary)]/5 shadow-[0_0_15px_color-mix(in_srgb,var(--theme-secondary)_20%,transparent)]":
            variant === "success",
          "border-2 border-[var(--theme-primary)]/20 bg-[var(--theme-bg)] shadow-md":
            variant === "subtle",
          "bg-[var(--theme-secondary)]/10 border-l-8 border-l-[var(--theme-primary)] border-t-0 border-r-0 border-b-0 shadow-[inset_0_0_20px_color-mix(in_srgb,var(--theme-secondary)_10%,transparent)] hover:shadow-[inset_0_0_30px_color-mix(in_srgb,var(--theme-secondary)_15%,transparent)] transition-shadow":
            variant === "rule",
        },
        className,
      )}
      {...props}
    >
      <HeadingLevelProvider>{children}</HeadingLevelProvider>
    </div>
  ),
);
Card.displayName = "Card";

/**
 * Provides a standardized visual header for the Card, including padding and a subtle bottom border.
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { theme?: Theme }
>(({ className, theme, ...props }, ref) => (
  <div
    ref={ref}
    data-theme={theme}
    className={cn(
      "flex flex-col space-y-1.5 p-6 border-b-2 border-[var(--theme-primary)]/20",
      className,
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * The title block of the Card. Automatically uses the global `Heading` component
 * to ensure that heading hierarchy and typography stay consistent.
 */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: "primary" | "secondary" | "accent" | "default" | "rule";
    theme?: Theme;
  }
>(({ className, variant = "primary", theme, ...props }, ref) => (
  <Heading ref={ref} data-theme={theme} {...props} />
));
CardTitle.displayName = "CardTitle";

/**
 * A bold uppercase text label, typically placed below the `CardTitle` to offer extra context.
 */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { theme?: Theme }
>(({ className, theme, ...props }, ref) => (
  <p
    ref={ref}
    data-theme={theme}
    className={cn("text-lg font-bold uppercase tracking-wider text-[var(--theme-text)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * The main container for the body of the Card.
 * Use the `variant` prop to adjust padding density.
 */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "dense" | "rule"; theme?: Theme }
>(({ className, variant = "default", theme, ...props }, ref) => (
  <div
    ref={ref}
    data-theme={theme}
    className={cn(
      "flex flex-col",
      {
        "gap-6 p-6 pt-6": variant === "default",
        "gap-4 p-4": variant === "dense",
        "gap-4 p-6 text-[var(--theme-text)]/90 leading-relaxed font-light": variant === "rule",
      },
      className,
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

/**
 * The bottom area of the Card, normally used for rendering action buttons.
 */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { theme?: Theme }
>(({ className, theme, ...props }, ref) => (
  <div
    ref={ref}
    data-theme={theme}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
