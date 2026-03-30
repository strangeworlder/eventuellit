import React, { createContext, useCallback, useContext, useId, useState } from "react";
import { cn } from "./utils";
import { usePillIndicator } from "./usePillIndicator";

type TabsContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  idPrefix: string;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The controlled value of the tab to activate. Use with `onValueChange`. */
  value?: string;
  /** Initial tab when uncontrolled. */
  defaultValue?: string;
  /** Called when the active tab changes. */
  onValueChange?: (value: string) => void;
}

/**
 * Root for in-page tab panels: `TabsList` + `TabsTrigger` + `TabsContent`.
 * For router-linked top navigation, use `TopNav` / `TopNavLink` instead.
 *
 * @summary state-driven tab panels with ARIA tab pattern
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value: controlledValue, defaultValue, onValueChange, className, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const reactId = useId();
    const idPrefix = `tabs-${reactId.replace(/:/g, "")}`;

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
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange, idPrefix }}>
        <div ref={ref} className={cn("flex flex-col", className)} {...props} />
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

const TAB_SELECTOR = '[role="tab"]';

function isTabSelected(el: HTMLElement): boolean {
  return el.getAttribute("aria-selected") === "true";
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, onKeyDown, style, ...props }, ref) => {
    const activeCheck = useCallback((el: HTMLElement) => isTabSelected(el), []);
    const { listRef, style: pillStyle, settleClassName, handlers } = usePillIndicator({
      itemSelector: TAB_SELECTOR,
      activeCheck,
    });

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, listRef],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!listRef.current) return;

      const targetRole = (e.target as HTMLElement).getAttribute?.("role");
      if (targetRole !== "tab") return;

      const items = Array.from(
        listRef.current.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'),
      );
      if (!items.length) return;

      const currentFocusedIndex = items.findIndex((item) => item === document.activeElement);

      let nextIndex = currentFocusedIndex;
      let handled = false;

      switch (e.key) {
        case "ArrowRight":
          nextIndex = (currentFocusedIndex + 1) % items.length;
          handled = true;
          break;
        case "ArrowLeft":
          nextIndex = (currentFocusedIndex - 1 + items.length) % items.length;
          handled = true;
          break;
        case "Home":
          nextIndex = 0;
          handled = true;
          break;
        case "End":
          nextIndex = items.length - 1;
          handled = true;
          break;
        default:
          break;
      }

      if (handled) {
        e.preventDefault();
        items[nextIndex]?.focus();
      }

      onKeyDown?.(e);
    };

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
          "after:transition-[left,right,top,bottom] after:duration-500 after:ease-[cubic-bezier(0.23,1,0.32,1)]",
          settleClassName,
          "after:[transform-origin:var(--tab-tug-ox,50%)_var(--tab-tug-oy,50%)]",
          "after:[transform:translateX(var(--tab-tug-x,0px))_translateY(var(--tab-tug-y,0px))_scaleX(var(--tab-stretch-x,1))_scaleY(var(--tab-stretch-y,1))]",
          "after:pointer-events-none",
          className,
        )}
        style={{ ...pillStyle, ...style } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        onMouseOver={handlers.onMouseOver}
        onMouseLeave={handlers.onMouseLeave}
        onClick={handlers.onClick}
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
    const { value: selected, onValueChange, idPrefix } = useTabsContext();
    const isSelected = selected === value;
    const triggerId = `${idPrefix}-item-${value}`;
    const panelId = `${idPrefix}-panel-${value}`;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        aria-controls={panelId}
        id={triggerId}
        tabIndex={isSelected ? 0 : -1}
        data-theme={theme}
        onClick={(e) => {
          onValueChange?.(value);
          onClick?.(e);
        }}
        className={cn(
          "relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm mobile:text-base font-bold uppercase tracking-widest transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          "disabled:pointer-events-none disabled:opacity-50",
          "rounded-t-md",
          "mb-[-2px]",
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

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selected, idPrefix } = useTabsContext();
    const isSelected = selected === value;
    const triggerId = `${idPrefix}-item-${value}`;
    const panelId = `${idPrefix}-panel-${value}`;

    if (!isSelected) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
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
