import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { NavLink, type NavLinkProps, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { cn } from "./utils";

type TopNavContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const TopNavContext = createContext<TopNavContextValue | undefined>(undefined);

function useTopNav() {
  const context = useContext(TopNavContext);
  if (!context) {
    throw new Error("TopNav components must be used within a TopNav provider");
  }
  return context;
}

export interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The controlled value of the item to activate. Should be used in conjunction with `onValueChange`. */
  value?: string;
  /** The value of the item that should be active when initially rendered. Use when you do not need to control the state. */
  defaultValue?: string;
  /** Event handler called when the value changes. */
  onValueChange?: (value: string) => void;
}

/**
 * Top-level navigation bar for content sections. Designed with a physical binder aesthetic
 * and full keyboard accessibility. Use `TopNavLink` for router-linked items and `TopNavTrigger`
 * for state-only items. Add a `TopNavLink variant="parent"` as the first item to provide
 * hierarchy back-navigation. Use `TopNavDropdown` on mobile as a companion to `TopNavList`.
 *
 * @summary top navigation bar; TopNavLink for router items, TopNavTrigger for state items, TopNavDropdown for mobile
 */
export const TopNav = React.forwardRef<HTMLDivElement, TopNavProps>(
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
      <TopNavContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn("flex flex-col", className)} {...props} />
      </TopNavContext.Provider>
    );
  },
);
TopNav.displayName = "TopNav";

export interface TopNavListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TopNavList = React.forwardRef<HTMLDivElement, TopNavListProps>(
  ({ className, onKeyDown, style, ...props }, ref) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [tugX, setTugX] = useState(0);
    const [tugY, setTugY] = useState(0);
    const [stretchX, setStretchX] = useState(1);
    const [stretchY, setStretchY] = useState(1);
    const [isSettling, setIsSettling] = useState(false);
    const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const triggerSettle = useCallback(() => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        setIsSettling(true);
        setTugX(0);
        setTugY(0);
        setStretchX(1);
        setStretchY(1);
        settleTimerRef.current = setTimeout(() => setIsSettling(false), 700);
      }, 80);
    }, []);

    const handleMouseOver = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
        if (!target || !listRef.current) return;

        const isActive =
          target.getAttribute("aria-selected") === "true" ||
          target.getAttribute("aria-current") === "page";

        if (isActive) {
          triggerSettle();
          return;
        }

        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
        setIsSettling(false);

        const items = Array.from(
          listRef.current.querySelectorAll<HTMLElement>('[role="tab"]'),
        );
        const activeItem = items.find(
          (t) =>
            t.getAttribute("aria-selected") === "true" ||
            t.getAttribute("aria-current") === "page",
        );

        if (!activeItem) return;

        const activeRect = activeItem.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const dx = targetRect.left - activeRect.left;
        const dy = targetRect.top - activeRect.top;

        const maxPull = 12;
        const pullX = Math.max(-maxPull, Math.min(maxPull, dx * 0.06));
        const pullY = Math.max(-maxPull, Math.min(maxPull, dy * 0.06));

        const scaleX = 1 + Math.abs(pullX) / Math.max(activeRect.width, 1);
        const scaleY = 1 + Math.abs(pullY) / Math.max(activeRect.height, 1);

        setTugX(pullX);
        setTugY(pullY);
        setStretchX(scaleX);
        setStretchY(scaleY);
      },
      [triggerSettle],
    );

    const handleMouseLeave = useCallback(() => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      setIsSettling(true);
      setTugX(0);
      setTugY(0);
      setStretchX(1);
      setStretchY(1);
      settleTimerRef.current = setTimeout(() => setIsSettling(false), 700);
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
          "after:transition-[left,right,top,bottom] after:duration-500 after:ease-[cubic-bezier(0.23,1,0.32,1)]",
          isSettling
            ? "after:[transition:left_500ms_cubic-bezier(0.23,1,0.32,1),right_500ms_cubic-bezier(0.23,1,0.32,1),top_500ms_cubic-bezier(0.23,1,0.32,1),bottom_500ms_cubic-bezier(0.23,1,0.32,1),transform_600ms_cubic-bezier(0.34,1.56,0.64,1)]"
            : "after:[transition:left_500ms_cubic-bezier(0.23,1,0.32,1),right_500ms_cubic-bezier(0.23,1,0.32,1),top_500ms_cubic-bezier(0.23,1,0.32,1),bottom_500ms_cubic-bezier(0.23,1,0.32,1),transform_200ms_ease-out]",
          "after:[transform:translateX(var(--tab-tug-x,0px))_translateY(var(--tab-tug-y,0px))_scaleX(var(--tab-stretch-x,1))_scaleY(var(--tab-stretch-y,1))]",
          "after:pointer-events-none",
          className,
        )}
        style={{
          "--tab-tug-x": `${tugX}px`,
          "--tab-tug-y": `${tugY}px`,
          "--tab-stretch-x": stretchX,
          "--tab-stretch-y": stretchY,
          ...style,
        } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('[role="tab"]')) {
            triggerSettle();
          }
        }}
        {...props}
      />
    );
  },
);
TopNavList.displayName = "TopNavList";

