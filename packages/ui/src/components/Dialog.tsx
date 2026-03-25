import React from "react";
import ReactDOM from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Heading, HeadingLevelProvider } from "./Heading";
import { cn } from "./utils";
import type { Theme } from "./Theme";
import { useFocusTrap } from "./useFocusTrap";

// ── Dialog ──

/**
 * Modal dialog with focus trap, title, description, and footer action slot.
 * Renders via React portal; closes on Escape, backdrop click, or close button.
 * Use for confirmations, focused forms, and destructive-action prompts.
 * For slide-in panels use Drawer instead.
 *
 * @summary modal dialog with focus trap; for slide-in panels use Drawer
 */
export interface DialogProps {
  /** Controls whether the dialog is open */
  open: boolean;
  /** Called when dialog should close (Escape, backdrop click, close button) */
  onClose: () => void;
  /** Visible dialog title — rendered as a heading and used for aria-label */
  title: string;
  /** Optional descriptive text shown below the title */
  description?: React.ReactNode;
  /** Dialog content */
  children?: React.ReactNode;
  /** Footer content (action buttons) */
  footer?: React.ReactNode;
  /** Maximum width of the dialog panel */
  size?: "sm" | "md" | "lg" | "xl";
  /** Hides the close button in the header (backdrop + Escape still close) */
  hideCloseButton?: boolean;
  /** Theme override for the dialog panel */
  theme?: Theme;
  className?: string;
}

const sizeClasses: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      children,
      footer,
      size = "md",
      hideCloseButton = false,
      theme,
      className,
    },
    ref,
  ) => {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
    const titleId = React.useId();
    const descriptionId = React.useId();

    useFocusTrap(open, panelRef);

    // Focus management and body scroll lock
    React.useEffect(() => {
      if (!open) return;

      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus the close button or first focusable element
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });

      return () => {
        document.body.style.overflow = previousOverflow;
        previouslyFocusedRef.current?.focus();
      };
    }, [open]);

    // Escape key
    React.useEffect(() => {
      if (!open) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    if (!open || typeof document === "undefined") return null;

    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          ref={(node) => {
            panelRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          data-theme={theme}
          className={cn(
            "relative z-10 w-full rounded-xl border border-[var(--theme-secondary)] bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans",
            "shadow-[var(--shadow-floating)]",
            "flex flex-col max-h-[90vh]",
            sizeClasses[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[var(--theme-border-soft)] px-6 py-4 shrink-0">
            <HeadingLevelProvider>
              <div className="space-y-1">
                <Heading id={titleId} variant="h3">{title}</Heading>
                {description && (
                  <p id={descriptionId} className="text-sm text-text-muted">
                    {description}
                  </p>
                )}
              </div>
            </HeadingLevelProvider>
            {!hideCloseButton && (
              <Button
                ref={closeButtonRef}
                variant="ghost-subtle"
                size="icon"
                onClick={onClose}
                aria-label="Sulje"
                className="shrink-0"
              >
                <Icon name="x" size={18} />
              </Button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-[var(--theme-border-soft)] px-6 py-4 shrink-0 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  },
);
Dialog.displayName = "Dialog";
