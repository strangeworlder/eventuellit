import { useAuth } from "@repo/auth/use-auth";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Stack } from "@repo/ui/components/Layout";
import { Text } from "@repo/ui/components/Text";
import { TextArea } from "@repo/ui/components/TextArea";
import { useState } from "react";
import {
  type SessionPlayerRecap,
  useDeleteSessionRecap,
  useSessionRecaps,
  useUpsertSessionRecap,
} from "../api/session-recaps";

function RecapField({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <Stack gap={1}>
      <Text variant="label">{label}</Text>
      <Text variant="body-relaxed">{value}</Text>
    </Stack>
  );
}

function PlayerRecapCard({ recap, isOwn }: { recap: SessionPlayerRecap; isOwn: boolean }) {
  return (
    <Card variant="outline">
      <CardHeader>
        <Stack direction="row" align="center" justify="between" gap={2}>
          <CardTitle>{recap.username ?? "—"}</CardTitle>
          {isOwn && <Text variant="caption">Oma kertaus</Text>}
        </Stack>
      </CardHeader>
      <CardContent>
        <HeadingLevelProvider>
          <Stack gap={4}>
            {recap.journal && (
              <Stack gap={1}>
                <Heading>Päiväkirja</Heading>
                <Text variant="body-relaxed">{recap.journal}</Text>
              </Stack>
            )}
            <RecapField label="Kohokohta" value={recap.highlight} />
            <RecapField label="Yllätys" value={recap.surprise} />
            <RecapField label="MVP" value={recap.mvp} />
            {!recap.journal && !recap.highlight && !recap.surprise && !recap.mvp && (
              <Text variant="muted">Tyhjä kertaus.</Text>
            )}
          </Stack>
        </HeadingLevelProvider>
      </CardContent>
    </Card>
  );
}

function OwnRecapEditor({
  sessionId,
  existing,
}: {
  sessionId: number;
  existing: SessionPlayerRecap | undefined;
}) {
  const [editing, setEditing] = useState(!existing);
  const { mutate: upsert, isPending: isUpserting } = useUpsertSessionRecap();
  const { mutate: deleteRecap, isPending: isDeleting } = useDeleteSessionRecap();

  const [journal, setJournal] = useState(existing?.journal ?? "");
  const [highlight, setHighlight] = useState(existing?.highlight ?? "");
  const [surprise, setSurprise] = useState(existing?.surprise ?? "");
  const [mvp, setMvp] = useState(existing?.mvp ?? "");

  const isPending = isUpserting || isDeleting;

  const save = () => {
    upsert(
      { sessionId, journal, highlight, surprise, mvp },
      {
        onSuccess: () => setEditing(false),
      },
    );
  };

  if (!editing && existing) {
    return (
      <Stack gap={3}>
        <PlayerRecapCard recap={existing} isOwn />
        <Button variant="outline" onClick={() => setEditing(true)}>
          Muokkaa omaa kertausta
        </Button>
      </Stack>
    );
  }

  return (
    <Card variant="highlight">
      <CardHeader>
        <CardTitle>Oma kertaus</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={4}>
          <TextArea
            label="Päiväkirja (hahmon näkökulmasta)"
            className="h-32"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
          />
          <TextArea
            label="Kohokohta"
            className="h-20"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
          />
          <TextArea
            label="Yllätys"
            className="h-20"
            value={surprise}
            onChange={(e) => setSurprise(e.target.value)}
          />
          <TextArea
            label="MVP"
            className="h-20"
            value={mvp}
            onChange={(e) => setMvp(e.target.value)}
          />
          <Stack direction="row" gap={3} wrap>
            <Button onClick={save} loading={isPending} loadingMessage="Tallennetaan...">
              Tallenna
            </Button>
            {existing && (
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={isPending}
              >
                Peruuta
              </Button>
            )}
            {existing && (
              <Button
                variant="danger"
                onClick={() => deleteRecap({ id: existing.id, sessionId })}
                loading={isDeleting}
                loadingMessage="Poistetaan..."
              >
                Poista oma kertaus
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface PlayerRecapSectionProps {
  sessionId: number;
  sessionStatus: "planned" | "next" | "played";
  recapPublished: boolean;
}

export function PlayerRecapSection({
  sessionId,
  sessionStatus,
  recapPublished,
}: PlayerRecapSectionProps) {
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const isPlayed = sessionStatus === "played";

  const { data: recaps, isLoading } = useSessionRecaps(sessionId, isPlayed && recapPublished);

  if (!isPlayed) return null;
  if (!recapPublished && !isGm) return null;

  const currentUserRecap = recaps?.find((r) => r.userId === user?.id);
  const otherRecaps = recaps?.filter((r) => r.userId !== user?.id) ?? [];

  return (
    <HeadingLevelProvider>
      <Stack gap={4}>
        <Heading>Pelaajien kertaukset</Heading>

        {isLoading && <Text variant="muted">Ladataan kertauksia...</Text>}

        {!isLoading && !isGm && user && (
          <OwnRecapEditor sessionId={sessionId} existing={currentUserRecap} />
        )}

        {otherRecaps.map((recap) => (
          <PlayerRecapCard key={recap.id} recap={recap} isOwn={false} />
        ))}

        {!isLoading && isGm && recaps?.length === 0 && (
          <Text variant="muted">Pelaajat eivät ole vielä kirjoittaneet kertauksia.</Text>
        )}
      </Stack>
    </HeadingLevelProvider>
  );
}
