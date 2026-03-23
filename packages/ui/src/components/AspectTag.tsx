import React from "react";
import { cn } from "./utils";
import { Icon, type IconName } from "./Icon";

export interface AspectTagProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tag display text */
  text: string;
  /** Visual variant: harm tags vs skill tags */
  variant: "harm" | "skill";
  /** Whether this harm tag has been healed (harm variant only) */
  healed?: boolean;
  /** Whether this is a custom/player-created tag (skill variant only) */
  isCustom?: boolean;
  /** Callback to remove the tag — shows remove button when provided */
  onRemove?: () => void;
  /** Callback to toggle heal state — shows heal/activate button when provided */
  onToggleHeal?: () => void;
  /** Disable interactions */
  readOnly?: boolean;
}

export const AspectTag = React.forwardRef<HTMLDivElement, AspectTagProps>(
  (
    {
      className,
      text,
      variant,
      healed = false,
      isCustom = false,
      onRemove,
      onToggleHeal,
      readOnly = false,
      ...props
    },
    ref,
  ) => {
    const isHarm = variant === "harm";
    const isHealed = isHarm && healed;

    const icon: IconName | undefined = isHarm
      ? isHealed
        ? "heart-pulse"
        : "alert-triangle"
      : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          // ── Base ──
          "group inline-flex items-center gap-2 rounded-md px-3 py-1.5",
          "font-heading text-xs font-bold uppercase tracking-wider",
          "transition-all duration-200 select-none",
          "hover:scale-[1.03] hover:-translate-y-px",

          // ── Harm: active ──
          isHarm && !isHealed && [
            "border border-[color-mix(in_srgb,var(--theme-primary)_50%,red)]",
            "bg-[color-mix(in_srgb,var(--theme-primary)_12%,transparent)]",
            "text-[color-mix(in_srgb,var(--theme-text)_75%,red)]",
            // embossed inset + glow
            "shadow-[0_0_8px_color-mix(in_srgb,var(--theme-primary)_20%,transparent),inset_0_-1px_0_color-mix(in_srgb,var(--theme-primary)_15%,transparent)]",
            // pulse animation
            "animate-[aspect-pulse_3s_ease-in-out_infinite] transition-all duration-200",
            // hover lift
            "hover:shadow-[0_0_16px_color-mix(in_srgb,var(--theme-primary)_35%,transparent),inset_0_-1px_0_color-mix(in_srgb,var(--theme-primary)_25%,transparent)]",
          ],

          // ── Harm: healed ──
          isHealed && [
            "border border-dashed border-[var(--theme-secondary)]/25",
            "bg-[var(--theme-secondary)]/5",
            "text-[var(--theme-secondary)]",
            "opacity-80",
            "hover:opacity-100",
          ],

          // ── Skill ──
          !isHarm && [
            "border border-[var(--theme-accent)]/30",
            "border-l-[3px] border-l-[var(--theme-accent)]",
            "bg-[var(--theme-accent)]/8",
            "text-[var(--theme-accent)]",
            "shadow-sm",
            "hover:shadow-[0_0_12px_color-mix(in_srgb,var(--theme-accent)_20%,transparent)]",
            "hover:border-[var(--theme-accent)]/50",
          ],

          className,
        )}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <Icon
            name={icon}
            size={14}
            className={cn(
              "shrink-0 transition-transform duration-200",
              isHealed
                ? "opacity-50"
                : "opacity-70 drop-shadow-[0_0_3px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)]",
            )}
          />
        )}

        {/* Text */}
        <span
          className="leading-tight"
        >
          {text}
        </span>

        {/* Custom skill indicator — mini pill */}
        {!isHarm && isCustom && (
          <span className="inline-flex items-center rounded-full bg-[var(--theme-accent)]/15 px-1.5 py-px text-[9px] font-black tracking-widest text-[var(--theme-accent)]/60">
            oma
          </span>
        )}

        {/* Action buttons — slide-in from right */}
        {!readOnly && (onToggleHeal || onRemove) && (
          <span className="inline-flex items-center gap-0.5 ml-1 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 transition-all duration-200">
            {/* Heal/activate toggle */}
            {isHarm && onToggleHeal && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHeal();
                }}
                className={cn(
                  "rounded p-0.5 transition-all duration-150",
                  "hover:bg-[var(--theme-secondary)]/20 hover:scale-110",
                  "focus-visible:ring-1 focus-visible:ring-[var(--theme-accent)] outline-none",
                )}
                aria-label={healed ? `Aktivoi harmi: ${text}` : `Paranna harmi: ${text}`}
              >
                <Icon
                  name={healed ? "shield-alert" : "heart-pulse"}
                  size={14}
                />
              </button>
            )}

            {/* Remove button */}
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className={cn(
                  "rounded p-0.5 transition-all duration-150",
                  "hover:bg-[color-mix(in_srgb,red_20%,transparent)] hover:scale-110",
                  "focus-visible:ring-1 focus-visible:ring-[var(--theme-accent)] outline-none",
                  "text-[var(--theme-secondary)]/60 hover:text-[color-mix(in_srgb,var(--theme-text)_70%,red)]",
                )}
                aria-label={`Poista: ${text}`}
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </span>
        )}
      </div>
    );
  },
);
AspectTag.displayName = "AspectTag";
