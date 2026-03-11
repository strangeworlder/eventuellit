import React from "react";
import { cn } from "./Button";
import { Heading, HeadingLevelProvider } from "./Heading";

export interface NoticePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "info" | "error";
  title?: string;
  actions?: React.ReactNode;
}

/**
 * Semantic callout panel for success and informational notices.
 */
export const NoticePanel = React.forwardRef<HTMLDivElement, NoticePanelProps>(
  ({ className, variant = "info", title, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-sm p-6 text-[var(--theme-text)]",
        {
          "border-2 border-[var(--theme-secondary)]/50 bg-[var(--theme-secondary)]/5 shadow-[0_0_15px_color-mix(in_srgb,var(--theme-secondary)_20%,transparent)]":
            variant === "success",
          "border-l-4 border-[var(--theme-accent)] bg-[var(--theme-accent)]/10":
            variant === "info",
          "border-l-4 border-red-500/80 bg-red-500/10":
            variant === "error",
        },
        className,
      )}
      {...props}
    >
      <HeadingLevelProvider>
        {title ? <Heading className="mb-3">{title}</Heading> : null}
        <div className="text-[var(--theme-text)]/85">{children}</div>
      </HeadingLevelProvider>
      {actions ? <div className="mt-6 flex gap-4">{actions}</div> : null}
    </div>
  ),
);

NoticePanel.displayName = "NoticePanel";
