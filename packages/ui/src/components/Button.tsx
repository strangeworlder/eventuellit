import React from "react";
import { AnchoredTooltip } from "./AnchoredTooltip";
import { Icon, type IconName } from "./Icon";
import { useObscured } from "./ObscuredWrapper";
import { cn, obscureString } from "./utils";

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
  variant?: "solid" | "outline" | "danger" | "ghost" | "ghost-subtle";
  size?: "default" | "sm" | "lg" | "icon" | "nav";
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
  theme?:
  | "base"
  | "inverted"
  | "primary-light"
  | "primary-dark"
  | "secondary-light"
  | "secondary-dark"
  | "accent-light"
  | "accent-dark";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      size = "default",
      justify = "center",
      loading = false,
      loadingMessage = "Toiminto on käynnissä",
      showLoadingTooltip = true,
      showDangerIcon = true,
      dangerIcon = "alert-triangle",
      theme,
      disabled,
      obscured: obscuredProp = false,
      children,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const isObscured = obscuredProp || useObscured();
    const isDisabled = disabled || loading || isObscured;
    const tooltipId = React.useId();
    const isDanger = variant === "danger";
    const shouldRenderDangerIcon = isDanger && showDangerIcon;
    const shouldRenderLoadingTooltip = loading && showLoadingTooltip;
    const obscuredLabel = isObscured ? obscureString(flattenToString(children)) : undefined;
    const glitchSeed = React.useMemo(() => isObscured ? Math.random() * 36 : 0, []);
    const glitchDuration = React.useMemo(() => isObscured ? 25 + Math.random() * 20 : 6, []);
    const mergedAriaDescribedBy = [ariaDescribedBy, shouldRenderLoadingTooltip ? tooltipId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

    const buttonElement = (
      <button
        ref={ref}
        style={isObscured ? { '--glitch-delay': `-${glitchSeed.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s`, ...props.style } as React.CSSProperties : props.style}
        data-theme={theme}
        data-text={obscuredLabel}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        aria-describedby={mergedAriaDescribedBy}
        className={cn(
          // ── Base ──
          "inline-flex cursor-pointer items-center gap-2 rounded-sm font-bold uppercase tracking-widest transition-all duration-350 ease-in relative overflow-hidden",
          // ── Focus-visible ── accessible ring replacing bare outline-none
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          // ── Hover ── snappy enter
          "shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:duration-200 hover:ease-out",
          // ── Active / Pressed ── tactile feedback
          "active:translate-y-0 active:shadow-sm active:scale-[0.98] active:duration-75",
          // ── Disabled ── flattened, desaturated, no hover/active shift
          disabled && !loading &&
          "opacity-40 grayscale-[40%] cursor-not-allowed pointer-events-none shadow-none translate-y-0 scale-100 hover:shadow-none hover:-translate-y-0 active:translate-y-0 active:scale-100",
          // ── Loading ── disabled interaction, but preserve strong contrast
          loading &&
          "cursor-wait opacity-100 grayscale-0 shadow-sm hover:shadow-sm hover:-translate-y-0 active:translate-y-0 active:scale-100",
          // ── Justify ──
          {
            "justify-center": justify === "center",
            "justify-start": justify === "start",
            "justify-end": justify === "end",
          },
          // ── Size ──
          {
            "min-h-[3rem] h-auto px-6 py-2": size === "default",
            "min-h-[2.25rem] h-auto px-3 py-1.5": size === "sm",
            "min-h-[3.5rem] h-auto px-8 py-4 text-xl w-full": size === "lg",
            "h-10 w-10 min-w-[2.5rem] px-0 py-0 text-xl font-black leading-none": size === "icon",
            "w-full p-2 h-auto text-sm normal-case tracking-normal font-normal shadow-none hover:shadow-none hover:-translate-y-0 active:translate-y-0 active:scale-100":
              size === "nav",
          },
          // ── Variant ──
          {
            "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] hover:bg-[var(--color-primary-600)] active:bg-[var(--theme-primary)] border-2 border-transparent":
              variant === "solid",
            "bg-transparent border-2 border-[var(--theme-secondary)] text-[var(--theme-secondary)] hover:bg-[var(--theme-surface-tint)] hover:text-[var(--theme-text)] active:bg-[var(--theme-surface-tint)] active:text-[var(--theme-text)]":
              variant === "outline",
            "bg-[var(--theme-accent)] text-[var(--theme-accent-foreground)] border-2 border-[var(--theme-accent-foreground)] rounded-md shadow-[0_0_0_1px_color-mix(in_srgb,var(--theme-accent)_40%,transparent),inset_0_-2px_0_color-mix(in_srgb,var(--theme-accent-foreground)_20%,transparent)] hover:bg-[var(--color-accent-600)] hover:border-[var(--theme-accent-foreground)] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--theme-accent)_55%,transparent),inset_0_-2px_0_color-mix(in_srgb,var(--theme-accent-foreground)_28%,transparent)] active:bg-[var(--theme-accent)] active:scale-[0.96]":
              variant === "danger",
            "hover:bg-[var(--theme-accent)] hover:text-[var(--theme-accent-foreground)] active:bg-[var(--color-accent-700)] shadow-none hover:shadow-none active:shadow-none":
              variant === "ghost",
            "bg-transparent text-text-muted hover:bg-[var(--theme-surface-tint)] hover:text-[var(--theme-text)] active:bg-[var(--theme-surface-tint)] active:text-[var(--theme-text)] border-2 border-transparent shadow-none hover:shadow-none active:shadow-none hover:-translate-y-0 active:translate-y-0":
              variant === "ghost-subtle",
          },
          isObscured && "select-none blur-[1.5px]",
          isObscured && "obscured-glitch",
          className,
        )}
        {...props}
      >
        {isDanger && (
          <Icon
            name={dangerIcon}
            size={size === "sm" || size === "icon" ? 30 : size === "lg" ? 52 : 40}
            className="absolute -right-2 -top-2 opacity-15 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading && (
            <Icon
              name="loader2"
              className="animate-spin shrink-0"
              size={size === "sm" || size === "icon" ? 14 : size === "lg" ? 22 : 18}
              aria-hidden="true"
            />
          )}
          {shouldRenderDangerIcon && (
            <Icon
              name={dangerIcon}
              size={size === "sm" || size === "icon" ? 13 : size === "lg" ? 18 : 15}
              aria-hidden="true"
            />
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
        <span
          tabIndex={0}
          className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]"
        >
          {buttonElement}
        </span>
        <AnchoredTooltip id={tooltipId} variant="button-loading" placement="top">
          {loadingMessage}
        </AnchoredTooltip>
      </span>
    );
  },
);
Button.displayName = "Button";
