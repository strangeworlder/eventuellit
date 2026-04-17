import React from "react";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ComboboxOption {
  /** Unique value string stored/emitted on selection */
  value: string;
  /** Primary label shown in results dropdown */
  label: string;
  /** Optional secondary line for additional context (e.g., owner name, category) */
  description?: string;
}

export interface ComboboxProps {
  /** Options to search over */
  options: ComboboxOption[];
  /** Controlled search query */
  query: string;
  /** Called on every keystroke to update search query */
  onQueryChange: (query: string) => void;
  /** Called when the user selects an option. Query is NOT automatically cleared — caller handles it. */
  onSelect: (value: string) => void;
  /** Placeholder for the search input */
  placeholder?: string;
  /** Label rendered above the input */
  label?: string;
  /** Validation error message */
  error?: string;
  /** When true, disables the input */
  disabled?: boolean;
  /** Max results shown in dropdown at once. Defaults to 8. */
  maxResults?: number;
  /** "compact" reduces input height to match compact Input scale */
  size?: "default" | "compact";
  /** Theme override */
  theme?: Theme;
  /** When true, shows a loading spinner next to the input */
  loading?: boolean;
  className?: string;
}

/**
 * Searchable combobox for selecting a single item from a filtered list.
 * Shows results in a dropdown below the input as the user types.
 * Does NOT manage its own query state — caller controls `query` and `onQueryChange`.
 *
 * Use when you need to pick an entity from a potentially long list
 * (e.g., assigning a character, selecting a category).
 *
 * @summary searchable single-select from a filterable list; caller controls query state
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      query,
      onQueryChange,
      onSelect,
      placeholder,
      label,
      error,
      disabled = false,
      maxResults = 8,
      size = "default",
      theme,
      loading = false,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const inputId = React.useId();
    const listId = React.useId();

    const filtered = query.trim()
      ? options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          (o.description?.toLowerCase().includes(query.toLowerCase()) ?? false),
        )
      : [];

    const visible = filtered.slice(0, maxResults);
    const showDropdown = open && visible.length > 0;

    const handleSelect = (value: string) => {
      onSelect(value);
      setOpen(false);
    };

    return (
      <div
        className={cn(
          "flex flex-col w-full",
          size === "compact" ? "gap-1 mt-1" : "gap-2 mt-2",
        )}
        data-theme={theme}
      >
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={showDropdown ? listId : undefined}
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className={cn(
              "flex w-full rounded-sm border-2 border-[var(--theme-border-medium)] bg-[var(--theme-bg)] font-bold text-[var(--theme-text)] shadow-sm transition-all placeholder:text-text-placeholder",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              size === "default" && "h-12 px-4 py-2 text-[length:var(--font-size-lg)]",
              size === "compact" && "h-7 px-2.5 py-0.5 text-[length:var(--font-size-xs)] pr-7",
              error && "border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",
              className,
            )}
          />

          {/* Right-side indicator */}
          <div
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted",
            )}
            aria-hidden="true"
          >
            {loading ? (
              <Icon name="loader2" size={14} className="animate-spin" />
            ) : (
              <Icon name="search" size={size === "compact" ? 12 : 16} />
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <ul
              id={listId}
              role="listbox"
              className={cn(
                "absolute z-20 left-0 right-0 mt-1 rounded-sm border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] shadow-[var(--shadow-overlay)] overflow-hidden",
              )}
            >
              {visible.map((option) => (
                <li key={option.value} role="option" aria-selected={false}>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left px-3 py-2 font-sans transition-colors",
                      "hover:bg-[var(--theme-surface-tint)] active:bg-[var(--theme-surface-tint)]",
                      size === "compact"
                        ? "text-[length:var(--font-size-xs)]"
                        : "text-[length:var(--font-size-sm)]",
                    )}
                    onMouseDown={(e) => {
                      // Prevent input blur before we register the selection
                      e.preventDefault();
                      handleSelect(option.value);
                    }}
                  >
                    <span className="font-semibold text-[var(--theme-text)]">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="ml-2 text-text-muted text-[length:var(--font-size-xs)]">
                        {option.description}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  },
);
Combobox.displayName = "Combobox";
