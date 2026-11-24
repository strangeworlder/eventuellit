import { useAuth } from "@repo/auth/use-auth";
import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { DiceIcon } from "@repo/ui/components/DiceIcon";
import { FieldError } from "@repo/ui/components/FieldError";
import { Input } from "@repo/ui/components/Input";
import { Stack } from "@repo/ui/components/Layout";
import { useMemo, useState } from "react";
import { useUpdateEpisode } from "../api/episodes";
import type { Session } from "../api/sessions";
import { isValidTyrannyRoll, parseTyrannyRollsInput } from "./tyranny-rolls";

/** Scoped theme override: maps --theme-primary to royal purple design tokens */
const royalPurpleScope = {
  "--theme-primary": "var(--color-royal-purple-500)",
  "--theme-primary-foreground": "var(--color-royal-purple-foreground)",
  "--theme-secondary": "var(--color-royal-purple-400)",
  "--theme-secondary-foreground": "var(--color-royal-purple-foreground)",
} as React.CSSProperties;

const DICE_FACES = 12;

export function TyrannyRollBadge({
  episodeId,
  tyrannyRolls,
  sessions,
}: {
  episodeId: number;
  tyrannyRolls: string[] | null | undefined;
  sessions: Session[] | undefined;
}) {
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: updateEpisode, isPending } = useUpdateEpisode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validRolls = useMemo(
    () => (tyrannyRolls ?? []).map((roll) => roll.trim().toUpperCase()).filter(isValidTyrannyRoll),
    [tyrannyRolls],
  );

  const keyedRolls = useMemo(() => {
    const counts = new Map<string, number>();
    return validRolls.map((roll) => {
      const occurrence = (counts.get(roll) ?? 0) + 1;
      counts.set(roll, occurrence);
      return { key: `${roll}#${occurrence}`, roll };
    });
  }, [validRolls]);

  const sorted = useMemo(
    () => (sessions ? [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber) : []),
    [sessions],
  );
  const firstRecapPublished = sorted[0]?.recapPublished === true;

  const showToPlayers = firstRecapPublished && validRolls.length > 0;

  if (!isGm && !showToPlayers) return null;

  const openEditor = () => {
    setDraft(validRolls.join(", "));
    setError(null);
    setEditing(true);
  };

  const cancel = () => {
    setError(null);
    setEditing(false);
  };

  const save = () => {
    const parsed = parseTyrannyRollsInput(draft);
    if (!parsed.ok) {
      setError(
        `Virheellinen arvo (${parsed.invalidTokens.join(", ")}). Sallitut: 1–12 tai yksittäinen kirjain (A–Ö).`,
      );
      return;
    }
    setError(null);
    updateEpisode(
      { id: episodeId, tyrannyRolls: parsed.rolls },
      { onSuccess: () => setEditing(false) },
    );
  };

  const editButtonLabel =
    validRolls.length === 0
      ? "Aseta tulos"
      : validRolls.length === 1
        ? `Tulos: ${validRolls[0]} — Muokkaa`
        : `Tulokset: ${validRolls.join(", ")} — Muokkaa`;

  return (
    <>
      <Stack
        direction="row"
        gap={2}
        wrap
        justify="end"
        style={royalPurpleScope}
        className="absolute top-6 right-6"
      >
        {keyedRolls.length > 0 ? (
          keyedRolls.map(({ key, roll }, index) => (
            <DiceIcon
              key={key}
              faces={DICE_FACES}
              value={roll}
              size="lg"
              active
              hideValue={false}
              aria-label={
                keyedRolls.length === 1
                  ? `Tyrannian noppa: ${roll}`
                  : `Tyrannian noppa ${index + 1}: ${roll}`
              }
            />
          ))
        ) : (
          <DiceIcon
            faces={DICE_FACES}
            value={undefined}
            size="lg"
            active
            hideValue={false}
            aria-label="Tyrannian noppa: ei heitetty"
          />
        )}
      </Stack>

      {isGm && (
        <Stack gap={2} className="mt-4">
          {!firstRecapPublished && <Badge variant="ghost">Luonnos</Badge>}

          {editing ? (
            <Stack gap={2} align="start">
              <Stack direction="row" align="end" gap={3} wrap>
                <div className="w-56">
                  <Input
                    label="Tulokset (1–12 tai kirjain)"
                    placeholder="esim. 4, K, 11"
                    size="compact"
                    value={draft}
                    aria-invalid={Boolean(error)}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") save();
                      if (e.key === "Escape") cancel();
                    }}
                  />
                </div>
                <Button
                  size="compact"
                  onClick={save}
                  loading={isPending}
                  loadingMessage="Tallennetaan..."
                >
                  Tallenna
                </Button>
                <Button size="compact" variant="outline" onClick={cancel}>
                  Peruuta
                </Button>
              </Stack>
              {error && <FieldError>{error}</FieldError>}
            </Stack>
          ) : (
            <Button size="compact" variant="outline" onClick={openEditor}>
              {editButtonLabel}
            </Button>
          )}
        </Stack>
      )}
    </>
  );
}
