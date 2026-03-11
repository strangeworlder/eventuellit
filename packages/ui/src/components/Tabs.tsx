import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import { cn } from "./Button";

type TabsContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The controlled value of the tab to activate. Should be used in conjunction with `onValueChange`. */
  value?: string;
  /** The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs. */
  defaultValue?: string;
  /** Event handler called when the value changes. */
  onValueChange?: (value: string) => void;
}

/**
 * A set of layered sections of content—known as tab panels—that display one panel of content at a time.
 * Designed with a physical binder aesthetic and full keyboard accessibility.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value: controlledValue, defaultValue, onValueChange, className, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange],
    );

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn("flex flex-col", className)} {...props} />
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> { }

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, onKeyDown, style, ...props }, ref) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [tugX, setTugX] = useState(0);
    const [tugStretch, setTugStretch] = useState(1);
    const [tugSkew, setTugSkew] = useState(0);

    // Merge refs logic to ensure we have a local ref for querying DOM while forwarding to parent
    const setRefs = useCallback(
      (node: HTMLDivElement) => {
        listRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!listRef.current) return;

      // Only handle events originating within the tablist itself (not inside tab panels if nested, though theoretically tabpanels are siblings, it's a good safety check)
      const targetRole = (e.target as HTMLElement).getAttribute?.("role");
      if (targetRole !== "tab") return;

      const tabs = Array.from(
        listRef.current.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'),
      );
      if (!tabs.length) return;

      const currentFocusedIndex = tabs.findIndex((tab) => tab === document.activeElement);

      let nextIndex = currentFocusedIndex;
      let handled = false;

      switch (e.key) {
        case "ArrowRight":
          nextIndex = (currentFocusedIndex + 1) % tabs.length;
          handled = true;
          break;
        case "ArrowLeft":
          nextIndex = (currentFocusedIndex - 1 + tabs.length) % tabs.length;
          handled = true;
          break;
        case "Home":
          nextIndex = 0;
          handled = true;
          break;
        case "End":
          nextIndex = tabs.length - 1;
          handled = true;
          break;
        default:
          break;
      }

      if (handled) {
        e.preventDefault();
        tabs[nextIndex]?.focus();
      }

      onKeyDown?.(e);
    };

    const handleMouseOver = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const target = (e.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
      if (!target || !listRef.current) return;

      // Don't tug if hovering the already-active tab
      const isActive =
        target.getAttribute("aria-selected") === "true" ||
        target.getAttribute("aria-current") === "page";

      if (isActive) {
        setTugX(0);
        setTugStretch(1);
        setTugSkew(0);
        return;
      }

      // Find all tabs and the active one to compute index distance
      const tabs = Array.from(
        listRef.current.querySelectorAll<HTMLElement>('[role="tab"]'),
      );
      const activeIndex = tabs.findIndex(
        (t) =>
          t.getAttribute("aria-selected") === "true" ||
          t.getAttribute("aria-current") === "page",
      );
      const targetIndex = tabs.indexOf(target);
      if (activeIndex === -1 || targetIndex === -1) return;

      const indexDistance = Math.abs(targetIndex - activeIndex);
      const direction = targetIndex > activeIndex ? 1 : -1;

      // Constant pull: Offset + scale + skew
      // The pull feels "heavier" the further away the tab is
      setTugX(direction * (2 + indexDistance * 2));
      setTugStretch(1 + indexDistance * 0.025);
      setTugSkew(direction * (indexDistance));
    }, []);

    const handleMouseLeave = useCallback(() => {
      setTugX(0);
      setTugStretch(1);
      setTugSkew(0);
    }, []);

    return (
      <div
        ref={setRefs}
        role="tablist"
        aria-orientation="horizontal"
        className={cn(
          "relative flex flex-wrap items-end border-b-2 border-[var(--theme-primary)] mb-0 gap-1 px-4 mobile:px-0",
          "[anchor-scope:--active-tab]",
          "after:content-[''] after:absolute after:rounded-full after:bg-[var(--theme-secondary)]/15 after:border-2 after:border-[var(--theme-secondary)]",
          "after:[position-anchor:--active-tab] after:[left:anchor(left)] after:[right:anchor(right)] after:[bottom:calc(anchor(bottom)+5px)] after:[top:calc(anchor(top)+2px)]",
          "after:transition-all after:duration-500 after:ease-[cubic-bezier(0.23,1,0.32,1)]",
          "after:[transform:translateX(var(--tab-tug,0px))_scaleX(var(--tab-stretch,1))_skewX(var(--tab-skew,0deg))]",
          "after:pointer-events-none",
          className,
        )}
        style={{
          "--tab-tug": `${tugX}px`,
          "--tab-stretch": tugStretch,
          "--tab-skew": `${tugSkew}deg`,
          ...style,
        } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  },
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
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

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, theme, onClick, ...props }, ref) => {
    const context = useTabs();
    const isSelected = context.value === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        aria-controls={`tabpanel-${value}`}
        id={`tab-${value}`}
        tabIndex={isSelected ? 0 : -1}
        data-theme={theme}
        onClick={(e) => {
          context.onValueChange?.(value);
          onClick?.(e);
        }}
        className={cn(
          "relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm mobile:text-base font-bold uppercase tracking-widest transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          "disabled:pointer-events-none disabled:opacity-50",
          "rounded-t-md",
          "mb-[-2px]", // Overlap the bottom border of the list
          isSelected && "[anchor-name:--active-tab]",
          isSelected
            ? "bg-transparent text-[var(--theme-primary)] z-10 border-2 border-transparent font-bold"
            : "border-2 border-transparent bg-transparent text-[var(--theme-text)] hover:[text-shadow:0_0_15px_var(--theme-secondary)] hover:text-[var(--theme-text)] font-semibold",
          className,
        )}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsLinkProps extends Omit<NavLinkProps, "className"> {
  theme?:
  | "base"
  | "inverted"
  | "primary-light"
  | "primary-dark"
  | "secondary-light"
  | "secondary-dark"
  | "accent-light"
  | "accent-dark";
  className?: string;
}

/**
 * A tab trigger that renders as a `NavLink` for router-based navigation.
 * Active state is determined by the current URL, not by Tabs context.
 */
export const TabsLink = React.forwardRef<HTMLAnchorElement, TabsLinkProps>(
  ({ className, theme, ...props }, ref) => {
    return (
      <NavLink
        ref={ref}
        role="tab"
        data-theme={theme}
        className={({ isActive }) =>
          cn(
            "relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm mobile:text-base font-bold uppercase tracking-widest transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
            "rounded-t-md",
            "mb-[-2px]",
            isActive && "[anchor-name:--active-tab]",
            isActive
              ? "bg-transparent text-[var(--theme-text)] z-10 border-2 border-transparent font-bold"
              : "border-2 border-transparent bg-transparent text-[var(--theme-text)] hover:[text-shadow:0_0_15px_var(--theme-secondary)] hover:text-[var(--theme-text)] font-semibold",
            className,
          )
        }
        {...props}
      />
    );
  },
);
TabsLink.displayName = "TabsLink";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = useTabs();
    const isSelected = context.value === value;

    // Only render the component to the DOM if it's selected.
    // This is a common pattern for Tabs to prevent mounting off-screen content.
    if (!isSelected) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        tabIndex={0}
        className={cn(
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] animate-in fade-in duration-300",
          className,
        )}
        {...props}
      />
    );
  },
);
TabsContent.displayName = "TabsContent";
