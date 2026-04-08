import React from "react";
import { Button } from "./Button";
import { FieldLabel } from "./FieldLabel";
import { Input } from "./Input";
import { useObscured } from "./ObscuredWrapper";
import { Select } from "./Select";
import type { SelectOption } from "./Select";
import { TextArea } from "./TextArea";
import { Text } from "./Text";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
import { cn, obscureString } from "./utils";

export interface EditableFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label displayed above the value. Passed to `FieldLabel` — uppercase, tracked, secondary colour. */
  label: string;
  /** Current persisted string value. */
  value: string;
  /** Shown as italic placeholder when `value` is empty and the field is editable. */
  placeholder?: string;
  /**
   * When `true`, renders a `TextArea` (multi-line) in edit mode instead of a single-line `Input`.
   * Mutually exclusive with `options`.
   * @default false
   */
  multiline?: boolean;
  /**
   * Prevents editing. When `true` the field renders static label + text.
   * When `true` and `value` is empty, the component renders `null`.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Called with the committed value when the user saves.
   * Omitting this prop does not break the component — it just prevents saves.
   */
  onSave?: (value: string) => void;
  /** Scopes a `data-theme` attribute to the component root element for theme overrides. */
  theme?: Theme;
  /**
   * When `true`, blurs and disables the field with the system glitch effect.
   * Also activated automatically when a parent `ObscuredWrapper` has `revealed={false}`.
   */
  obscured?: boolean;
  /**
   * Finnish label for the save action button.
   * @default "Tallenna"
   */
  saveLabel?: string;
  /**
   * Finnish label for the cancel action button.
   * @default "Peruuta"
   */
  cancelLabel?: string;
  /**
   * When provided, the field switches to **select mode**: a compact `Select` is rendered in edit
   * mode instead of an `Input`. Selecting an option auto-saves and exits edit mode — no explicit
   * Save button is shown. Mutually exclusive with `multiline`.
   *
   * In view / read-only mode, the selected option's **label** (resolved from this array) is shown
   * instead of the raw `value` string.
   */
  options?: SelectOption[];
  /**
   * Placeholder shown as the first disabled option inside the compact `Select` (select mode only).
   */
  selectPlaceholder?: string;
}

/** Resolves the display label for a value from an options array. Falls back to the raw value. */
function resolveOptionLabel(value: string, options: SelectOption[]): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/**
 * Inline editable text field with three states: read-only display, clickable trigger, and edit mode.
 *
 * - **Read-only + empty:** renders `null` — no DOM emitted.
 * - **Read-only + value:** renders `FieldLabel` + static `Text`.
 * - **Editable (view):** renders `FieldLabel` + clickable text trigger (or italic placeholder).
 * - **Editable (edit):**
 *   - Default: `FieldLabel` + `Input` (single-line) or `TextArea` (multiline) + Save/Cancel buttons.
 *   - Select mode (`options` prop): `FieldLabel` + compact `Select` + Cancel button.
 *     Choosing an option immediately saves and closes — no Save button needed.
 *
 * Integrates with `ObscuredWrapper` context. Accepts a `theme` prop for scoped theme overrides.
 * Use `multiline` for paragraph fields, `options` for enumerated selection, or omit both for single-line.
 *
 * @summary inline editable text field with read-only/view/edit states; supports single-line, multiline, and select mode
 */
