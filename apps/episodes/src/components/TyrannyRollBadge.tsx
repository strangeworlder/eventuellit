import { useAuth } from "@repo/auth/use-auth";
import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { DiceIcon } from "@repo/ui/components/DiceIcon";
import { Input } from "@repo/ui/components/Input";
import { Stack } from "@repo/ui/components/Layout";
import { useState } from "react";
import { useUpdateEpisode } from "../api/episodes";
import type { Session } from "../api/sessions";

/** Scoped theme override: maps --theme-primary to royal purple design tokens */
const royalPurpleScope = {
  "--theme-primary": "var(--color-royal-purple-500)",
  "--theme-primary-foreground": "var(--color-royal-purple-foreground)",
  "--theme-secondary": "var(--color-royal-purple-400)",
  "--theme-secondary-foreground": "var(--color-royal-purple-foreground)",
} as React.CSSProperties;

export function TyrannyRollBadge({
  episodeId,
  tyrannyRoll,
  sessions,
}: {
  episodeId: number;
  tyrannyRoll: number | null | undefined;
  sessions: Session[] | undefined;
}) {
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: updateEpisode, isPending } = useUpdateEpisode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(tyrannyRoll ?? ""));

  const sorted = sessions ? [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber) : [];
  const firstRecapPublished = sorted[0]?.recapPublished === true;

  const showToPlayers =
    firstRecapPublished && tyrannyRoll != null && tyrannyRoll >= 1 && tyrannyRoll <= 12;

  if (!isGm && !showToPlayers) return null;

  const save = () => {
    const n = Number.parseInt(draft, 10);
    if (Number.isNaN(n) || n < 1 || n > 12) return;
    updateEpisode({ id: episodeId, tyrannyRoll: n }, { onSuccess: () => setEditing(false) });
  };

  return (
    <>
      <div style={royalPurpleScope} className="absolute top-6 right-6">
        <DiceIcon faces={12} value={tyrannyRoll ?? undefined} size="lg" active hideValue={false} />
      </div>

      {isGm && (
        <Stack gap={2} className="mt-4">
          {!firstRecapPublished && <Badge variant="ghost">Luonnos</Badge>}

          {editing ? (
            <Stack direction="row" align="end" gap={3} wrap>
              <Input
                label="Tulos (1–12)"
                type="number"
                min={1}
                max={12}
                size="compact"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-28"
              />
              <Button
                size="compact"
                onClick={save}
                loading={isPending}
                loadingMessage="Tallennetaan..."
              >
                Tallenna
              </Button>
              <Button size="compact" variant="outline" onClick={() => setEditing(false)}>
                Peruuta
              </Button>
            </Stack>
          ) : (
            <Button
              size="compact"
              variant="outline"
              onClick={() => {
                setDraft(String(tyrannyRoll ?? ""));
                setEditing(true);
              }}
            >
              {tyrannyRoll != null ? `Tulos: ${tyrannyRoll} — Muokkaa` : "Aseta tulos"}
            </Button>
          )}
        </Stack>
      )}
    </>
  );
}
