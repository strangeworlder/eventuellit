import React from "react";
import { Heading, HeadingLevelProvider } from "./Heading";
import { cn } from "./utils";

export interface NoticePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "info" | "error";
  title?: string;
  actions?: React.ReactNode;
}

/**
 * Persistent inline callout panel for success, info, and error notices.
 * Use when the message must stay visible on screen. For transient pop-ups use ToastProvider/useToast.
 *
 * @summary persistent inline callout (success/info/error); for transient pop-ups use useToast
 */
export const NoticePanel = React.forwardRef<HTMLDivElement, NoticePanelProps>(
  ({ className, variant = "info", title, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-sm p-6 text-[var(--theme-text)]",
        {
          "border-2 border-[var(--theme-border-medium)] bg-[var(--theme-secondary)]/5 shadow-[0_0_15px_color-mix(in_srgb,var(--theme-secondary)_20%,transparent)]":
            variant === "success",
          "border-l-4 border-[var(--theme-accent)] bg-[var(--theme-accent)]/10": variant === "info",
          "border-2 border-[var(--theme-accent)] bg-[var(--theme-accent)]/10": variant === "error",
        },
        className,
      )}
      {...props}
    >
      <HeadingLevelProvider>
        {title ? <Heading className="mb-3">{title}</Heading> : null}
        <div className="text-[var(--theme-text)]">{children}</div>
      </HeadingLevelProvider>
      {actions ? <div className="mt-6 flex gap-4">{actions}</div> : null}
    </div>
  ),
);

NoticePanel.displayName = "NoticePanel";
