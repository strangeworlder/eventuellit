import React, { createContext, useCallback, useContext, useId, useState } from "react";
import { SlimeIndicator } from "./SlimeIndicator";
import { usePillIndicator } from "./usePillIndicator";
import { cn } from "./utils";

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
  (
    {
      className,
      children,
      onKeyDown,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
      onClick,
      style,
      ...props
    },
    ref,
  ) => {
    const activeCheck = useCallback((el: HTMLElement) => isTabSelected(el), []);
    const {
      listRef,
      style: pillStyle,
      slime,
      handlers,
    } = usePillIndicator({
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

      const currentFocusedIndex =
        document.activeElement instanceof HTMLElement ? items.indexOf(document.activeElement) : -1;

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
          "relative isolate flex flex-wrap items-end border-b-2 border-[var(--theme-primary)] mb-0 gap-1 px-4 mobile:px-0",
          className,
        )}
        style={{ ...pillStyle, ...style } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        onMouseOver={(e) => {
          handlers.onMouseOver(e);
          onMouseOver?.(e);
        }}
        onMouseMove={(e) => {
          handlers.onMouseMove(e);
          onMouseMove?.(e);
        }}
        onMouseLeave={(e) => {
          handlers.onMouseLeave();
          onMouseLeave?.(e);
        }}
        onClick={(e) => {
          handlers.onClick(e);
          onClick?.(e);
        }}
        {...props}
      >
        <SlimeIndicator slime={slime} />
        {children}
      </div>
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
    | "accent-dark"
    | "royal"
    | "royal-dark";
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
          "relative z-10 cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm mobile:text-base font-bold uppercase tracking-widest transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          "disabled:pointer-events-none disabled:opacity-50",
          "rounded-t-md",
          "mb-[-2px]",
          isSelected
            ? "bg-transparent text-[var(--theme-primary)] border-2 border-transparent font-bold"
            : "border-2 border-transparent bg-transparent text-[var(--theme-text)] hover:[text-shadow:0_0_15px_var(--theme-accent)] hover:text-[var(--theme-text)] font-semibold",
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
        className={cn("animate-in fade-in duration-300", className)}
        {...props}
      />
    );
  },
);
TabsContent.displayName = "TabsContent";
