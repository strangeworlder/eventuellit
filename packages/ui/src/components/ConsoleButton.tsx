import React from "react";
import { Icon, type IconName } from "./Icon";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { cn, obscureString } from "./utils";

function obscureText(node: React.ReactNode): React.ReactNode {
  if (typeof node === "string") return obscureString(node);
  if (typeof node === "number") return obscureString(String(node));
  if (Array.isArray(node)) return node.map(obscureText);
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return React.cloneElement(node, undefined, obscureText(node.props.children));
  }
  return node;
}

export interface ConsoleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Elevated console styling intent. */
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  /** Touch target sizing (`compact` is restricted to inline data row / GM tools). */
  size?: "default" | "lg" | "compact";
  /** Disables interaction and shows inline spinner. */
  loading?: boolean;
  /** Optional leading icon. */
  iconLeft?: IconName;
  /** Optional trailing icon. */
  iconRight?: IconName;
  /** Shows `alert-triangle` automatically for `danger` variant. */
  showDangerIcon?: boolean;
  /** Blurs and locks button when obscured or classified. */
  obscured?: boolean;
  /** Scoped `data-theme` override. */
  theme?: Theme;
}

/**
 * Elevated hard-edged console button with tactile shadows and top edge-lighting.
 * Player-facing calls to action use `default` or `lg` sizing (`min-h-11`+).
 *
 * @summary elevated console action button supporting 8 data-themes and ObscuredWrapper
 */
export const ConsoleButton = React.forwardRef<HTMLButtonElement, ConsoleButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      loading = false,
      iconLeft,
      iconRight,
      showDangerIcon = true,
      obscured: obscuredProp = false,
      disabled,
      theme,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const contextObscured = useObscured();
    const isObscured = Boolean(obscuredProp || contextObscured);
    const isDisabled = Boolean(disabled || loading || isObscured);
    const shouldRenderDangerIcon = !loading && !iconLeft && variant === "danger" && showDangerIcon;

    return (
      <button
        ref={ref}
        type={type}
        data-theme={theme}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={cn(
          "font-sans inline-flex items-center justify-center gap-2 rounded-[3px] font-heading font-bold uppercase tracking-[0.09em] cursor-pointer transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          !isDisabled && "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
          disabled &&
            !loading &&
            "opacity-40 grayscale-[40%] cursor-not-allowed pointer-events-none",
          loading && "cursor-wait",
          size === "default" && "min-h-11 px-4 py-2 text-xs tablet:text-sm",
          size === "lg" && "min-h-[3.25rem] w-full px-6 py-3 text-sm tablet:text-base",
          size === "compact" && "min-h-[1.85rem] px-2.5 py-1 text-xs",
          variant === "primary" && "ds-console-btn-primary",
          variant === "secondary" && "ds-console-btn-secondary",
          variant === "outline" && "ds-console-btn-outline",
          variant === "danger" && "ds-console-btn-danger",
          variant === "ghost" &&
            "border border-transparent bg-transparent text-text-muted hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface-tint)] hover:border-[var(--theme-border-soft)]",
          isObscured && "select-none blur-[1.5px] obscured-glitch",
          className,
        )}
        {...props}
      >
        {loading && (
          <Icon
            name="loader2"
            size={size === "compact" ? 13 : 16}
            className="animate-spin shrink-0"
            aria-hidden="true"
          />
        )}
        {!loading && iconLeft && (
          <Icon
            name={iconLeft}
            size={size === "compact" ? 13 : 16}
            className="shrink-0"
            aria-hidden="true"
          />
        )}
        {shouldRenderDangerIcon && (
          <Icon
            name="alert-triangle"
            size={size === "compact" ? 13 : 15}
            className="shrink-0"
            aria-hidden="true"
          />
        )}
        <span className="truncate">{isObscured ? obscureText(children) : children}</span>
        {!loading && iconRight && (
          <Icon
            name={iconRight}
            size={size === "compact" ? 13 : 16}
            className="shrink-0"
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);

ConsoleButton.displayName = "ConsoleButton";
