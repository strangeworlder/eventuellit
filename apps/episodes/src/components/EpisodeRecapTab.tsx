import { useAuth } from "@repo/auth/use-auth";
import { Button } from "@repo/ui/components/Button";
import { slugifyHeadingLabel } from "@repo/ui/components/article-navigation-utils";
import { EmptyState } from "@repo/ui/components/EmptyState";
import { Stack } from "@repo/ui/components/Layout";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Text } from "@repo/ui/components/Text";
import { TextArea } from "@repo/ui/components/TextArea";
import { TextSection } from "@repo/ui/components/TextSection";
import { ToolButton } from "@repo/ui/components/ToolButton";
import { useState } from "react";
import { type Episode, useUpdateEpisode } from "../api/episodes";
import { type Session } from "../api/sessions";
import { SessionTimeline } from "./SessionTimeline";

function EpisodeSummarySection({
  episode,
}: {
  episode: Episode;
}) {
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: updateEpisode, isPending } = useUpdateEpisode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(episode.summary ?? "");

  const save = () => {
    updateEpisode(
      { id: episode.id, summary: draft },
      { onSuccess: () => setEditing(false) },
    );
  };

  if (!isGm && !episode.summary) return null;

  return (
    <TextSection
      variant="bordered"
      title="Jakson yhteenveto"
      id={slugifyHeadingLabel("Jakson yhteenveto")}
      actions={
        isGm && !editing ? (
          <ToolButton
            onClick={() => {
              setDraft(episode.summary ?? "");
              setEditing(true);
            }}
          >
            Muokkaa
          </ToolButton>
        ) : undefined
      }
    >
      {editing && isGm ? (
        <Stack gap={3}>
          <TextArea
            label="Yhteenveto (Markdown)"
            variant="monospace"
            className="h-48"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Stack direction="row" gap={3}>
            <Button onClick={save} loading={isPending} loadingMessage="Tallennetaan...">
              Tallenna
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Peruuta
            </Button>
          </Stack>
        </Stack>
      ) : episode.summary ? (
        <MarkdownRenderer>{episode.summary}</MarkdownRenderer>
      ) : isGm ? (
        <Text variant="muted">Ei yhteenvetoa vielä. Klikkaa Muokkaa lisätäksesi.</Text>
      ) : null}
    </TextSection>
  );
}

interface EpisodeRecapTabProps {
  episode: Episode;
  sessions: Session[] | undefined;
  isLoading: boolean;
}

export function EpisodeRecapTab({ episode, sessions, isLoading }: EpisodeRecapTabProps) {
  if (isLoading) return <LoadingState message="Ladataan kertauksia..." />;

  const hasSessions = (sessions?.length ?? 0) > 0;
  const hasAnyPlayedSession = sessions?.some((s) => s.status === "played") ?? false;

  return (
      <Stack gap={10}>
        <EpisodeSummarySection episode={episode} />

        <Stack gap={6}>
          {!hasSessions ? (
            <EmptyState
              title="Sessioita ei löydy"
              description="Tälle jaksolle ei ole luotu sessioita. GM voi lisätä ne Pelinjohtajan Työkaluista."
            />
          ) : !hasAnyPlayedSession ? (
            <Stack gap={4}>
              <Text variant="muted">
                Kertauksia ei ole vielä saatavilla — pelatut sessiot näkyvät täällä julkaisun jälkeen.
              </Text>
              <SessionTimeline sessions={sessions!} episodeId={episode.id} />
            </Stack>
          ) : (
            <SessionTimeline sessions={sessions!} episodeId={episode.id} />
          )}
        </Stack>
      </Stack>
  );
}
