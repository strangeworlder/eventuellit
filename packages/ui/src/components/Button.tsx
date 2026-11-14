import React from "react";
import { AnchoredTooltip } from "./AnchoredTooltip";
import { Icon, type IconName } from "./Icon";
import { useObscured } from "./ObscuredWrapper";
import { cn, obscureString } from "./utils";

export type ChevronDirection = "left" | "right" | "up" | "down";

/** Re-export cn from utils for backwards compatibility */
export { cn };

// ── Obscured helpers ──

/** Recursively walk React children and obscure every text node. */
function obscureText(node: React.ReactNode): React.ReactNode {
  if (typeof node === "string") return obscureString(node);
  if (typeof node === "number") return obscureString(String(node));
  if (Array.isArray(node)) return node.map(obscureText);
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return React.cloneElement(node, undefined, obscureText(node.props.children));
  }
  return node;
}

/** Flatten React children to a plain string (for the data-attribute echo). */
function flattenToString(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenToString).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return flattenToString(node.props.children);
  }
  return "";
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "danger" | "ghost" | "ghost-subtle" | "chevron";
  size?: "default" | "sm" | "compact" | "lg" | "icon" | "nav";
  /** When true, blurs & disables the button with a glitch effect. Works with any variant. */
  obscured?: boolean;
  justify?: "center" | "start" | "end";
  /** When true, shows a spinner and disables interaction. */
  loading?: boolean;
  /** Optional loading tooltip copy shown when loading disables interaction. */
  loadingMessage?: string;
  /** Controls whether loading tooltip is rendered when loading is true. */
  showLoadingTooltip?: boolean;
  /** Shows a default semantic danger icon in danger buttons. */
  showDangerIcon?: boolean;
  /** Icon used for danger affordance when variant is danger. */
  dangerIcon?: IconName;
  /**
   * Chevron arrow direction. Only used when `variant="chevron"`.
   * The variant auto-renders the matching chevron icon — no children needed.
   */
  chevronDirection?: ChevronDirection;
  theme?:
    | "base"
    | "inverted"
    | "primary-light"
    | "primary-dark"
    | "secondary-light"
    | "secondary-dark"
    | "accent-light"
    | "accent-dark"
    | "royal"
    | "royal-dark";
}

