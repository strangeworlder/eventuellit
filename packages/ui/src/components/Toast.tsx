import React from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";
import { Icon, type IconName } from "./Icon";
import { Button } from "./Button";

// ── Types ──

export type ToastVariant = "info" | "success" | "error" | "warning";

export interface ToastItem {
  id: string;
  message: React.ReactNode;
  variant?: ToastVariant;
  /** Duration in ms before auto-dismiss. Pass 0 to persist until manually closed. */
  duration?: number;
  /** Optional action label + callback shown in the toast */
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ── Cross-MFE event bridge ──
// MFEs cannot share React context with the host (they bundle their own @repo/ui copy).
// Instead, MFEs dispatch this CustomEvent on window; the host's ToastProvider listens
// and renders the toast — the same pattern used by article-progress-events.

export const TOAST_REQUEST_EVENT = "ui:toast-request";

export type ToastRequestPayload = Omit<ToastItem, "id">;

/**
 * Dispatches a toast request via a window CustomEvent.
 * Use this from any MFE to show a toast managed by the host's ToastProvider.
 * Falls back gracefully (no-op) when no host listener is present (e.g. standalone dev mode).
 */
export function requestToast(payload: ToastRequestPayload): void {
  window.dispatchEvent(new CustomEvent<ToastRequestPayload>(TOAST_REQUEST_EVENT, { detail: payload }));
}

// ── Context ──

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Icon map ──

const variantIcons: Record<ToastVariant, IconName> = {
  info: "info",
  success: "circle-check",
  error: "circle-x",
  warning: "alert-triangle",
};

const variantClasses: Record<ToastVariant, string> = {
  info: "border-[var(--theme-secondary)] text-[var(--theme-secondary)]",
  success: "border-secondary-400 text-secondary-400",
  error: "border-[var(--theme-primary)] text-[var(--theme-primary)]",
  warning: "border-primary-400 text-primary-400",
};

// ── Single Toast UI ──

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

const DEFAULT_DURATION = 4000;

const ToastCard = React.memo(function ToastCard({ item, onDismiss }: ToastCardProps) {
  const { id, message, variant = "info", duration = DEFAULT_DURATION, action } = item;
  const [exiting, setExiting] = React.useState(false);

  const dismiss = React.useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 250);
  }, [id, onDismiss]);

  React.useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [dismiss, duration]);

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "relative flex items-start gap-3 rounded-lg border bg-[var(--theme-bg)] px-4 py-3 shadow-[var(--shadow-overlay)] font-sans",
        "transition-all duration-[var(--motion-duration-base)]",
        variantClasses[variant],
        exiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0",
      )}
    >
      <Icon
        name={variantIcons[variant]}
        size={18}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--theme-text)] leading-snug">{message}</p>
        {action && (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              dismiss();
            }}
            className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--theme-secondary)] hover:text-[var(--theme-text)] transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
      <Button
        variant="ghost-subtle"
        size="icon"
        onClick={dismiss}
        aria-label="Sulje ilmoitus"
        className="shrink-0 h-6 w-6 min-w-0 -mt-0.5 -mr-1"
      >
        <Icon name="x" size={14} />
      </Button>
    </div>
  );
});

// ── Provider ──

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Screen position for the toast stack */
  position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
  /** Maximum number of toasts visible at once */
  maxVisible?: number;
}

const positionClasses: Record<NonNullable<ToastProviderProps["position"]>, string> = {
  "top-right": "top-8 right-8 items-end",
  "top-center": "top-8 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-8 right-8 items-end",
  "bottom-center": "bottom-8 left-1/2 -translate-x-1/2 items-center",
};

/**
 * Context provider for the toast notification system.
 * Wrap the app (or page root) with `ToastProvider`, then call `useToast().toast({ message, variant })`
 * from any descendant. Toasts auto-dismiss after `duration` ms (default varies by variant).
 * For persistent inline notices use `NoticePanel` instead.
 *
 * @summary transient pop-up notifications; wrap root with ToastProvider, trigger via useToast().toast()
 */
export function ToastProvider({
  children,
  position = "bottom-right",
  maxVisible = 5,
}: ToastProviderProps) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((item: Omit<ToastItem, "id">): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setItems((prev) => [...prev.slice(-(maxVisible - 1)), { ...item, id }]);
    return id;
  }, [maxVisible]);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setItems([]);
  }, []);

  const portal =
    typeof document !== "undefined"
      ? ReactDOM.createPortal(
          <div
            aria-label="Ilmoitukset"
            className={cn(
              "fixed z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none",
              positionClasses[position],
            )}
          >
            {items.map((item) => (
              <div key={item.id} className="pointer-events-auto">
                <ToastCard item={item} onDismiss={dismiss} />
              </div>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
}
