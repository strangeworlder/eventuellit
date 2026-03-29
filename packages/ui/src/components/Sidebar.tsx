import { Icon } from "./Icon";
import * as React from "react";
import { Button } from "./Button";
import { cn } from "./utils";

export type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

/**
 * Collapsible side navigation panel. Contains navigation links rendered as `Button` items.
 * `useSidebar()` hook for controlled expand/collapse. Use for the primary app navigation rail.
 * For contextual detail panels use Drawer; for tab-based navigation use Tabs.
 *
 * @summary primary collapsible nav panel; use useSidebar() hook; for contextual panels use Drawer
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean | ((prev: boolean) => boolean)) => void;
  theme?:
    | "base"
    | "inverted"
    | "primary-light"
    | "primary-dark"
    | "secondary-light"
    | "secondary-dark"
    | "accent-light"
    | "accent-dark";
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      defaultExpanded = true,
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
      <SidebarContext.Provider value={{ expanded, setExpanded }}>
        <>
          {/* Mobile Backdrop */}
          {expanded && (
            <div
              className="desktop:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
              onClick={() => setExpanded(false)}
              onKeyDown={(e) => e.key === "Escape" && setExpanded(false)}
            />
          )}
          <aside
            ref={ref}
            data-theme={theme}
            className={cn(
              "h-full flex flex-col bg-[var(--theme-bg)] desktop:bg-transparent border-r border-[var(--theme-secondary)] transition-all relative text-[var(--theme-secondary)] z-50",
              expanded
                ? "duration-300 ease-out" // expand: snappy
                : "duration-500 ease-in", // collapse: gentle
              // Mobile behavior: fixed, off-canvas, slide in
              "max-desktop:fixed max-desktop:top-0 max-desktop:bottom-0 max-desktop:left-0 max-desktop:w-64 max-desktop:z-50",
              !expanded && "max-desktop:-translate-x-full",
              expanded && "max-desktop:translate-x-0 max-desktop:shadow-2xl",
              // Desktop behavior
              !expanded && "desktop:w-16",
              expanded && "desktop:w-64",
              className,
            )}
            {...props}
          >
            {children}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setExpanded((prev) => !prev)}
              className={cn(
                "absolute top-4 bg-[var(--theme-bg)] hover:bg-[var(--theme-bg)] rounded-full p-1 opacity-100 z-10 hover:-translate-y-0 h-6 w-6 min-w-0 flex items-center justify-center p-0",
                expanded ? "-right-3" : "max-desktop:right-0 desktop:-right-3",
              )}
              aria-label={expanded ? "Supista sivupalkki" : "Laajenna sivupalkki"}
            >
              {expanded ? (
                <Icon name="chevron-left" size={16} />
              ) : (
                <Icon name="chevron-right" size={16} />
              )}
            </Button>
          </aside>
        </>
      </SidebarContext.Provider>
    );
  },
);
Sidebar.displayName = "Sidebar";

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { expanded } = useSidebar();
    return (
      <div
        ref={ref}
        className={cn(
          "p-4 flex items-center mb-4 transition-opacity",
          expanded ? "justify-start" : "justify-center",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SidebarHeader.displayName = "SidebarHeader";

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SidebarContent.displayName = "SidebarContent";

export interface SidebarItemProps extends React.ComponentPropsWithoutRef<typeof Button> {
  icon?: React.ReactNode;
  active?: boolean;
}

export const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, icon, active, children, ...props }, ref) => {
    const { expanded } = useSidebar();

    return (
      <Button
        ref={ref}
        variant={active ? "ghost" : "ghost-subtle"}
        size="nav"
        justify={expanded ? "start" : "center"}
        className={cn(
          "w-full flex items-center p-2 rounded-md transition-colors text-left group relative",
          active
            ? "bg-[var(--theme-surface-tint)] text-[var(--theme-text)] font-bold"
            : "hover:bg-[var(--theme-surface-tint)] hover:text-[var(--theme-text)]",
          expanded ? "justify-start" : "justify-center",
          className,
        )}
        {...props}
      >
        {icon && <span className={cn("flex-shrink-0", expanded && "mr-3")}>{icon}</span>}

        {expanded && <span className="truncate">{children}</span>}
      </Button>
    );
  },
);
SidebarItem.displayName = "SidebarItem";

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { expanded } = useSidebar();
    return (
      <div
        ref={ref}
        className={cn(
          "p-4 border-t border-[var(--theme-border-soft)] mt-auto",
          expanded ? "block" : "flex justify-center",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SidebarFooter.displayName = "SidebarFooter";
