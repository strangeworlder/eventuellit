import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

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
  /** Optional function or property name to extract a unique key for each row. */
  rowKey?: ((row: T) => React.Key) | (keyof T & string);
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

export interface TableRootProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Theme override — sets `data-theme` on the wrapper element. */
  theme?: Theme;
  /** Additional class names applied to the scroll wrapper. */
  wrapperClassName?: string;
  /** Optional ref forwarded to the scroll wrapper element. */
  wrapperRef?: React.Ref<HTMLDivElement>;
}

/**
 * Scrollable container and styled `<table>` primitive shared by `Table` and `MarkdownRenderer`.
 */
export const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  ({ theme, wrapperClassName, wrapperRef, className, children, ...props }, ref) => (
    <div
      ref={wrapperRef}
      data-theme={theme}
      className={cn(
        "w-full overflow-auto rounded-lg ds-luminous-surface font-sans",
        wrapperClassName,
      )}
    >
      {/*
        border-separate + border-spacing-0 is required for sticky thead to work.
        border-collapse disables position:sticky on thead/th in all browsers.
      */}
      <table
        ref={ref}
        className={cn("w-full border-separate border-spacing-0 text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
);
TableRoot.displayName = "TableRoot";

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Keep the header row pinned when scrolling vertically. */
  sticky?: boolean;
}

/** Semantic `<thead>` primitive matching the design system table surface. */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ sticky = false, className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("bg-[var(--theme-surface-tint)]", sticky && "sticky top-0 z-10", className)}
      {...props}
    />
  ),
);
TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Alternate row backgrounds for easier row scanning. */
  striped?: boolean;
}

/** Semantic `<tbody>` primitive with subtle inter-row dividers and optional striping. */
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ striped = false, className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        "[&_tr:not(:last-child)>td]:border-b [&_tr:not(:last-child)>td]:border-[var(--theme-border-soft)]",
        striped && "[&>tr:nth-child(even)]:bg-[var(--theme-surface-tint)]",
        className,
      )}
      {...props}
    />
  ),
);
TableBody.displayName = "TableBody";

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

/** Semantic `<tr>` primitive with hover highlight. */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("transition-colors hover:bg-[var(--theme-surface-tint)]", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Tighter cell padding for compact tables. */
  compact?: boolean;
}

/** Semantic `<th>` primitive preserving high-contrast header typography. */
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ compact = false, className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        compact ? "px-3 py-2" : "px-4 py-3",
        // text-[var(--theme-text)] instead of text-text-muted: text-muted is 7:1 against
        // --theme-bg but only ~4.1:1 against --theme-surface-tint used as the header bg.
        "border-b border-[var(--theme-border-soft)] text-left text-xs font-semibold uppercase tracking-wider text-[var(--theme-text)]",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Tighter cell padding for compact tables. */
  compact?: boolean;
}

/** Semantic `<td>` primitive for table data cells. */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ compact = false, className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(compact ? "px-3 py-1.5" : "px-4 py-3", "text-[var(--theme-text)]", className)}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

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
    rowKey,
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

  const getRowKey = (row: T, index: number): React.Key => {
    if (rowKey) {
      return typeof rowKey === "function" ? rowKey(row) : String(row[rowKey]);
    }
    if ("id" in row && (typeof row.id === "string" || typeof row.id === "number")) {
      return row.id;
    }
    if ("key" in row && (typeof row.key === "string" || typeof row.key === "number")) {
      return row.key;
    }
    const firstCol = columns[0]?.key;
    if (firstCol && (typeof row[firstCol] === "string" || typeof row[firstCol] === "number")) {
      return `row-${row[firstCol]}`;
    }
    return `table-row-${index}`;
  };

  return (
    <TableRoot wrapperRef={ref} theme={theme} wrapperClassName={className}>
      {caption && (
        <caption className="caption-bottom pb-3 pt-1 text-xs uppercase tracking-wider text-text-muted">
          {caption}
        </caption>
      )}

      <TableHeader sticky={stickyHeader}>
        <TableRow className="hover:bg-transparent">
          {columns.map((col) => (
            <TableHead
              key={col.key}
              scope="col"
              compact={isCompact}
              className={cn({
                "text-left": !col.align || col.align === "left",
                "text-right": col.align === "right",
                "text-center": col.align === "center",
              })}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody striped={striped}>
        {data.map((row, rowIndex) => (
          <TableRow key={getRowKey(row, rowIndex)}>
            {columns.map((col) => {
              const value = row[col.key];
              return (
                <TableCell
                  key={col.key}
                  compact={isCompact}
                  className={cn({
                    "text-left": !col.align || col.align === "left",
                    "text-right tabular-nums": col.align === "right",
                    "text-center": col.align === "center",
                  })}
                >
                  {col.render ? col.render(value, row) : String(value ?? "")}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );
}) as unknown as TableComponent & { displayName: string };

Table.displayName = "Table";
