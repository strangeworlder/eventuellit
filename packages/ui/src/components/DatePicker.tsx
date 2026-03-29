import React from "react";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { Icon } from "./Icon";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
import { cn, obscureString } from "./utils";

// ── Finnish locale helpers ──

const FI_MONTHS = [
  "Tammikuu",
  "Helmikuu",
  "Maaliskuu",
  "Huhtikuu",
  "Toukokuu",
  "Kesäkuu",
  "Heinäkuu",
  "Elokuu",
  "Syyskuu",
  "Lokakuu",
  "Marraskuu",
  "Joulukuu",
] as const;

const FI_WEEKDAYS_SHORT = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"] as const;

function formatFi(date: Date): string {
  return date.toLocaleDateString("fi-FI");
}

function parseIso(iso: string): Date | null {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Returns the calendar grid rows for a given month.
 *  Week starts on Monday (Finnish locale). Each cell is a Date or null for padding.
 */
function buildCalendarGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Day of week with Monday = 0
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells: (Date | null)[] = [];

  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

// ── Types ──

export interface DatePickerProps {
  /** Controlled ISO value (YYYY-MM-DD) */
  value?: string;
  /** Uncontrolled default ISO value */
  defaultValue?: string;
  onChange?: (date: string | undefined) => void;
  label?: string;
  error?: string;
  /** Placeholder text shown when no date is selected. Defaults to "pp.kk.vvvv" */
  placeholder?: string;
  /** Minimum selectable date as ISO string */
  min?: string;
  /** Maximum selectable date as ISO string */
  max?: string;
  theme?: Theme;
  size?: "default" | "compact";
  disabled?: boolean;
  /** When true, blurs & disables the input with an obscured visual effect. */
  obscured?: boolean;
  className?: string;
  id?: string;
}

/**
 * Single-date picker with Finnish locale calendar. Accepts and emits ISO YYYY-MM-DD strings.
 * Keyboard: Enter/Space opens/closes, arrow keys navigate days, Escape closes.
 *
 * @summary Finnish-locale date picker; value/onChange in ISO YYYY-MM-DD; full keyboard nav
 */
export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      label,
      error,
      placeholder = "pp.kk.vvvv",
      min,
      max,
      theme,
      size = "default",
      disabled: disabledProp,
      obscured: obscuredProp,
      className,
      id: idProp,
    },
    ref,
  ) => {
    const obscured = obscuredProp || useObscured();
    const isDisabled = disabledProp || obscured;
    const { glitchStyle } = useObscuredGlitch(obscured);

    const generatedId = React.useId();
    const inputId = idProp ?? generatedId;
    const calendarId = `${inputId}-calendar`;

    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const selectedIso = isControlled ? value : internalValue;
    const selectedDate = selectedIso ? parseIso(selectedIso) : null;

    const today = new Date();
    const [viewYear, setViewYear] = React.useState(
      selectedDate?.getFullYear() ?? today.getFullYear(),
    );
    const [viewMonth, setViewMonth] = React.useState(selectedDate?.getMonth() ?? today.getMonth());

    const [focusedDate, setFocusedDate] = React.useState<Date | null>(null);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const calendarRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    const minDate = min ? parseIso(min) : null;
    const maxDate = max ? parseIso(max) : null;

    function isOutOfRange(d: Date): boolean {
      if (minDate && d < minDate) return true;
      if (maxDate && d > maxDate) return true;
      return false;
    }

    function openCalendar() {
      if (isDisabled) return;
      const base = selectedDate ?? today;
      setViewYear(base.getFullYear());
      setViewMonth(base.getMonth());
      setFocusedDate(base);
      setOpen(true);
    }

    function closeCalendar() {
      setOpen(false);
      triggerRef.current?.focus();
    }

    function selectDate(d: Date) {
      if (isOutOfRange(d)) return;
      const iso = toIso(d);
      if (!isControlled) setInternalValue(iso);
      onChange?.(iso);
      closeCalendar();
    }

    // Close on outside click
    React.useEffect(() => {
      if (!open) return;
      function handlePointerDown(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handlePointerDown);
      return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [open]);

    // Focus first focusable element in calendar when it opens
    React.useEffect(() => {
      if (!open || !calendarRef.current) return;
      const firstFocusable = calendarRef.current.querySelector<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      requestAnimationFrame(() => firstFocusable?.focus());
    }, [open]);

    function handleCalendarKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeCalendar();
        return;
      }
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;

      e.preventDefault();
      const base = focusedDate ?? selectedDate ?? today;
      let next = new Date(base);

      if (e.key === "ArrowLeft") next.setDate(next.getDate() - 1);
      if (e.key === "ArrowRight") next.setDate(next.getDate() + 1);
      if (e.key === "ArrowUp") next.setDate(next.getDate() - 7);
      if (e.key === "ArrowDown") next.setDate(next.getDate() + 7);

      if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
        setViewYear(next.getFullYear());
        setViewMonth(next.getMonth());
      }
      setFocusedDate(next);

      // Move DOM focus to the newly focused day button
      requestAnimationFrame(() => {
        const iso = toIso(next);
        const btn = calendarRef.current?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`);
        btn?.focus();
      });
    }

    function prevMonth() {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else setViewMonth((m) => m - 1);
    }

    function nextMonth() {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else setViewMonth((m) => m + 1);
    }

    const grid = buildCalendarGrid(viewYear, viewMonth);
    const displayValue = selectedDate ? formatFi(selectedDate) : "";
    const displayPlaceholder = obscured ? obscureString(placeholder) : placeholder;
    const displayText = obscured && displayValue ? obscureString(displayValue) : displayValue;

    const isCompact = size === "compact";

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "flex flex-col w-full relative",
          isCompact ? "gap-1 mt-1" : "gap-2 mt-2",
          obscured && "select-none pointer-events-none",
          className,
        )}
        data-theme={theme}
      >
        {label && (
          <FieldLabel obscured={obscured} htmlFor={inputId}>
            {label}
          </FieldLabel>
        )}

        {/* Input row */}
        <div className="relative">
          <button
            ref={triggerRef}
            id={inputId}
            type="button"
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={calendarId}
            aria-label={label ? undefined : "Valitse päivämäärä"}
            disabled={isDisabled}
            onClick={() => (open ? closeCalendar() : openCalendar())}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open ? closeCalendar() : openCalendar();
              }
              if (e.key === "Escape" && open) {
                e.preventDefault();
                closeCalendar();
              }
            }}
            data-text={obscured ? obscureString(displayValue || placeholder) : undefined}
            style={obscured ? glitchStyle : undefined}
            className={cn(
              "flex w-full items-center justify-between rounded-sm border-2 border-[var(--theme-border-medium)] bg-[var(--theme-bg)] font-bold text-[var(--theme-text)] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
              isCompact
                ? "h-7 px-2.5 py-0.5 text-[length:var(--font-size-xs)]"
                : "h-12 px-4 py-2 text-[length:var(--font-size-lg)]",
              !displayValue && "text-text-placeholder font-normal",
              error && "border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",
              obscured && "blur-[1.5px] obscured-glitch obscured-field",
            )}
          >
            <span>{displayText || displayPlaceholder}</span>
            <Icon
              name="calendar"
              size={isCompact ? 14 : 18}
              className="shrink-0 text-text-muted"
              aria-hidden="true"
            />
          </button>

          {/* Calendar panel */}
          {open && (
            <div
              ref={calendarRef}
              id={calendarId}
              role="dialog"
              aria-label="Valitse päivämäärä"
              aria-modal="true"
              onKeyDown={handleCalendarKeyDown}
              className={cn(
                "absolute left-0 z-50 mt-1 w-72 rounded-sm border border-[var(--theme-secondary)] bg-[var(--theme-bg)] p-3 shadow-[var(--shadow-overlay)] font-sans",
                "top-full",
              )}
            >
              {/* Month/year navigation */}
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={prevMonth}
                  aria-label="Edellinen kuukausi"
                  className="flex h-7 w-7 items-center justify-center rounded-sm text-text-muted hover:bg-[var(--theme-surface-tint)] hover:text-[var(--theme-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] transition-colors"
                >
                  <Icon name="chevron-left" size={16} aria-hidden="true" />
                </button>
                <span className="text-sm font-bold text-[var(--theme-text)] uppercase tracking-wide">
                  {FI_MONTHS[viewMonth]} {viewYear}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  aria-label="Seuraava kuukausi"
                  className="flex h-7 w-7 items-center justify-center rounded-sm text-text-muted hover:bg-[var(--theme-surface-tint)] hover:text-[var(--theme-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] transition-colors"
                >
                  <Icon name="chevron-right" size={16} aria-hidden="true" />
                </button>
              </div>

              {/* Weekday headers */}
              <div role="grid" aria-label={`${FI_MONTHS[viewMonth]} ${viewYear}`}>
                <div role="row" className="grid grid-cols-7 mb-1">
                  {FI_WEEKDAYS_SHORT.map((wd) => (
                    <div
                      key={wd}
                      role="columnheader"
                      aria-label={wd}
                      className="flex h-8 items-center justify-center text-xs font-bold text-text-muted uppercase"
                    >
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Day rows */}
                {grid.map((row, ri) => (
                  <div key={ri} role="row" className="grid grid-cols-7">
                    {row.map((day, di) => {
                      if (!day) {
                        return (
                          <div key={di} role="gridcell" aria-disabled="true" className="h-8" />
                        );
                      }
                      const iso = toIso(day);
                      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                      const isToday = isSameDay(day, today);
                      const isFocused = focusedDate ? isSameDay(day, focusedDate) : false;
                      const outOfRange = isOutOfRange(day);

                      return (
                        <div key={di} role="gridcell">
                          <button
                            type="button"
                            data-date={iso}
                            tabIndex={isFocused || (!focusedDate && isToday) ? 0 : -1}
                            aria-selected={isSelected}
                            aria-current={isToday ? "date" : undefined}
                            aria-disabled={outOfRange}
                            disabled={outOfRange}
                            onClick={() => selectDate(day)}
                            onFocus={() => setFocusedDate(day)}
                            className={cn(
                              "flex h-8 w-full items-center justify-center rounded-sm text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]",
                              isSelected
                                ? "bg-[var(--theme-accent)] text-[var(--theme-accent-foreground)]"
                                : isToday
                                  ? "border border-[var(--theme-secondary)] text-[var(--theme-text)] hover:bg-[var(--theme-surface-tint)]"
                                  : "text-[var(--theme-text)] hover:bg-[var(--theme-surface-tint)]",
                              outOfRange && "opacity-40 cursor-not-allowed hover:bg-transparent",
                            )}
                          >
                            {day.getDate()}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";
