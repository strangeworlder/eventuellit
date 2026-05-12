import { CommentThread } from "@repo/ui/components/CommentThread";
import { ImageElement } from "@repo/ui/components/ImageElement";
import { SelectionCard, SelectionCardBody, SelectionCardMeta } from "@repo/ui/components/SelectionCard";
import { Text } from "@repo/ui/components/Text";
import { UrgencyIndicator } from "@repo/ui/components/UrgencyIndicator";
import type { SelectionState } from "@repo/ui/components/SelectionCard";
import { useToast } from "@repo/ui/components/Toast";
import { useAddComment, useMissionComments, type MissionOption } from "../api/mission-votes";

interface MissionOptionCardProps {
  roundId: number;
  option: MissionOption;
  selectionState: SelectionState;
  votingClosed?: boolean;
}

export function MissionOptionCard({
  roundId,
  option,
  selectionState,
  votingClosed = false,
}: MissionOptionCardProps) {
  const { data: comments = [] } = useMissionComments(roundId, option.id);
  const addComment = useAddComment();
  const { toast } = useToast();

  return (
    <SelectionCard
      cardId={String(option.id)}
      selectionState={selectionState}
      locked={votingClosed}
    >
      {/* Hero image: spans outside the named grid rows, placed before meta */}
      {option.image && (
        <div className="relative h-36 overflow-hidden rounded-t-[calc(theme(borderRadius.md)-2px)] col-span-full row-start-1 row-end-1 [grid-area:auto]">
          <ImageElement
            src={option.image}
            alt={option.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] to-transparent" />
        </div>
      )}

      {/* Meta row: UrgencyIndicator (start) + selection badge (end), subgrid-aligned */}
      <SelectionCardMeta selectionState={selectionState}>
        <UrgencyIndicator urgency={option.urgency} size="compact" />
      </SelectionCardMeta>

      {/* Body: title, description, vote hint, and comments */}
      <SelectionCardBody>
        <p className="text-sm font-bold leading-snug text-[var(--theme-text)]">{option.title}</p>

        {option.description && (
          <Text className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
            {option.description}
          </Text>
        )}

        {/* Vote indicator label */}
        {!votingClosed && (
          <p className="text-xs text-[var(--theme-text-subtle)] font-heading uppercase tracking-widest">
            {selectionState === "primary"
              ? "✓ Ensisijainen valintasi"
              : selectionState === "secondary"
                ? "✓ Toissijainen valintasi"
                : "Napauta valitaksesi"}
          </p>
        )}

        {/* Comment thread — stop click propagation so it doesn't trigger card selection */}
        <div
          className="mt-1"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <CommentThread
            comments={comments.map((c) => ({
              id: c.id,
              author: c.author ?? "Nimetön",
              anonymous: c.anonymous,
              timestamp: c.createdAt,
              content: c.content,
            }))}
            onNewComment={(content, anonymous) => {
              addComment.mutate(
                { roundId, optionId: option.id, content, anonymous },
                {
                  onSuccess: () => toast({ message: "Kommenttisi on lähetetty.", variant: "success" }),
                  onError: () => toast({ message: "Kommentin lähettäminen epäonnistui.", variant: "error" }),
                },
              );
            }}
            isSubmitting={addComment.isPending}
            allowNew={!votingClosed}
          />
        </div>
      </SelectionCardBody>
    </SelectionCard>
  );
}
