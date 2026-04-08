import React from "react";
import { Stack } from "./Layout";
import { Text } from "./Text";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface EmptyStateProps {
  /** Short heading */
  title: string;
  /** Supporting text or custom node */
  description?: React.ReactNode;
  /** Primary action (e.g. Button) */
  action?: React.ReactNode;
  className?: string;
  theme?: Theme;
}

/**
 * Centered empty / zero-results pattern with consistent spacing and typography.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, action, className, theme }, ref) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "flex flex-col items-center justify-center text-center py-12 px-4 font-sans text-[var(--theme-text)]",
          className,
        )}
      >
        <Stack gap={3} align="center" className="max-w-md">
          <Text variant="bold" theme={theme} className="text-center">
            {title}
          </Text>
          {description != null && description !== "" && (
            <Text variant="muted" theme={theme} className="text-center">
              {description}
            </Text>
          )}
          {action ? <div className="pt-2">{action}</div> : null}
        </Stack>
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";
