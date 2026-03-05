import React from "react";

/**
 * Defines the available theme options for theming components and their children.
 *
 * Any component that sets `data-theme` and participates in the design system
 * theme tree should use this type for its `theme` prop.
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

/**
 * React context for tracking the current active theme in the tree.
 * Defaults to "base" (the root theme). Any component that sets `data-theme`
 * should also provide this context so descendants can resolve theme-relative mappings.
 */
export const ThemeContext = React.createContext<Theme>("base");
export const useCurrentTheme = () => React.useContext(ThemeContext);

/**
 * Maps a parent theme to the theme a **primary** component should swap to.
 * This ensures high-contrast, accessible nesting — a primary component always
 * "pops" against its parent surface by moving to a complementary theme.
 *
 * Any component following the primary component pattern should apply this map
 * when resolving its `data-theme` and `ThemeContext.Provider` value.
 */
export const primaryThemeMap: Record<Theme, Theme> = {
    base: "primary-dark",
    inverted: "primary-dark",
    "primary-light": "secondary-dark",
    "primary-dark": "secondary-light",
    "secondary-light": "primary-dark",
    "secondary-dark": "primary-light",
    "accent-light": "primary-dark",
    "accent-dark": "primary-light",
};
