import * as React from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Heading, HeadingLevelProvider } from "./Heading";
import { cn } from "./utils";
import type { Theme } from "./Theme";
import { useFocusTrap } from "./useFocusTrap";

export type DrawerContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined);

export function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a Drawer");
  }
  return context;
}

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Panel title rendered in the header */
  title: string;
  /** Start expanded? Defaults to false. */
  defaultExpanded?: boolean;
  /** Controlled expanded state */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Optional theme override */
  theme?: Theme;
}

/**
 * A collapsible tool drawer that sits below the preceding content on smaller
 * screens (collapses upward via max-height) and docks as a fixed right-side
 * panel on x-wide (≥ 1200 px) screens (slides in/out via translate-x).
 *
 * Follows the same architecture as Sidebar: context, subcomponents,
 * max-x-wide / x-wide responsive split.
 */
export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      title,
      defaultExpanded = false,
      expanded: controlledExpanded,
      onExpandedChange,
      theme,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
    const isControlled = controlledExpanded !== undefined;
    const expanded = isControlled ? controlledExpanded : internalExpanded;
    const asideRef = React.useRef<HTMLElement>(null);
    useFocusTrap(expanded, asideRef);

    const setExpanded = React.useCallback(
      (value: React.SetStateAction<boolean>) => {
        const nextValue = typeof value === "function" ? value(expanded) : value;
        if (!isControlled) {
          setInternalExpanded(nextValue);
        }
        onExpandedChange?.(nextValue);
      },
      [isControlled, expanded, onExpandedChange],
    );

    return (
      <DrawerContext.Provider value={{ expanded, setExpanded }}>
        {/* Backdrop — x-wide only */}
        {expanded && (
          <div
            className="hidden x-wide:block fixed inset-0 z-40 bg-black/50 transition-opacity"
            onClick={() => setExpanded(false)}
            onKeyDown={(e) => e.key === "Escape" && setExpanded(false)}
          />
        )}

        <div
          ref={ref}
          data-theme={theme}
          className={cn("relative z-50 font-sans", className)}
          {...props}
        >
          {/* Edge toggle — always visible */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setExpanded((prev) => !prev)}
            className="absolute top-2 right-2 x-wide:fixed x-wide:top-4 x-wide:right-4 bg-[var(--theme-bg)] hover:bg-[var(--theme-bg)] rounded-full h-6 w-6 min-w-0 p-0 flex items-center justify-center z-[51] max-x-wide:-rotate-90"
            aria-label={expanded ? "Sulje paneeli" : "Avaa paneeli"}
            aria-expanded={expanded}
          >
            {expanded ? <Icon name="chevron-right" size={16} /> : <Icon name="chevron-left" size={16} />}
          </Button>

          <aside
            ref={asideRef}
            className={cn(
              "bg-[var(--theme-bg)] text-[var(--theme-secondary)] border-b border-[var(--theme-secondary)] transition-all",
              expanded ? "duration-300 ease-out" : "duration-500 ease-in",
              !expanded && "max-x-wide:overflow-hidden max-x-wide:max-h-0 max-x-wide:border-b-0",
              "x-wide:fixed x-wide:top-0 x-wide:right-0 x-wide:bottom-0 x-wide:w-80 x-wide:border-b-0 x-wide:border-l x-wide:overflow-y-auto",
              expanded ? "x-wide:translate-x-0 x-wide:shadow-2xl" : "x-wide:translate-x-full",
            )}
          >
            <HeadingLevelProvider>
              <div className="p-4 border-b-2 border-current/20">
                <Heading>{title}</Heading>
              </div>
              <HeadingLevelProvider>
                <div className="p-4 grid grid-cols-1 tablet:grid-cols-2 gap-6 x-wide:grid-cols-1 items-start">
                  {children}
                </div>
              </HeadingLevelProvider>
            </HeadingLevelProvider>
          </aside>
        </div>
      </DrawerContext.Provider>
    );
  },
);
Drawer.displayName = "Drawer";
