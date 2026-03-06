import React from "react";
import { Button, cn } from "./Button";
import { Icon, type IconName } from "./Icon";
import { type Theme } from "./Theme";
import { Heading, HeadingLevelProvider } from "./Heading";

export interface ActiveStatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  maxValue?: number;
  icon?: IconName;
  onIncrement?: () => void;
  onDecrement?: () => void;
  minAllowed?: number;
  maxAllowed?: number;
  variant?: "secondary" | "accent";
  theme?: Theme;
}

export const ActiveStatBlock = React.forwardRef<HTMLDivElement, ActiveStatBlockProps>(
  (
    {
      className,
      label,
      value,
      maxValue,
      icon,
      onIncrement,
      onDecrement,
      minAllowed = 0,
      maxAllowed = Infinity,
      variant = "secondary",
      theme,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        data-variant={variant}
        className={cn(
          "flex flex-col p-6 rounded-xl shadow-sm gap-3 transition-all duration-200 relative overflow-hidden",
          {
            "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":
              variant === "secondary",
            "bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":
              variant === "accent",
          },
          className,
        )}
        {...props}
      >
        <HeadingLevelProvider>
          <div
            className={cn(
              "flex items-center gap-3 pb-3 border-b border-current/20",
              {
                "border-b-[var(--theme-secondary)]": variant === "secondary",
                "border-b-[var(--theme-accent)]": variant === "accent",
              }
            )}
          >
            {icon && <Icon name={icon} size={24} className="shrink-0" />}
            <Heading>
              {label}
            </Heading>
          </div>

          <div className="flex items-center justify-between mt-1">
            <Button
              variant="secondary"
              size="icon"
              onClick={onDecrement}
              disabled={value <= minAllowed}
              aria-label={`Decrease ${label}`}
            >
              <Icon name="minus" size={16} />
            </Button>

            <div className="flex items-baseline gap-1 mx-4">
              <span className="text-4xl text-[var(--theme-text)] font-heading font-black leading-none">
                {value}
              </span>
              {maxValue !== undefined && (
                <span className="text-lg font-bold leading-none">
                  / {maxValue}
                </span>
              )}
            </div>

            <Button
              variant="secondary"
              size="icon"
              onClick={onIncrement}
              disabled={value >= (maxValue ?? maxAllowed)}
              aria-label={`Increase ${label}`}
            >
              <Icon name="plus" size={16} />
            </Button>
          </div>
        </HeadingLevelProvider>
        {icon && <Icon name={icon} size={128} className="-top-6 -left-6 absolute opacity-5" />}
      </div>
    );
  },
);
ActiveStatBlock.displayName = "ActiveStatBlock";
