import React from "react";
import { cn } from "./utils";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Icon, type IconName } from "./Icon";
import { type Theme, ThemeContext, primaryThemeMap, useCurrentTheme } from "./Theme";

// Re-export for backward compatibility with consumers importing Theme from Card
export type { Theme } from "./Theme";
export { useCurrentTheme };

/**
 * Context for passing icon configuration from Card to its children (primarily CardHeader).
 */
interface CardIconContextValue {
  iconName?: IconName;
  iconVariant?: "primary" | "secondary" | "accent";
}

const CardIconContext = React.createContext<CardIconContextValue>({});
export const useCardIcon = () => React.useContext(CardIconContext);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The semantic visual style variant of the card.
   * - `surface` (default): Swaps to a contrasting theme for the surface, ensuring accessible nesting.
   * - `outline`: Transparent background with secondary-colored border and text.
   * - `highlight`: Theme background with accent-colored text and a thick bottom accent border.
   * - `subtle`: Light bordered surface card.
   * - `interactive`: Clickable surface card with hover glow, lift, and pointer cursor.
   * - `callout`: Left-accented callout block.
   */
  variant?: "surface" | "outline" | "highlight" | "subtle" | "interactive" | "callout";
  /** The theme context to apply, which modifies the component's CSS variables. */
  theme?: Theme;
  /** Optional icon to render in the CardHeader. */
  iconName?: IconName;
  /** The color variant for the icon container. Defaults to "primary". */
  iconVariant?: "primary" | "secondary" | "accent";
}

/**
 * The core container block for the Card subcomponent architecture.
 * Groups related concepts, providing thematic backgrounds, borders, and shadows.
 *
 * The **primary** variant doesn't hardcode colors — it swaps to a mapped `data-theme`,
 * so that all children (text, borders, nested components) inherit proper contrast
 * automatically from the CSS theme system.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "surface", theme, iconName, iconVariant = "primary", children, ...props }, ref) => {
    const parentTheme = useCurrentTheme();

    // The effective base theme: explicit prop overrides inherited context
    const baseTheme = theme ?? parentTheme;

    // For primary, swap to the mapped contrasting theme.
    // For other variants, only set data-theme if explicitly provided via prop.
    const resolvedTheme =
      variant === "surface" ? primaryThemeMap[baseTheme] : theme;

    // Children should see the resolved theme (or inherited base) in context
    const childTheme = resolvedTheme ?? baseTheme;

    return (
      <ThemeContext.Provider value={childTheme}>
        <CardIconContext.Provider value={{ iconName, iconVariant }}>
          <div
            ref={ref}
            data-theme={resolvedTheme}
            data-variant={variant}
            className={cn(
              "rounded-xl overflow-visible relative group",
              {
                // Surface: uses the swapped theme's bg/text via CSS variables
                "bg-[var(--theme-bg)] text-[var(--theme-text)]":
                  variant === "surface",
                // Outline: transparent bg, secondary border + text
                "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":
                  variant === "outline",
                // Highlight: theme bg, accent text, thick bottom accent border
                "bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":
                  variant === "highlight",
                // Subtle: light bordered surface card
                "border-2 border-[var(--theme-border-soft)] bg-[var(--theme-bg)] text-[var(--theme-text)] shadow-md":
                  variant === "subtle",
                // Interactive: clickable surface card with hover glow and lift
                "border-2 border-[var(--theme-border-soft)] bg-[var(--theme-bg)] text-[var(--theme-text)] shadow-md cursor-pointer transition-all duration-500 ease-in hover:shadow-[0_0_20px_color-mix(in_srgb,var(--theme-secondary)_25%,transparent)] hover:-translate-y-1 hover:border-[var(--theme-border-medium)] hover:duration-300 hover:ease-out active:translate-y-0 active:shadow-sm active:duration-75":
                  variant === "interactive",
                // Callout: left-accented callout block
                "bg-[var(--theme-secondary)]/10 text-[var(--theme-text)] border-l-8 border-l-[var(--theme-primary)] border-t-0 border-r-0 border-b-0 shadow-[inset_0_0_20px_color-mix(in_srgb,var(--theme-secondary)_10%,transparent)] hover:shadow-[inset_0_0_30px_color-mix(in_srgb,var(--theme-secondary)_15%,transparent)] transition-shadow duration-500 ease-in hover:duration-300 hover:ease-out":
                  variant === "callout",
                "[corner-shape:scoop_round_round_round] rounded-tl-4xl": iconName,
              },
              className,
            )}
            {...props}
          >
            <HeadingLevelProvider>{children}</HeadingLevelProvider>
          </div>
        </CardIconContext.Provider>
      </ThemeContext.Provider >
    );
  },
);
Card.displayName = "Card";

/**
 * Provides a standardized visual header for the Card, including padding and a subtle bottom border.
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { theme?: Theme }
>(({ className, theme, children, ...props }, ref) => {
  const { iconName, iconVariant } = useCardIcon();

  return (
    <div
      ref={ref}
      data-theme={theme}
      className={cn(
        "flex flex-col space-y-1.5 p-4 tablet:p-6 border-b-2 border-current/20",
        className,
      )}
      {...props}
    >
      {iconName && (
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 ease-in group-hover:duration-300 group-hover:ease-out absolute -top-6 -left-6",
            {
              "border-[var(--theme-bg)] border-2 text-[var(--theme-bg)]": iconVariant === "primary",
              "border-[var(--theme-border-soft)] border-2 text-text-subtle": iconVariant === "secondary" || iconVariant === "accent",
            }
          )}
        >
          <Icon name={iconName} size={28} />
        </div>
      )}
      {children}
    </div>
  );
});
CardHeader.displayName = "CardHeader";

/**
 * The title block of the Card. Automatically uses the global `Heading` component
 * to ensure that heading hierarchy and typography stay consistent.
 */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    theme?: Theme;
  }
>(({ className, theme, ...props }, ref) => (
  <Heading ref={ref} data-theme={theme} className={cn("font-bold", className)} {...props} />
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
    className={cn("text-lg font-bold uppercase tracking-wider text-text-muted", className)}
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
        "gap-6 p-4 pt-4 tablet:p-6 tablet:pt-6": variant === "default",
        "gap-4 p-3 tablet:p-4": variant === "dense",
        "gap-4 p-4 tablet:p-6 text-text-muted leading-relaxed font-light": variant === "rule",
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
    className={cn("flex items-center p-4 pt-0 tablet:p-6 tablet:pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