/**
 * Primary interaction control for all player actions. Does not navigate.
 * For navigation use Link instead. Choose `variant` to express intent:
 * solid (primary), outline (secondary), danger (destructive), ghost-subtle (nav/sidebar).
 *
 * @summary for player actions; variant expresses intent (solid/outline/danger/ghost-subtle)
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      size: sizeProp = "default",
      justify = "center",
      loading = false,
      loadingMessage = "Toiminto on käynnissä",
      showLoadingTooltip = true,
      showDangerIcon = true,
      dangerIcon = "alert-triangle",
      chevronDirection = "right",
      theme,
      disabled,
      obscured: obscuredProp = false,
      children,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const isChevron = variant === "chevron";
    const size = isChevron ? ("icon" as const) : sizeProp;
    const contextObscured = useObscured();
    const isObscured = Boolean(obscuredProp || contextObscured);
    const isDisabled = disabled || loading || isObscured;
    const tooltipId = React.useId();
    const isDanger = variant === "danger";
    const shouldRenderDangerIcon = !loading && isDanger && showDangerIcon;
    const shouldRenderLoadingTooltip = loading && showLoadingTooltip;
    const obscuredLabel = isObscured ? obscureString(flattenToString(children)) : undefined;
    const glitchSeed = React.useMemo(() => (isObscured ? Math.random() * 36 : 0), [isObscured]);
    const glitchDuration = React.useMemo(
      () => (isObscured ? 25 + Math.random() * 20 : 6),
      [isObscured],
    );
    const mergedAriaDescribedBy =
      [ariaDescribedBy, shouldRenderLoadingTooltip ? tooltipId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    const buttonElement = (
      <button
        ref={ref}
        style={
          isObscured
            ? ({
                "--glitch-delay": `-${glitchSeed.toFixed(2)}s`,
                "--glitch-duration": `${glitchDuration.toFixed(2)}s`,
                ...props.style,
              } as React.CSSProperties)
            : props.style
        }
        data-theme={theme}
        data-text={obscuredLabel}
        disabled={shouldRenderLoadingTooltip ? undefined : isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        aria-describedby={mergedAriaDescribedBy}
        className={cn(
          // ── Base ──
          "font-sans inline-flex cursor-pointer items-center gap-2 rounded-md font-semibold uppercase tracking-[0.08em] transition-[transform,box-shadow,background,border-color,color] duration-150 ease-out relative overflow-hidden",
          // ── Focus-visible ── accessible ring replacing bare outline-none
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          // ── Interactive lift & press ──
          !isDisabled &&
            size !== "nav" &&
            (variant === "solid" || variant === "outline" || variant === "danger") &&
            "hover:-translate-y-px active:translate-y-0 active:scale-[0.985] active:duration-75",
          !isDisabled &&
            size !== "nav" &&
            (variant === "ghost" || variant === "ghost-subtle") &&
            "active:scale-[0.98] active:duration-75",
          // ── Disabled ── flattened, desaturated, no hover/active shift
          disabled &&
            !loading &&
            "opacity-40 grayscale-[40%] cursor-not-allowed pointer-events-none shadow-none",
          // ── Loading ── disabled interaction, preserve strong contrast
          loading && "cursor-wait opacity-100 grayscale-0",
          // ── Justify ──
          {
            "justify-center": justify === "center",
            "justify-start": justify === "start",
            "justify-end": justify === "end",
          },
          // ── Size ──
          {
            "min-h-11 h-auto px-5 py-2 text-[length:var(--font-size-sm)]": size === "default",
            "min-h-[2.125rem] h-auto px-3.5 py-1.5 text-xs tracking-[0.07em]": size === "sm",
            "min-h-[1.75rem] h-auto px-2.5 py-0.5 text-[length:var(--font-size-xs)] tracking-[0.06em]":
              size === "compact",
            "min-h-[3.25rem] h-auto px-7 py-3 text-base w-full": size === "lg",
            "h-9 w-9 min-w-[2.25rem] px-0 py-0 text-base font-bold leading-none": size === "icon",
            "w-full p-2 h-auto text-sm normal-case tracking-normal font-normal shadow-none":
              size === "nav",
          },
          // ── Variant ──
          variant === "solid" && "ds-btn-solid text-[var(--theme-accent-foreground)]",
          variant === "outline" &&
            cn(
              "ds-btn-outline text-text-muted",
              !isDisabled && "hover:text-[var(--theme-text)] active:text-[var(--theme-text)]",
            ),
          variant === "danger" && "ds-btn-danger text-[var(--theme-primary-foreground)]",
          variant === "ghost" &&
            cn(
              "border border-transparent bg-transparent text-[var(--theme-text)] shadow-none",
              !isDisabled &&
                "hover:bg-[var(--theme-surface-tint)] hover:border-[var(--theme-border-soft)]",
            ),
          variant === "ghost-subtle" &&
            cn(
              "border border-transparent bg-transparent text-text-muted shadow-none",
              !isDisabled && "hover:bg-[var(--theme-surface-tint)] hover:text-[var(--theme-text)]",
            ),
          variant === "chevron" &&
            cn(
              "rounded-full h-6 w-6 min-w-0 p-0 flex items-center justify-center ds-btn-outline text-text-muted",
              !isDisabled &&
                "hover:text-[var(--theme-text)] active:scale-[0.92] active:duration-75",
            ),
          isObscured && "select-none blur-[1.5px]",
          isObscured && "obscured-glitch",
          className,
        )}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading && (
            <Icon
              name="loader2"
              className="animate-spin shrink-0"
              size={
                size === "sm" || size === "icon" || size === "compact"
                  ? 14
                  : size === "lg"
                    ? 22
                    : 18
              }
              aria-hidden="true"
            />
          )}
          {shouldRenderDangerIcon && (
            <Icon
              name={dangerIcon}
              size={
                size === "sm" || size === "icon" || size === "compact"
                  ? 13
                  : size === "lg"
                    ? 18
                    : 15
              }
              aria-hidden="true"
            />
          )}
          {isChevron && (
            <Icon name={`chevron-${chevronDirection}` as IconName} size={12} aria-hidden="true" />
          )}
          {isObscured ? <span className="blur-[5.5px]">{obscureText(children)}</span> : children}
        </span>
      </button>
    );

    if (!shouldRenderLoadingTooltip) {
      return buttonElement;
    }

    return (
      <span data-theme={theme} className="relative inline-flex">
        {buttonElement}
        <AnchoredTooltip id={tooltipId} variant="button-loading" placement="top">
          {loadingMessage}
        </AnchoredTooltip>
      </span>
    );
  },
);
Button.displayName = "Button";
