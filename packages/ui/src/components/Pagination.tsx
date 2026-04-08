import * as React from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Optional theme override */
  theme?: Theme;
}

/**
 * Page navigation control. Shows previous/next buttons and numbered page indicators
 * with ellipsis collapsing for large page counts.
 *
 * @summary page navigation; shows prev/next + page numbers with ellipsis; accessible nav
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, theme, ...props }, ref) => {
    const getPageNumbers = (): (number | "ellipsis")[] => {
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages: (number | "ellipsis")[] = [1];

      if (currentPage <= 4) {
        pages.push(2, 3, 4, 5, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages,
        );
      }

      return pages;
    };

    const pages = getPageNumbers();
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
      <nav
        ref={ref}
        data-theme={theme}
        aria-label="Sivunvaihto"
        className={cn("flex items-center gap-1 font-sans", className)}
        {...props}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          aria-label="Edellinen sivu"
        >
          <Icon name="chevron-left" size={16} />
        </Button>

        {pages.map((page, index) => {
          if (page === "ellipsis") {
            const ellipsisKey = `ellipsis-${index}`;
            return (
              <span
                key={ellipsisKey}
                className="flex items-center justify-center w-8 h-8 text-[var(--theme-text-subtle)] text-[length:var(--font-size-sm)] select-none"
                aria-hidden
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              variant={isActive ? "ghost" : "ghost-subtle"}
              size="icon"
              onClick={() => onPageChange(page)}
              aria-label={`Sivu ${page}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "w-8 h-8 min-w-0 text-[length:var(--font-size-sm)]",
                isActive && "bg-[var(--theme-surface-tint)] text-[var(--theme-text)] font-bold",
              )}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Seuraava sivu"
        >
          <Icon name="chevron-right" size={16} />
        </Button>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
