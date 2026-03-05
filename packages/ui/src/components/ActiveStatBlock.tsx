import React from "react";
import { Button, cn } from "./Button";
import { Icon } from "./Icon";
import { type Theme } from "./Theme";
import { Heading, HeadingLevelProvider } from "./Heading";
export interface ActiveStatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
  onIncrement?: () => void;
  onDecrement?: () => void;
  minAllowed?: number;
  maxAllowed?: number;
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
      theme,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "flex flex-col p-6 rounded-xl border shadow-sm gap-3",
          className,
        )}
        style={{
          borderColor: "var(--theme-secondary)",
          color: "var(--theme-secondary)",
          backgroundColor: "transparent",
        }}
        {...props}
      >
        <HeadingLevelProvider>
          <div
            className="flex items-center gap-3 pb-3"
            style={{ borderBottom: "1px solid var(--theme-secondary)" }}
          >
            {icon && <div>{icon}</div>}
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
                <span className="text-lg font-bold eading-none">
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
      </div>
    );
  },
);
ActiveStatBlock.displayName = "ActiveStatBlock";
