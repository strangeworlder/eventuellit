import React from "react";
import { Icon } from "./Icon";
import { cn } from "./utils";

// ── Context ──

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: [],
  toggle: () => {},
});

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue>({
  value: "",
  isOpen: false,
  disabled: false,
});

// ── Accordion ──

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items open at once. Default: false */
  multiple?: boolean;
  /** Controlled open items */
  value?: string[];
  /** Uncontrolled default open items */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

/**
 * Collapsible section container. Compound component — compose with
 * AccordionItem, AccordionTrigger, and AccordionContent.
 *
 * @summary collapsible sections; multiple prop for multi-open; controlled or uncontrolled
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      multiple = false,
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState<string[]>(defaultValue);

    const isControlled = controlledValue !== undefined;
    const openItems = isControlled ? controlledValue : uncontrolledValue;

    const toggle = React.useCallback(
      (itemValue: string) => {
        const next = openItems.includes(itemValue)
          ? openItems.filter((v) => v !== itemValue)
          : multiple
            ? [...openItems, itemValue]
            : [itemValue];

        if (!isControlled) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
      },
      [openItems, multiple, isControlled, onValueChange],
    );

    const ctx = React.useMemo(
      () => ({ openItems, toggle }),
      [openItems, toggle],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div ref={ref} className={cn("divide-y divide-[var(--theme-border-soft)]", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

// ── AccordionItem ──

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique key within the Accordion */
  value: string;
  disabled?: boolean;
}

/**
 * Wrapper for a single collapsible section inside an Accordion.
 *
 * @summary single collapsible section; value prop must be unique within Accordion
 */
export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const { openItems } = React.useContext(AccordionContext);
    const isOpen = openItems.includes(value);

    const ctx = React.useMemo(
      () => ({ value, isOpen, disabled }),
      [value, isOpen, disabled],
    );

    return (
      <AccordionItemContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn(className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

// ── AccordionTrigger ──

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Clickable header that toggles its parent AccordionItem open/closed.
 * Renders a chevron indicator that rotates on open.
 *
 * @summary clickable header for AccordionItem; auto chevron indicator
 */
export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  const { toggle } = React.useContext(AccordionContext);
  const { value, isOpen, disabled } = React.useContext(AccordionItemContext);

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={isOpen}
      disabled={disabled}
      onClick={() => toggle(value)}
      className={cn(
        "flex w-full items-center justify-between gap-2 py-3 text-left text-sm font-semibold transition-colors",
        "text-[var(--theme-text)] hover:text-[var(--theme-primary)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <Icon
        name="chevron-down"
        size={16}
        className={cn(
          "shrink-0 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

// ── AccordionContent ──

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Collapsible body for an AccordionItem. Animates open/closed via CSS grid transition.
 *
 * @summary animated collapsible body; place inside AccordionItem below AccordionTrigger
 */
export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(AccordionItemContext);

  return (
    <div
      ref={ref}
      role="region"
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      {...props}
    >
      <div className={cn("overflow-hidden", className)}>
        <div className="pb-3">{children}</div>
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";
