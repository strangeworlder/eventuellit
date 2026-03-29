import * as React from "react";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

type AccordionItemContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerId: string;
  panelId: string;
  variant: "default" | "ghost";
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItem(component: string) {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(`${component} must be used within AccordionItem`);
  }
  return ctx;
}

/**
 * Optional wrapper for one or more `AccordionItem` groups. Does not manage state.
 *
 * @summary optional grouping container for accordion items
 */
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: Theme;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, theme, ...props }, ref) => (
    <div ref={ref} data-theme={theme} className={cn("font-sans", className)} {...props} />
  ),
);
Accordion.displayName = "Accordion";

/**
 * One disclosure region: pair `AccordionTrigger` + `AccordionContent`. Supports controlled and uncontrolled open state.
 *
 * @summary single expandable/collapsible disclosure unit
 */
export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "ghost";
  theme?: Theme;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    {
      className,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      variant = "default",
      theme,
      children,
      ...props
    },
    ref,
  ) => {
    const baseId = React.useId();
    const triggerId = `${baseId}-trigger`;
    const panelId = `${baseId}-panel`;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = React.useCallback(
      (value: React.SetStateAction<boolean>) => {
        const next = typeof value === "function" ? value(open) : value;
        if (!isControlled) {
          setUncontrolledOpen(next);
        }
        onOpenChange?.(next);
      },
      [isControlled, open, onOpenChange],
    );

    const contextValue = React.useMemo(
      () => ({ open, setOpen, triggerId, panelId, variant }),
      [open, setOpen, triggerId, panelId, variant],
    );

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-theme={theme}
          data-variant={variant}
          className={cn(
            "font-sans",
            variant === "default" &&
              "rounded-sm border border-[var(--theme-border-soft)] overflow-hidden",
            variant === "ghost" && "border-b border-[var(--theme-border-soft)] last:border-b-0",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

/**
 * Button that toggles the associated `AccordionContent`. Appends a chevron affordance unless `hideChevron` is set.
 *
 * @summary disclosure trigger with aria-expanded / aria-controls
 */
export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, the default trailing chevron is not rendered. */
  hideChevron?: boolean;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, disabled, hideChevron, type = "button", onClick, ...props }, ref) => {
    const { open, setOpen, triggerId, panelId, variant } = useAccordionItem("AccordionTrigger");

    return (
      <button
        ref={ref}
        id={triggerId}
        type={type}
        disabled={disabled}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented && !disabled) {
            setOpen((v) => !v);
          }
        }}
        className={cn(
          "flex w-full items-center justify-between gap-3 text-left font-sans transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-border-medium)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale-[40%]",
          variant === "default" &&
            "min-h-0 bg-[var(--theme-surface-tint)] px-4 py-3 hover:bg-[var(--theme-surface-tint)] rounded-none",
          variant === "ghost" && "min-h-0 px-0 py-2 font-normal rounded-none",
          className,
        )}
        {...props}
      >
        <div className="min-w-0 flex-1">{children}</div>
        {!hideChevron && (
          <Icon
            name="chevron-down"
            size={16}
            className={cn(
              "shrink-0 text-text-subtle transition-transform ease-[var(--motion-easing-default)] duration-[var(--motion-duration-base)]",
              open && "rotate-180",
            )}
            aria-hidden
          />
        )}
      </button>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

/**
 * Collapsible panel linked to `AccordionTrigger` via `aria-labelledby` / `aria-controls`.
 *
 * @summary animated disclosure region (grid height transition)
 */
export interface AccordionContentProps extends React.ComponentPropsWithoutRef<"section"> {}

export const AccordionContent = React.forwardRef<HTMLElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, triggerId, panelId } = useAccordionItem("AccordionContent");

    return (
      <section
        ref={ref}
        id={panelId}
        aria-labelledby={triggerId}
        aria-hidden={!open}
        data-open={open}
        className={cn(
          "grid transition-[grid-template-rows] ease-[var(--motion-easing-default)] duration-[var(--motion-duration-base)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        {...props}
      >
        <div className="min-h-0 overflow-hidden" inert={!open ? true : undefined}>
          <div className={cn(className)}>{children}</div>
        </div>
      </section>
    );
  },
);
AccordionContent.displayName = "AccordionContent";
