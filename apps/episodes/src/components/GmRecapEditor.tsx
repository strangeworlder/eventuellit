import { useAuth } from "@repo/auth/use-auth";
import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Stack } from "@repo/ui/components/Layout";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Text } from "@repo/ui/components/Text";
import { TextArea } from "@repo/ui/components/TextArea";
import { useState } from "react";
import { useUpdateSession } from "../api/sessions";

interface GmRecapEditorProps {
  sessionId: number;
  episodeId: number;
  gmRecap: string | null;
  recapPublished: boolean;
  sessionStatus: "planned" | "next" | "played";
}

export function GmRecapEditor({
  sessionId,
  episodeId,
  gmRecap,
  recapPublished,
  sessionStatus,
}: GmRecapEditorProps) {
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: updateSession, isPending } = useUpdateSession();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(gmRecap ?? "");

  const save = () => {
    updateSession(
      { id: sessionId, episodeId, gmRecap: draft },
      { onSuccess: () => setEditing(false) },
    );
  };

  const togglePublish = () => {
    updateSession({ id: sessionId, episodeId, recapPublished: !recapPublished });
  };

  if (!isGm && !recapPublished) return null;
  if (!isGm && !gmRecap) return null;

  return (
    <Card variant="outline">
      <CardHeader>
        <Stack direction="row" align="center" justify="between" gap={3} wrap>
          <CardTitle>Pelinjohtajan kertaus</CardTitle>
          {isGm && (
            <Stack direction="row" align="center" gap={2} wrap>
              {!recapPublished && <Badge variant="ghost">Luonnos</Badge>}
              <Button
                variant="outline"
                onClick={togglePublish}
                loading={isPending}
                loadingMessage="Tallennetaan..."
              >
                {recapPublished ? "Piilota" : "Julkaise"}
              </Button>
              {!editing && sessionStatus === "played" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setDraft(gmRecap ?? "");
                    setEditing(true);
                  }}
                >
                  Muokkaa
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </CardHeader>

      <CardContent>
        {editing && isGm ? (
          <Stack gap={3}>
            <TextArea
              label="Kertaus (Markdown)"
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
        ) : gmRecap ? (
          <MarkdownRenderer>{gmRecap}</MarkdownRenderer>
        ) : isGm ? (
          <Text variant="muted">Ei kertausta vielä. Klikkaa Muokkaa lisätäksesi.</Text>
        ) : null}
      </CardContent>
    </Card>
  );
}
