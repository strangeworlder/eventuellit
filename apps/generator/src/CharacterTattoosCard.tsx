import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icon,
  Input,
  Stack,
  Text,
  TextArea,
  ToolButton,
} from "@repo/ui";
import { useMemo, useState } from "react";
import type { CharacterTattoo } from "./api/characters";

export interface CharacterTattoosCardProps {
  monkAdvancementsAllowed: number;
  tattoos: CharacterTattoo[];
  canEdit: boolean;
  onUpdate: (tattoos: CharacterTattoo[]) => void;
}

export function CharacterTattoosCard({
  monkAdvancementsAllowed,
  tattoos,
  canEdit,
  onUpdate,
}: CharacterTattoosCardProps) {
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");

  const tattooBySlot = useMemo(() => {
    const map = new Map<number, CharacterTattoo>();
    for (const tattoo of tattoos) {
      if (Number.isInteger(tattoo.slot) && tattoo.slot >= 1 && tattoo.title.trim()) {
        map.set(tattoo.slot, tattoo);
      }
    }
    return map;
  }, [tattoos]);

  const maxExistingSlot = useMemo(() => {
    let max = 0;
    for (const slot of tattooBySlot.keys()) {
      if (slot > max) max = slot;
    }
    return max;
  }, [tattooBySlot]);

  const slotCount = Math.max(monkAdvancementsAllowed, maxExistingSlot);

  if (slotCount === 0) {
    return null;
  }

  const slots = Array.from({ length: slotCount }, (_, index) => index + 1);
  const describedCount = tattooBySlot.size;

  const handleStartEdit = (slot: number) => {
    const existing = tattooBySlot.get(slot);
    setDraftTitle(existing?.title ?? "");
    setDraftDescription(existing?.description ?? "");
    setEditingSlot(slot);
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setDraftTitle("");
    setDraftDescription("");
  };

  const handleSaveSlot = (slot: number) => {
    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) return;
    const trimmedDescription = draftDescription.trim();

    const nextMap = new Map(tattooBySlot);
    nextMap.set(slot, {
      slot,
      title: trimmedTitle,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    });

    const nextTattoos = [...nextMap.values()].sort((a, b) => a.slot - b.slot);
    onUpdate(nextTattoos);
    setEditingSlot(null);
    setDraftTitle("");
    setDraftDescription("");
  };

  const handleClearSlot = (slot: number) => {
    const nextMap = new Map(tattooBySlot);
    nextMap.delete(slot);
    const nextTattoos = [...nextMap.values()].sort((a, b) => a.slot - b.slot);
    onUpdate(nextTattoos);
    setEditingSlot(null);
    setDraftTitle("");
    setDraftDescription("");
  };

  return (
    <Card variant="highlight" className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Tatuoinnit</CardTitle>
        <Badge variant="outline">
          {describedCount} / {monkAdvancementsAllowed} kuvattu
        </Badge>
      </CardHeader>
      <CardContent>
        <Stack gap={3}>
          {slots.map((slot) => {
            const tattoo = tattooBySlot.get(slot);
            const isEditing = canEdit && editingSlot === slot;
            const isOverPotential = slot > monkAdvancementsAllowed;

            if (isEditing) {
              return (
                <Stack
                  key={slot}
                  gap={3}
                  className="rounded-lg border border-[var(--theme-border-medium)] bg-[var(--theme-bg)] p-3"
                >
                  <Stack direction="row" align="center" justify="between" gap={2} wrap>
                    <Text variant="label">Tatuointi {slot}</Text>
                    {isOverPotential && <Badge variant="outline">Yli nykyisen potentiaalin</Badge>}
                  </Stack>

                  <Input
                    label="Otsikko"
                    placeholder="Esim. Sininen kalatatuointi"
                    value={draftTitle}
                    maxLength={120}
                    autoFocus
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && draftTitle.trim()) {
                        e.preventDefault();
                        handleSaveSlot(slot);
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        handleCancelEdit();
                      }
                    }}
                  />

                  <TextArea
                    label="Tarkempi kuvaus (valinnainen)"
                    placeholder="Sijainti kehossa, ulkonäkö, mistä jaksosta saatu..."
                    value={draftDescription}
                    maxLength={2000}
                    rows={3}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.preventDefault();
                        handleCancelEdit();
                      }
                    }}
                  />

                  <Stack direction="row" align="center" justify="between" gap={2} wrap>
                    <Stack direction="row" align="center" gap={2}>
                      <Button onClick={() => handleSaveSlot(slot)} disabled={!draftTitle.trim()}>
                        Tallenna
                      </Button>
                      <Button variant="ghost-subtle" onClick={handleCancelEdit}>
                        Peruuta
                      </Button>
                    </Stack>
                    {tattoo && (
                      <Button variant="danger" onClick={() => handleClearSlot(slot)}>
                        Tyhjennä
                      </Button>
                    )}
                  </Stack>
                </Stack>
              );
            }

            return (
              <Stack
                key={slot}
                gap={2}
                className="rounded-lg border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] p-3"
              >
                <Stack direction="row" align="center" justify="between" gap={2} wrap>
                  <Stack direction="row" align="center" gap={2} wrap>
                    <Text variant="label">Tatuointi {slot}</Text>
                    {isOverPotential && <Badge variant="outline">Yli nykyisen potentiaalin</Badge>}
                  </Stack>
                  {canEdit && (
                    <ToolButton
                      onClick={() => handleStartEdit(slot)}
                      aria-label={
                        tattoo ? `Muokkaa tatuointia ${slot}` : `Kuvaile tatuointi ${slot}`
                      }
                    >
                      <Icon name="pencil" size={14} aria-hidden="true" />
                      {tattoo ? "Muokkaa" : "Kuvaile"}
                    </ToolButton>
                  )}
                </Stack>

                {tattoo ? (
                  <Stack gap={1}>
                    <Text variant="bold">{tattoo.title}</Text>
                    {tattoo.description && (
                      <Text variant="small" className="whitespace-pre-wrap">
                        {tattoo.description}
                      </Text>
                    )}
                  </Stack>
                ) : (
                  <Text variant="muted">Ei vielä kuvailtu.</Text>
                )}
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
