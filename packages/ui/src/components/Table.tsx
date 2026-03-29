import React from "react";
import { cn } from "./utils";
import type { Theme } from "./Theme";

export interface TableColumn<T> {
  /** The data key to read from each row object. */
  key: keyof T & string;
  /** Display label shown in the header cell. */
  header: string;
  /**
   * Text alignment within the column. Defaults to `"left"`.
   * Use `"right"` for numeric data to align decimal points.
   */
  align?: "left" | "right" | "center";
  /**
   * Custom cell renderer. Receives the raw cell value and the full row object.
   * Return any React node — useful for rendering badges, icons, or formatted values.
   */
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T extends Record<string, unknown>> {
  /** Column definitions array, ordered left to right. */
  columns: TableColumn<T>[];
  /** Row data. Each object must contain at least the keys referenced by `columns`. */
  data: T[];
  /** Accessible caption rendered below the table. */
  caption?: string;
  /**
   * Visual density variant.
   * - `default` (default): Standard cell padding.
   * - `compact`: Tighter padding for data-dense contexts.
   */
  variant?: "default" | "compact";
  /** Alternate row backgrounds for easier row scanning. */
  striped?: boolean;
  /** Keep the header row in view when the table's container scrolls vertically. */
  stickyHeader?: boolean;
  /** Theme override — sets `data-theme` on the wrapper element. */
  theme?: Theme;
  /** Additional class names applied to the scroll wrapper. */
  className?: string;
}

type TableComponent = <T extends Record<string, unknown>>(
  props: TableProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

/**
 * Data-driven table component. Pass `columns` definitions and a `data` array; the table
 * handles header, row rendering, alignment, and optional visual features.
 *
 * @summary data-driven table; variant: default/compact; striped rows, sticky header, numeric alignment
 */
export const Table = React.forwardRef(function TableInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    caption,
    variant = "default",
    striped = false,
    stickyHeader = false,
    theme,
    className,
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const isCompact = variant === "compact";
  const cellPx = isCompact ? "px-3" : "px-4";
  const cellPy = isCompact ? "py-1.5" : "py-3";
  const headPy = isCompact ? "py-2" : "py-3";

  return (
    <div
      ref={ref}
      data-theme={theme}
      className={cn(
        "w-full overflow-auto rounded-lg border border-[var(--theme-border-soft)] font-sans",
        className,
      )}
    >
      {/*
        border-separate + border-spacing-0 is required for sticky thead to work.
        border-collapse disables position:sticky on thead/th in all browsers.
      */}
      <table className="w-full border-separate border-spacing-0 text-sm">
        {caption && (
          <caption className="caption-bottom pb-3 pt-1 text-xs uppercase tracking-wider text-text-muted">
            {caption}
          </caption>
        )}

        <thead
          className={cn("bg-[var(--theme-surface-tint)]", {
            "sticky top-0 z-10": stickyHeader,
          })}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  cellPx,
                  headPy,
                  // text-[var(--theme-text)] instead of text-text-muted: text-muted is 7:1 against
                  // --theme-bg but only ~4.1:1 against --theme-surface-tint used as the header bg.
                  "border-b border-[var(--theme-border-soft)] text-xs font-semibold uppercase tracking-wider text-[var(--theme-text)]",
                  {
                    "text-left": !col.align || col.align === "left",
                    "text-right": col.align === "right",
                    "text-center": col.align === "center",
                  },
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => {
            const isLastRow = rowIndex === data.length - 1;
            return (
              <tr
                // Row objects may lack a stable id; index is acceptable for static tables
                // eslint-disable-next-line react/no-array-index-key
                key={rowIndex}
                className={cn(
                  "transition-colors hover:bg-[var(--theme-surface-tint)]",
                  striped && rowIndex % 2 === 1
                    ? "bg-[var(--theme-surface-tint)]"
                    : "bg-[var(--theme-bg)]",
                )}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        cellPx,
                        cellPy,
                        "text-[var(--theme-text)]",
                        // With border-separate, borders live on cells, not rows
                        !isLastRow && "border-b border-[var(--theme-border-soft)]",
                        {
                          "text-left": !col.align || col.align === "left",
                          "text-right tabular-nums": col.align === "right",
                          "text-center": col.align === "center",
                        },
                      )}
                    >
                      {col.render ? col.render(value, row) : String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}) as unknown as TableComponent & { displayName: string };

Table.displayName = "Table";
