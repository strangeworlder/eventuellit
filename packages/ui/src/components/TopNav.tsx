import React, { useCallback } from "react";
import { NavLink, type NavLinkProps, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { cn } from "./utils";
import { usePillIndicator } from "./usePillIndicator";

export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Accessible name for the navigation landmark (recommended when multiple `nav` regions exist).
   */
  "aria-label"?: string;
}

/**
 * Top-level navigation bar for content sections. Designed with a physical binder aesthetic.
 * Use `TopNavLink` for router-linked items. Add `TopNavLink variant="parent"` as the first item
 * for hierarchy back-navigation. Use `TopNavDropdown` on mobile as a companion to `TopNavList`.
 *
 * For in-page tab panels (state-driven), use `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent`.
 *
 * @summary top navigation bar; TopNavLink for router items, TopNavDropdown for mobile
 */
export const TopNav = React.forwardRef<HTMLElement, TopNavProps>(({ className, ...props }, ref) => {
  return <nav ref={ref} className={cn("flex flex-col", className)} {...props} />;
});
TopNav.displayName = "TopNav";

const NAV_ITEM_SELECTOR = "[data-nav-item]";

function isNavItemActive(el: HTMLElement): boolean {
  return el.getAttribute("aria-current") === "page";
}

export interface TopNavListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TopNavList = React.forwardRef<HTMLDivElement, TopNavListProps>(
  ({ className, style, ...props }, ref) => {
    const activeCheck = useCallback((el: HTMLElement) => isNavItemActive(el), []);
    const { listRef, style: pillStyle, settleClassName, handlers } = usePillIndicator({
      itemSelector: NAV_ITEM_SELECTOR,
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

    return (
      <div
        ref={setRefs}
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
        onMouseOver={handlers.onMouseOver}
        onMouseLeave={handlers.onMouseLeave}
        onClick={handlers.onClick}
        {...props}
      />
    );
  },
);
TopNavList.displayName = "TopNavList";

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
 * Active state is determined by the current URL (`aria-current="page"`).
 * Use `variant="parent"` for a visually distinct back-navigation item.
 */
export const TopNavLink = React.forwardRef<HTMLAnchorElement, TopNavLinkProps>(
  ({ className, theme, variant = "default", children, ...props }, ref) => {
    if (variant === "parent") {
      return (
        <NavLink
          ref={ref}
          data-nav-item
          data-theme={theme}
          className={({ isActive }) =>
            cn(
              "relative cursor-pointer inline-flex items-center gap-1 whitespace-nowrap px-4 py-3 text-sm mobile:text-base font-bold uppercase tracking-widest transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
              "rounded-t-md mb-[-2px]",
              "border-2 border-transparent bg-transparent",
              "text-[var(--theme-primary)] hover:text-[var(--theme-primary)]",
              "after:content-[''] after:absolute after:right-0 after:top-3 after:bottom-3 after:w-px after:bg-[var(--theme-border-soft)]",
              isActive && "[anchor-name:--active-tab]",
              className,
            )
          }
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
        data-nav-item
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
