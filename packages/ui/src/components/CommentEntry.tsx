import React from "react";
import { Text } from "./Text";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface CommentEntryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Display name of the commenter, or "Nimetön" if anonymous. */
  author: string;
  /** When true, renders the author in a muted anonymous style. */
  anonymous?: boolean;
  /** ISO timestamp string or Date for when the comment was posted. */
  timestamp: string | Date;
  theme?: Theme;
}

function formatRelativeTime(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "juuri nyt";
  if (diffMins < 60) return `${diffMins} min sitten`;
  if (diffHours < 24) return `${diffHours} t sitten`;
  if (diffDays === 1) return "eilen";
  if (diffDays < 7) return `${diffDays} pv sitten`;
  return date.toLocaleDateString("fi-FI");
}

/**
 * Single comment row with author identity, relative timestamp, and text content.
 * Supports anonymous identity display. Compose inside `CommentThread`.
 *
 * @summary comment row with author (or "Nimetön"), relative timestamp, and content
 */
export const CommentEntry = React.forwardRef<HTMLDivElement, CommentEntryProps>(
  ({ className, author, anonymous = false, timestamp, theme, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "font-sans flex flex-col gap-1 py-3 border-b border-[var(--theme-border-soft)] last:border-b-0",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Text
            variant="label"
            className={cn(
              anonymous
                ? "italic text-[var(--theme-text-subtle)]"
                : "text-[var(--theme-text-muted)]",
            )}
          >
            {author}
          </Text>
          <Text variant="timestamp">
            {formatRelativeTime(timestamp)}
          </Text>
        </div>
        <Text variant="small" className="leading-relaxed">{children}</Text>
      </div>
    );
  },
);
CommentEntry.displayName = "CommentEntry";
