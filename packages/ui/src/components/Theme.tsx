import React, { useEffect, useId } from "react";

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
  | "accent-dark"
  | "royal"
  | "royal-dark";

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
  royal: "royal-dark",
  "royal-dark": "royal",
};

/**
 * A global stack of requested themes.
 * Allows multiple nested components to request a theme, and correctly
 * reverts to the previous requested theme (or "base") when unmounted.
 */
const themeStack: { id: string; theme: Theme }[] = [];

function updateBodyTheme() {
  const lastEntry = themeStack[themeStack.length - 1];
  const activeTheme = lastEntry ? lastEntry.theme : "base";
  document.body.setAttribute("data-theme", activeTheme);
}

/**
 * Hook to set the `data-theme` attribute on the `body` element.
 * When the component using this hook unmounts, the theme will automatically
 * revert to the default ("base") or the next theme in the active stack.
 */
export function usePageTheme(theme?: Theme | null) {
  const id = useId();

  useEffect(() => {
    if (!theme) return;

    themeStack.push({ id, theme });
    updateBodyTheme();

    return () => {
      const index = themeStack.findIndex((t) => t.id === id);
      if (index !== -1) {
        themeStack.splice(index, 1);
        updateBodyTheme();
      }
    };
  }, [theme, id]);
}

/**
 * Utility component that declaratively sets the page theme.
 * Can be placed anywhere in the component tree of a page.
 */
export function PageTheme({ theme }: { theme: Theme }) {
  usePageTheme(theme);
  return null;
}
