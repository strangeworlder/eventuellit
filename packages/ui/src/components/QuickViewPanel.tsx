import React from "react";
import ReactDOM from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Text } from "./Text";
import { cn } from "./utils";
import type { Theme } from "./Theme";
import { useFocusTrap } from "./useFocusTrap";

export interface QuickViewPanelProps {
    /** Controls whether the panel is open */
    open: boolean;
    /** Called when the panel should close (Escape, backdrop click, close button) */
    onClose: () => void;
    /** Panel header title */
    title: string;
    /** Optional subtitle shown below the title */
    subtitle?: string;
    /** Panel body content */
    children?: React.ReactNode;
    /** Footer content — typically action buttons */
    footer?: React.ReactNode;
    /** Panel width: md = 400px max, lg = 560px max */
    size?: "md" | "lg";
    /** Theme override for the panel */
    theme?: Theme;
}

const sizeClasses: Record<NonNullable<QuickViewPanelProps["size"]>, string> = {
    md: "max-w-md",
    lg: "max-w-xl",
};

/**
 * Slide-over content panel that overlays from the right edge.
 * Renders via React portal; closes on Escape, backdrop click, or close button.
 * Focus-trapped while open. Use for contextual detail previews (e.g. NPC dossiers)
 * where the user should stay on the current page.
 * For primary navigation panels use Drawer; for confirmations use Dialog.
 *
 * @summary right-edge slide-over panel; portal; focus trap; md/lg sizes; backdrop dismiss
 */
export const QuickViewPanel = React.forwardRef<HTMLDivElement, QuickViewPanelProps>(
    ({ open, onClose, title, subtitle, children, footer, size = "md", theme }, ref) => {
        const panelRef = React.useRef<HTMLDivElement>(null);
        const closeButtonRef = React.useRef<HTMLButtonElement>(null);
        const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);

        useFocusTrap(open, panelRef);

        // Focus management + body scroll lock
        React.useEffect(() => {
            if (!open) return;

            previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            requestAnimationFrame(() => {
                closeButtonRef.current?.focus();
            });

            return () => {
                document.body.style.overflow = prevOverflow;
                previouslyFocusedRef.current?.focus();
            };
        }, [open]);

        // Escape key
        React.useEffect(() => {
            if (!open) return;
            const onKey = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    e.preventDefault();
                    onClose();
                }
            };
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
        }, [open, onClose]);

        if (!open || typeof document === "undefined") return null;

        return ReactDOM.createPortal(
            <div className="fixed inset-0 z-50 flex items-stretch justify-end" aria-hidden={!open}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Panel */}
                <div
                    ref={(node) => {
                        panelRef.current = node;
                        if (typeof ref === "function") ref(node);
                        else if (ref) ref.current = node;
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                    data-theme={theme}
                    className={cn(
                        "relative z-10 flex flex-col h-full w-full font-sans",
                        "bg-[var(--theme-bg)] text-[var(--theme-text)]",
                        "border-l border-[var(--theme-secondary)]",
                        "shadow-[var(--shadow-floating)]",
                        sizeClasses[size],
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-[var(--theme-border-soft)] px-6 py-4 shrink-0">
                        <HeadingLevelProvider>
                            <div className="flex flex-col gap-0.5">
                                <Heading variant="h3">{title}</Heading>
                                {subtitle && <Text variant="muted">{subtitle}</Text>}
                            </div>
                        </HeadingLevelProvider>
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
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

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
QuickViewPanel.displayName = "QuickViewPanel";
