import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";
import { Button } from "./Button";
import { TextArea } from "./TextArea";
import { CommentEntry } from "./CommentEntry";
import { Icon } from "./Icon";
import { Switch } from "./Switch";
import { Text } from "./Text";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface CommentData {
  id: number;
  author: string;
  anonymous: boolean;
  timestamp: string | Date;
  content: string;
}

export interface CommentThreadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  comments: CommentData[];
  /** Called when a new comment is submitted. */
  onNewComment?: (content: string, anonymous: boolean) => void;
  isSubmitting?: boolean;
  /**
   * When false, the compose form is hidden (e.g., when voting is closed).
   * Defaults to true.
   */
  allowNew?: boolean;
  defaultOpen?: boolean;
  theme?: Theme;
}

/**
 * Expandable flat comment list with compose form and anonymous/named toggle.
 * Composes `CommentEntry` atoms inside an `Accordion` disclosure.
 * Used in mission option cards and session recaps.
 *
 * @summary expandable comment list with compose form; anonymous/named toggle per comment
 */
export const CommentThread = React.forwardRef<HTMLDivElement, CommentThreadProps>(
  (
    {
      className,
      comments,
      onNewComment,
      isSubmitting = false,
      allowNew = true,
      defaultOpen = false,
      theme,
      ...props
    },
    ref,
  ) => {
    const [content, setContent] = React.useState("");
    const [anonymous, setAnonymous] = React.useState(false);
    const count = comments.length;
    const label =
      count === 0
        ? "Ei kommentteja"
        : count === 1
          ? "1 kommentti"
          : `${count} kommenttia`;

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!content.trim() || !onNewComment) return;
      onNewComment(content.trim(), anonymous);
      setContent("");
    }

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn("font-sans", className)}
        {...props}
      >
        <Accordion>
          <AccordionItem defaultOpen={defaultOpen} variant="ghost">
            <AccordionTrigger className="text-xs text-[var(--theme-text-subtle)] font-black uppercase tracking-widest">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="send" size={14} aria-hidden />
                {label}
              </span>
            </AccordionTrigger>

            <AccordionContent>
              <div className="pt-1 pb-2">
                {/* Comment list */}
                {count === 0 ? (
                  <Text
                    variant="muted"
                    className="py-3 text-sm"
                  >
                    Ole ensimmäinen, joka kommentoi tätä tehtävää.
                  </Text>
                ) : (
                  <div>
                    {comments.map((comment) => (
                      <CommentEntry
                        key={comment.id}
                        author={comment.anonymous ? "Nimetön" : comment.author}
                        anonymous={comment.anonymous}
                        timestamp={comment.timestamp}
                      >
                        {comment.content}
                      </CommentEntry>
                    ))}
                  </div>
                )}

                {/* Compose form */}
                {allowNew && onNewComment && (
                  <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
                    <TextArea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Kirjoita kommentti..."
                      rows={2}
                      size="compact"
                      className="!mt-0"
                    />
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <Switch
                        label="Anonyymi"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                        className="!mt-0"
                      />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        loading={isSubmitting}
                        disabled={!content.trim()}
                      >
                        Lähetä
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
);
CommentThread.displayName = "CommentThread";
