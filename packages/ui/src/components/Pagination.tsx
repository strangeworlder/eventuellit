import React from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { cn } from "./utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Total number of pages */
  pageCount: number;
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show around the current page. Default: 1 */
  siblingCount?: number;
}

function getPageRange(
  currentPage: number,
  pageCount: number,
  siblingCount: number,
): (number | "ellipsis")[] {
  // Always show: first, last, current ± siblingCount
  const range = new Set<number>();
  range.add(1);
  range.add(pageCount);

  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(pageCount - 1, currentPage + siblingCount);
  for (let i = start; i <= end; i++) {
    range.add(i);
  }

  const sorted = Array.from(range).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const page = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && page - prev > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  }

  return result;
}

/**
 * Page navigation with prev/next buttons and numbered page indicators.
 * Hides automatically when pageCount ≤ 1.
 *
 * @summary page navigation; prev/next + numbered pages with ellipsis truncation
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    { pageCount, currentPage, onPageChange, siblingCount = 1, className, ...props },
    ref,
  ) => {
    if (pageCount <= 1) return null;

    const pages = getPageRange(currentPage, pageCount, siblingCount);

    return (
      <nav
        ref={ref}
        aria-label="Sivunavigaatio"
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
      >
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Edellinen sivu"
        >
          <Icon name="chevron-left" size={16} />
        </Button>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-[var(--theme-text-muted)] select-none"
              aria-hidden
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "solid" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page)}
              aria-label={`Sivu ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === pageCount}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Seuraava sivu"
        >
          <Icon name="chevron-right" size={16} />
        </Button>
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";
