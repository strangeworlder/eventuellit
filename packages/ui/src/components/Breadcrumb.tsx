import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface BreadcrumbItem {
  /** Display label for this breadcrumb segment. */
  label: string;
  /** If provided, this segment is rendered as a link. Omit for the current (last) page. */
  to?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Ordered list of segments from root to current page. */
  items: BreadcrumbItem[];
  theme?: Theme;
}

/**
 * Hierarchical navigation trail showing the user's location within the app.
 * The last item is always rendered as plain text (current page); earlier items link upward.
 *
 * Responsive: on desktop the full trail is shown (`Maailma > Kynnys > Seula`).
 * On mobile (below `tablet`) with 3+ items, collapses to a single back-link to the direct parent.
 *
 * @summary breadcrumb navigation trail; last item is current page (no link); collapses on mobile
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, theme, className, ...props }, ref) => {
    if (items.length === 0) return null;

    const parentItem = items.length >= 2 ? items[items.length - 2] : null;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        data-theme={theme}
        className={cn("font-sans", className)}
        {...props}
      >
        {/* Mobile: collapsed back-link shown only when 3+ items */}
        {items.length >= 3 && parentItem?.to && (
          <ol className="tablet:hidden flex items-center gap-1" aria-label="Breadcrumb (lyhyt)">
            <li className="flex items-center gap-1">
              <Icon name="chevron-left" size={14} className="text-text-subtle flex-shrink-0" />
              <ReactRouterLink
                to={parentItem.to}
                className="text-sm text-text-muted hover:text-[var(--theme-text)] transition-colors duration-200 font-medium"
              >
                {parentItem.label}
              </ReactRouterLink>
            </li>
          </ol>
        )}

        {/* Desktop: full trail (always shown on tablet+, shown on mobile for 1-2 items) */}
        <ol
          className={cn(
            "flex items-center gap-1 flex-wrap",
            items.length >= 3 && "hidden tablet:flex",
          )}
          aria-label="Breadcrumb (täysi)"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                {!isFirst && (
                  <Icon
                    name="chevron-right"
                    size={12}
                    className="text-text-subtle flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
                {isLast || !item.to ? (
                  <span
                    className="text-sm text-[var(--theme-text)] font-semibold"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <ReactRouterLink
                    to={item.to}
                    className="text-sm text-text-muted hover:text-[var(--theme-text)] transition-colors duration-200"
                  >
                    {item.label}
                  </ReactRouterLink>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
