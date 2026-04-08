import { useAuth } from "@repo/auth/use-auth";
import { slugifyHeadingLabel } from "@repo/ui/components/article-navigation-utils";
import { Badge } from "@repo/ui/components/Badge";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Stack } from "@repo/ui/components/Layout";
import { Text } from "@repo/ui/components/Text";
import type { Session } from "../api/sessions";
import { GmRecapEditor } from "./GmRecapEditor";
import { PlayerRecapSection } from "./PlayerRecapSection";

function statusLabel(status: Session["status"]) {
  switch (status) {
    case "played":
      return "Pelattu";
    case "next":
      return "Seuraava";
    case "planned":
      return "Tulossa";
  }
}

function statusBadgeVariant(status: Session["status"]): "solid" | "highlight" | "ghost" {
  switch (status) {
    case "played":
      return "solid";
    case "next":
      return "highlight";
    case "planned":
      return "ghost";
  }
}

function SessionBlock({ session, episodeId }: { session: Session; episodeId: number }) {
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const isPlayed = session.status === "played";
  const hasRecapContent = isPlayed && (session.recapPublished || isGm);
  const sessionLabel = `Sessio #${String(session.sessionNumber).padStart(2, "0")}${session.label ? ` — ${session.label}` : ""}`;

  return (
    <HeadingLevelProvider>
      <Stack gap={4} className={!isPlayed ? "opacity-50" : undefined}>
        <Stack direction="row" align="center" gap={3} wrap>
          <Heading id={slugifyHeadingLabel(sessionLabel)}>{sessionLabel}</Heading>
          <Badge variant={statusBadgeVariant(session.status)}>{statusLabel(session.status)}</Badge>
          {isGm && isPlayed && !session.recapPublished && (
            <Badge variant="ghost">Kertaus julkaisematta</Badge>
          )}
        </Stack>

        {session.date && (
          <Text variant="caption">
            {new Date(session.date).toLocaleDateString("fi-FI", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        )}

        {hasRecapContent && (
          <Stack gap={6}>
            <GmRecapEditor
              sessionId={session.id}
              episodeId={episodeId}
              gmRecap={session.gmRecap}
              recapPublished={session.recapPublished}
              sessionStatus={session.status}
            />
            <PlayerRecapSection
              sessionId={session.id}
              sessionStatus={session.status}
              recapPublished={session.recapPublished}
            />
          </Stack>
        )}

        {!isPlayed && (
          <Text variant="caption">
            {session.status === "next"
              ? "Seuraava sessio — kertaukset avautuvat pelaamisen jälkeen."
              : "Suunniteltu sessio — kertaukset avautuvat pelaamisen jälkeen."}
          </Text>
        )}
      </Stack>
    </HeadingLevelProvider>
  );
}

interface SessionTimelineProps {
  sessions: Session[];
  episodeId: number;
}

export function SessionTimeline({ sessions, episodeId }: SessionTimelineProps) {
  const sorted = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);

  if (sorted.length === 0) {
    return <Text variant="muted">Tälle jaksolle ei ole luotu sessioita.</Text>;
  }

  return (
    <Stack gap={10}>
      {sorted.map((session) => (
        <SessionBlock key={session.id} session={session} episodeId={episodeId} />
      ))}
    </Stack>
  );
}
