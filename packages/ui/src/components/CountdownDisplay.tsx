import React from "react";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface CountdownDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The target deadline as a Date or ISO string. */
  deadline: Date | string;
  /** Label shown when the deadline has passed. Defaults to "Päättynyt". */
  expiredLabel?: string;
  /** Hours threshold below which styling escalates to urgent. Defaults to 24. */
  urgentThresholdHours?: number;
  size?: "default" | "compact";
  theme?: Theme;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function getTimeLeft(deadline: Date | string): TimeLeft {
  const target = typeof deadline === "string" ? new Date(deadline) : deadline;
  const diffMs = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs: diffMs,
  };
}

/**
 * Live-updating countdown timer showing time remaining until a deadline.
 * Escalates to urgent styling when below `urgentThresholdHours`.
 *
 * @summary live countdown to deadline; escalates to primary color when urgent
 */
export const CountdownDisplay = React.forwardRef<HTMLDivElement, CountdownDisplayProps>(
  (
    {
      className,
      deadline,
      expiredLabel = "Päättynyt",
      urgentThresholdHours = 24,
      size = "default",
      theme,
      ...props
    },
    ref,
  ) => {
    const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(() => getTimeLeft(deadline));

    React.useEffect(() => {
      // Refresh immediately when deadline prop changes
      setTimeLeft(getTimeLeft(deadline));

      const interval = setInterval(() => {
        setTimeLeft(getTimeLeft(deadline));
      }, 1000);

      return () => clearInterval(interval);
    }, [deadline]);

    const isExpired = timeLeft.totalMs === 0;
    const isUrgent =
      !isExpired && timeLeft.totalMs < urgentThresholdHours * 3_600_000;

    if (isExpired) {
      return (
        <div
          ref={ref}
          data-theme={theme}
          className={cn(
            "font-sans inline-flex items-center gap-1.5 text-[var(--theme-text-subtle)]",
            size === "compact" ? "text-xs" : "text-sm",
            className,
          )}
          {...props}
        >
          <Icon name="clock" size={size === "compact" ? 16 : 22} aria-hidden />
          <span className="font-heading font-bold uppercase tracking-widest">{expiredLabel}</span>
        </div>
      );
    }

    const segments: Array<{ value: number; label: string }> = [];
    if (timeLeft.days > 0) segments.push({ value: timeLeft.days, label: "pv" });
    segments.push({ value: timeLeft.hours, label: "t" });
    segments.push({ value: timeLeft.minutes, label: "min" });
    if (timeLeft.days === 0) segments.push({ value: timeLeft.seconds, label: "s" });

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "font-sans inline-flex items-center gap-2",
          isUrgent
            ? "text-[var(--theme-primary)] animate-[aspect-pulse_3s_ease-in-out_infinite]"
            : "text-[var(--theme-secondary)]",
          className,
        )}
        {...props}
      >
        <Icon
          name="clock"
          size={size === "compact" ? 16 : 22}
          className="shrink-0"
          aria-hidden
        />
        <span className="inline-flex items-baseline gap-1">
          {segments.map(({ value, label }) => (
            <span key={label} className="inline-flex items-baseline gap-0.5">
              <span
                className={cn(
                  "font-heading font-black tabular-nums",
                  size === "compact" ? "text-sm" : "text-base",
                )}
              >
                {String(value).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "font-heading uppercase tracking-widest opacity-70",
                  size === "compact" ? "text-[0.6rem]" : "text-xs",
                )}
              >
                {label}
              </span>
            </span>
          ))}
        </span>
      </div>
    );
  },
);
CountdownDisplay.displayName = "CountdownDisplay";