export interface TopNavTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

export const TopNavTrigger = React.forwardRef<HTMLButtonElement, TopNavTriggerProps>(
  ({ className, value, theme, onClick, ...props }, ref) => {
    const context = useTopNav();
    const isSelected = context.value === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        aria-controls={`topnav-panel-${value}`}
        id={`topnav-item-${value}`}
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
TopNavTrigger.displayName = "TopNavTrigger";

export interface TopNavLinkProps extends Omit<NavLinkProps, "className"> {
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
  /**
   * `"default"` renders a standard nav item.
   * `"parent"` renders a visually distinct back-navigation item with a chevron.
   * Place `"parent"` as the first item in a `TopNavList` to navigate up one hierarchy level.
   * It uses the primary color and non-uppercase styling to signal it is hierarchical, not content.
   */
  variant?: "default" | "parent";
}

/**
 * A nav item that renders as a `NavLink` for router-based navigation.
 * Active state is determined by the current URL, not by TopNav context.
 * Use `variant="parent"` for a visually distinct back-navigation item.
 */
export const TopNavLink = React.forwardRef<HTMLAnchorElement, TopNavLinkProps>(
  ({ className, theme, variant = "default", children, ...props }, ref) => {
    if (variant === "parent") {
      return (
        <NavLink
          ref={ref}
          role="tab"
          data-theme={theme}
          className={cn(
            "relative cursor-pointer inline-flex items-center gap-1 whitespace-nowrap px-4 py-3 text-sm mobile:text-base font-bold uppercase tracking-widest transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
            "rounded-t-md mb-[-2px]",
            "border-2 border-transparent bg-transparent",
            "text-[var(--theme-primary)] hover:text-[var(--theme-primary)]",
            // Thin separator to the right, visually dividing it from sibling content items
            "after:content-[''] after:absolute after:right-0 after:top-3 after:bottom-3 after:w-px after:bg-[var(--theme-border-soft)]",
            className,
          )}
          {...props}
        >
          <Icon name="chevron-left" size={13} className="flex-shrink-0" aria-hidden="true" />
          {children as React.ReactNode}
        </NavLink>
      );
    }

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
      >
        {children as React.ReactNode}
      </NavLink>
    );
  },
);
TopNavLink.displayName = "TopNavLink";

export interface TopNavDropdownItem {
  id: string;
  label: string;
  to: string;
}

export interface TopNavDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Navigable items to populate the dropdown. */
  items: TopNavDropdownItem[];
  /** The id of the currently active item. */
  currentId: string;
  /** Optional label for the select element (visually hidden, for accessibility). */
  label?: string;
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

/**
 * A mobile-friendly companion to `TopNavList` that collapses navigation items into a styled select.
 * Use alongside `TopNavList` with responsive visibility classes.
 *
 * @example
 * ```tsx
 * <TopNavList className="hidden tablet:flex">...</TopNavList>
 * <TopNavDropdown className="tablet:hidden" items={stations} currentId={current.id} />
 * ```
 *
 * @summary mobile dropdown nav companion to TopNavList; use with responsive visibility classes
 */
export const TopNavDropdown = React.forwardRef<HTMLDivElement, TopNavDropdownProps>(
  ({ items, currentId, label = "Navigoi", theme, className, ...props }, ref) => {
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = items.find((item) => item.id === e.target.value);
      if (selected) {
        navigate(selected.to);
      }
    };

    return (
      <div ref={ref} data-theme={theme} className={cn("w-full font-sans", className)} {...props}>
        <label htmlFor="topnav-dropdown-select" className="sr-only">
          {label}
        </label>
        <div className="relative">
          <select
            id="topnav-dropdown-select"
            value={currentId}
            onChange={handleChange}
            className={cn(
              "w-full appearance-none cursor-pointer font-sans",
              "bg-[var(--theme-bg)] text-[var(--theme-text)]",
              "border border-[var(--theme-border-medium)] rounded-sm",
              "px-4 py-3 pr-10 text-sm font-semibold",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)]",
              "border-b-2 border-b-[var(--theme-primary)]",
            )}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-muted">
            <Icon name="chevron-down" size={16} aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  },
);
TopNavDropdown.displayName = "TopNavDropdown";

export interface TopNavContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TopNavContent = React.forwardRef<HTMLDivElement, TopNavContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = useTopNav();
    const isSelected = context.value === value;

    if (!isSelected) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`topnav-panel-${value}`}
        aria-labelledby={`topnav-item-${value}`}
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
TopNavContent.displayName = "TopNavContent";