export const EditableField = React.forwardRef<HTMLDivElement, EditableFieldProps>(
  function EditableField(
    {
      className,
      label,
      value,
      placeholder,
      multiline = false,
      readOnly = false,
      onSave,
      theme,
      obscured: obscuredProp,
      saveLabel = "Tallenna",
      cancelLabel = "Peruuta",
      options,
      selectPlaceholder,
      ...props
    },
    ref,
  ) {
    const isObscured = obscuredProp || useObscured();
    const { glitchStyle } = useObscuredGlitch(isObscured);

    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value);
    // Keep a ref to the trigger so focus can be returned after cancel/save
    const triggerRef = React.useRef<HTMLSpanElement>(null);

    // Sync draft when value prop changes while not editing (e.g. optimistic mutation)
    React.useEffect(() => {
      if (!editing) {
        setDraft(value);
      }
    }, [value, editing]);

    const openEdit = () => {
      if (readOnly || isObscured) return;
      setDraft(value);
      setEditing(true);
    };

    const save = () => {
      onSave?.(draft);
      setEditing(false);
      // Return focus to the display trigger so keyboard users stay oriented
      requestAnimationFrame(() => triggerRef.current?.focus());
    };

    const cancel = () => {
      setDraft(value);
      setEditing(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };

    // Derive the display label for select mode
    const displayValue = options ? resolveOptionLabel(value, options) : value;
    const displayPlaceholder = placeholder;

    // ── Read-only: hide empty fields entirely ──
    if (readOnly && !value) {
      return null;
    }

    // ── Read-only: static display ──
    if (readOnly) {
      return (
        <div
          ref={ref}
          className={cn("font-sans flex flex-col gap-1", className)}
          data-theme={theme}
          {...props}
        >
          <FieldLabel obscured={isObscured}>{label}</FieldLabel>
          <Text
            variant="small"
            className={cn(
              multiline && "whitespace-pre-wrap",
              isObscured && "blur-[5.5px] obscured-glitch select-none",
            )}
            data-text={isObscured ? obscureString(displayValue) : undefined}
            style={isObscured ? glitchStyle : undefined}
          >
            {isObscured ? obscureString(displayValue) : displayValue}
          </Text>
        </div>
      );
    }

    // ── Edit mode ──
    if (editing) {
      return (
        <div
          ref={ref}
          className={cn("font-sans flex flex-col gap-1", className)}
          data-theme={theme}
          {...props}
        >
          <FieldLabel obscured={isObscured}>{label}</FieldLabel>

          {/* ── Select mode ── */}
          {options ? (
            <>
              <Select
                size="compact"
                value={draft}
                options={options}
                placeholder={selectPlaceholder}
                onChange={(e) => {
                  const selected = e.target.value;
                  setDraft(selected);
                  onSave?.(selected);
                  setEditing(false);
                  requestAnimationFrame(() => triggerRef.current?.focus());
                }}
                // biome-ignore lint/a11y/noAutofocus: intentional — edit mode opens inline
                autoFocus
              />
              <div className="flex items-center gap-3 mt-1">
                <Button size="compact" variant="ghost-subtle" onClick={cancel}>
                  {cancelLabel}
                </Button>
              </div>
            </>
          ) : multiline ? (
            /* ── Multiline mode ── */
            <>
              <TextArea
                size="compact"
                value={draft}
                className="h-20"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancel();
                }}
                // biome-ignore lint/a11y/noAutofocus: intentional — edit mode opens inline
                autoFocus
              />
              <div className="flex items-center gap-3 mt-1">
                <Button size="compact" onClick={save}>
                  {saveLabel}
                </Button>
                <Button size="compact" variant="ghost-subtle" onClick={cancel}>
                  {cancelLabel}
                </Button>
              </div>
            </>
          ) : (
            /* ── Single-line mode ── */
            <>
              <Input
                size="compact"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                  if (e.key === "Escape") cancel();
                }}
                // biome-ignore lint/a11y/noAutofocus: intentional — edit mode opens inline
                autoFocus
              />
              <div className="flex items-center gap-3 mt-1">
                <Button size="compact" onClick={save}>
                  {saveLabel}
                </Button>
                <Button size="compact" variant="ghost-subtle" onClick={cancel}>
                  {cancelLabel}
                </Button>
              </div>
            </>
          )}
        </div>
      );
    }

    // ── Editable view mode ──
    return (
      <div
        ref={ref}
        className={cn(
          "font-sans flex flex-col gap-1",
          isObscured && "select-none pointer-events-none",
          className,
        )}
        data-theme={theme}
        {...props}
      >
        <FieldLabel obscured={isObscured}>{label}</FieldLabel>
        {/* The trigger must be keyboard-accessible: role="button", tabIndex, Enter/Space handlers */}
        <span
          ref={triggerRef}
          role="button"
          tabIndex={isObscured ? -1 : 0}
          aria-label={`Muokkaa kenttää: ${label}`}
          onClick={openEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openEdit();
            }
          }}
          data-text={isObscured ? obscureString(displayValue || displayPlaceholder || "") : undefined}
          style={isObscured ? glitchStyle : undefined}
          className={cn(
            "text-[length:var(--font-size-sm)] text-[var(--theme-text)] cursor-pointer",
            multiline && "whitespace-pre-wrap",
            // Hover: hint the field is interactive
            "hover:text-[var(--theme-secondary)] transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-easing-default)]",
            // Focus ring — matches all other interactive DS elements
            "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
            isObscured && "obscured-glitch select-none",
          )}
        >
          {displayValue ? (
            isObscured ? (
              <span className="blur-[5.5px]">{obscureString(displayValue)}</span>
            ) : (
              displayValue
            )
          ) : (
            <span className={cn("italic text-text-placeholder", isObscured && "blur-[5.5px]")}>
              {isObscured ? obscureString(displayPlaceholder ?? "") : displayPlaceholder}
            </span>
          )}
        </span>
      </div>
    );
  },
);

EditableField.displayName = "EditableField";
