import React, { createContext, useContext, useRef, useState, useCallback } from "react";
import { cn } from "./Button";

type TabsContextValue = {
    value?: string;
    onValueChange?: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("Tabs components must be used within a Tabs provider");
    }
    return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The controlled value of the tab to activate. Should be used in conjunction with `onValueChange`. */
    value?: string;
    /** The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs. */
    defaultValue?: string;
    /** Event handler called when the value changes. */
    onValueChange?: (value: string) => void;
}

/**
 * A set of layered sections of content—known as tab panels—that display one panel of content at a time.
 * Designed with a physical binder aesthetic and full keyboard accessibility.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ value: controlledValue, defaultValue, onValueChange, className, ...props }, ref) => {
        const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
        const isControlled = controlledValue !== undefined;
        const value = isControlled ? controlledValue : uncontrolledValue;

        const handleValueChange = useCallback(
            (newValue: string) => {
                if (!isControlled) {
                    setUncontrolledValue(newValue);
                }
                onValueChange?.(newValue);
            },
            [isControlled, onValueChange]
        );

        return (
            <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
                <div ref={ref} className={cn("flex flex-col", className)} {...props} />
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> { }

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, onKeyDown, ...props }, ref) => {
        const listRef = useRef<HTMLDivElement>(null);

        // Merge refs logic to ensure we have a local ref for querying DOM while forwarding to parent
        const setRefs = useCallback(
            (node: HTMLDivElement) => {
                listRef.current = node;
                if (typeof ref === "function") {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            },
            [ref]
        );

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!listRef.current) return;

            // Only handle events originating within the tablist itself (not inside tab panels if nested, though theoretically tabpanels are siblings, it's a good safety check)
            const targetRole = (e.target as HTMLElement).getAttribute?.("role");
            if (targetRole !== "tab") return;

            const tabs = Array.from(listRef.current.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
            if (!tabs.length) return;

            const currentFocusedIndex = tabs.findIndex((tab) => tab === document.activeElement);

            let nextIndex = currentFocusedIndex;
            let handled = false;

            switch (e.key) {
                case "ArrowRight":
                    nextIndex = (currentFocusedIndex + 1) % tabs.length;
                    handled = true;
                    break;
                case "ArrowLeft":
                    nextIndex = (currentFocusedIndex - 1 + tabs.length) % tabs.length;
                    handled = true;
                    break;
                case "Home":
                    nextIndex = 0;
                    handled = true;
                    break;
                case "End":
                    nextIndex = tabs.length - 1;
                    handled = true;
                    break;
                default:
                    break;
            }

            if (handled) {
                e.preventDefault();
                tabs[nextIndex]?.focus();
            }

            onKeyDown?.(e);
        };

        return (
            <div
                ref={setRefs}
                role="tablist"
                aria-orientation="horizontal"
                className={cn(
                    "flex flex-wrap items-end border-b-2 border-[var(--theme-primary)] gap-1 px-4 sm:px-0",
                    className
                )}
                onKeyDown={handleKeyDown}
                {...props}
            />
        );
    }
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    theme?: "base" | "inverted" | "primary-light" | "primary-dark" | "secondary-light" | "secondary-dark" | "accent-light" | "accent-dark";
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, theme, onClick, ...props }, ref) => {
        const context = useTabs();
        const isSelected = context.value === value;

        return (
            <button
                ref={ref}
                role="tab"
                type="button"
                aria-selected={isSelected}
                aria-controls={`tabpanel-${value}`}
                id={`tab-${value}`}
                tabIndex={isSelected ? 0 : -1}
                data-theme={theme}
                onClick={(e) => {
                    context.onValueChange?.(value);
                    onClick?.(e);
                }}
                className={cn(
                    "relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm sm:text-base font-bold uppercase tracking-widest transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "rounded-t-md",
                    "mb-[-2px]", // Overlap the bottom border of the list
                    isSelected
                        ? "bg-[var(--theme-bg)] text-[var(--theme-primary)] z-10 border-2 border-b-[var(--theme-text)] font-bold"
                        : "border-2 border-transparent bg-transparent text-[var(--theme-text)] hover:bg-[var(--theme-primary)]/15 hover:text-[var(--theme-text)] font-semibold",
                    className
                )}
                {...props}
            />
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const context = useTabs();
        const isSelected = context.value === value;

        // Only render the component to the DOM if it's selected. 
        // This is a common pattern for Tabs to prevent mounting off-screen content.
        if (!isSelected) {
            return null;
        }

        return (
            <div
                ref={ref}
                role="tabpanel"
                id={`tabpanel-${value}`}
                aria-labelledby={`tab-${value}`}
                tabIndex={0}
                className={cn(
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] animate-in fade-in duration-300",
                    className
                )}
                {...props}
            />
        );
    }
);
TabsContent.displayName = "TabsContent";
