import { ActiveStatBlock } from "@repo/ui/components/ActiveStatBlock";
import { Button } from "@repo/ui/components/Button";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { useAuth } from "@repo/auth/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiBaseUrl } from "./api/base-url";

interface Character {
  id: number;
  userId: number;
  name: string;
  archetype: "soldier" | "expert";
  episodeId: number | null;
  episodeTitle: string | null;
  sex: string | null;
  motivation: string | null;
  notes: string | null;
  keho: number;
  currentKeho: number;
  mieli: number;
  currentMieli: number;
  tera: number;
  currentTera: number;
  sisuDie: "n4" | "n6" | "n8" | "n10" | "n12";
  sisuCount: number;
  currentSisuCount: number;
  vaurio: number;
  skills: { name: string; isCustom?: boolean }[] | string[];
  ownerName: string | null;
}

export function CharacterSheet({
  characterId,
  onBack,
}: {
  characterId: number;
  onBack: () => void;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: character, isLoading } = useQuery<Character>({
    queryKey: ["character", characterId],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Character fetch failed");
      return res.json();
    },
  });

  const { mutate: updateCharacter } = useMutation({
    mutationFn: async (updates: Partial<Character>) => {
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onMutate: async (newUpdates) => {
      await queryClient.cancelQueries({ queryKey: ["character", characterId] });
      const previous = queryClient.getQueryData(["character", characterId]);
      queryClient.setQueryData(["character", characterId], (old: any) => ({
        ...old,
        ...newUpdates,
      }));
      return { previous };
    },
    onError: (_err, _newUpdates, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["character", characterId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
    },
  });

  const { mutate: deleteCharacter, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      onBack();
    },
  });

  if (isLoading || !character) {
    return <LoadingState message="Ladataan hahmoa..." size="large" layout="padded" />;
  }

  const canEdit = user !== null && (user.id === character.userId || user.role === "gm");

  const lockIfReadOnly = (current: number) => ({
    minAllowed: canEdit ? 0 : current,
    maxAllowed: canEdit ? undefined : current,
  });

  const sexLabel: Record<string, string> = {
    male: "Mies",
    female: "Nainen",
    "non-binary": "Ei-binäärinen",
    none: "Ei määritelty",
  };

  return (
    <HeadingLevelProvider>
      <div className="animate-in fade-in duration-500">
        <Hero
          title={character.name}
          description={character.archetype === "soldier" ? "Sotilas" : "Ekspertti"}
        />

        {!canEdit && character.ownerName && (
          <NoticePanel variant="info" title="Katselutila" className="mb-6">
            <p>Tämä on <strong>{character.ownerName}</strong>:n hahmo. Voit katsella hahmosivua, mutta et voi muokata sitä.</p>
          </NoticePanel>
        )}

        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <NoticePanel variant="info" title="Perustiedot" className="mt-4">
              <p className="text-lg leading-relaxed">
                {/* Hahmon tiedot */}
                {character.episodeTitle && (
                  <p className="text-sm text-secondary">
                    Jakso: <span className="font-semibold text-primary">{character.episodeTitle}</span>
                  </p>
                )}

                {character.sex && (
                  <p className="text-sm text-secondary">
                    Sukupuoli:{" "}
                    <span className="font-semibold text-primary">
                      {sexLabel[character.sex] ?? character.sex}
                    </span>
                  </p>
                )}

                {character.skills && character.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-secondary mb-1">Taidot:</p>
                    <ul className="space-y-1">
                      {(character.skills as Array<{ name: string; isCustom?: boolean } | string>).map(
                        (skill, i) => {
                          const name = typeof skill === "string" ? skill : skill.name;
                          const isCustom = typeof skill !== "string" && skill.isCustom;
                          return (
                            <li key={i} className="text-sm">
                              {name}
                              {isCustom && (
                                <span className="ml-2 text-xs text-[var(--theme-accent)] font-semibold uppercase">
                                  (oma)
                                </span>
                              )}
                            </li>
                          );
                        },
                      )}
                    </ul>
                  </div>
                )}

                <EditableTextarea
                  label="Motivaatio"
                  value={character.motivation ?? ""}
                  canEdit={canEdit}
                  placeholder="Ei motivaatiota kirjattu."
                  onSave={(v) => updateCharacter({ motivation: v })}
                />

                <EditableTextarea
                  label="Muistiinpanot"
                  value={character.notes ?? ""}
                  canEdit={canEdit}
                  placeholder="Ei muistiinpanoja."
                  onSave={(v) => updateCharacter({ notes: v })}
                />

              </p>
            </NoticePanel>
          </div>
          <HeadingLevelProvider>
            <div className="space-y-6">
              <Heading>Resurssit</Heading>

              <div className="grid grid-cols-2 gap-4 mt-4 mb-8">
                <ActiveStatBlock
                  label={`Sisu (${character.sisuCount} x ${character.sisuDie})`}
                  value={character.currentSisuCount}
                  maxValue={canEdit ? character.sisuCount : character.currentSisuCount}
                  onIncrement={canEdit ? () => updateCharacter({ currentSisuCount: character.currentSisuCount + 1 }) : undefined}
                  onDecrement={canEdit ? () => updateCharacter({ currentSisuCount: character.currentSisuCount - 1 }) : undefined}
                  {...lockIfReadOnly(character.currentSisuCount)}
                  className="col-span-2"
                />

                <ActiveStatBlock
                  label="Vaurio"
                  value={character.vaurio}
                  maxAllowed={canEdit ? 5 : character.vaurio}
                  onIncrement={canEdit ? () => updateCharacter({ vaurio: character.vaurio + 1 }) : undefined}
                  onDecrement={canEdit ? () => updateCharacter({ vaurio: character.vaurio - 1 }) : undefined}
                  minAllowed={canEdit ? 0 : character.vaurio}
                  className="col-span-2"
                />
              </div>

              <Heading>Kestot (Durations)</Heading>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <ActiveStatBlock
                  label="Keho"
                  value={character.currentKeho}
                  maxValue={canEdit ? character.keho : character.currentKeho}
                  onIncrement={canEdit ? () => updateCharacter({ currentKeho: character.currentKeho + 1 }) : undefined}
                  onDecrement={canEdit ? () => updateCharacter({ currentKeho: character.currentKeho - 1 }) : undefined}
                  {...lockIfReadOnly(character.currentKeho)}
                />
                <ActiveStatBlock
                  label="Mieli"
                  value={character.currentMieli}
                  maxValue={canEdit ? character.mieli : character.currentMieli}
                  onIncrement={canEdit ? () => updateCharacter({ currentMieli: character.currentMieli + 1 }) : undefined}
                  onDecrement={canEdit ? () => updateCharacter({ currentMieli: character.currentMieli - 1 }) : undefined}
                  {...lockIfReadOnly(character.currentMieli)}
                />
                <ActiveStatBlock
                  label="Terä"
                  value={character.currentTera}
                  maxValue={canEdit ? character.tera : character.currentTera}
                  onIncrement={canEdit ? () => updateCharacter({ currentTera: character.currentTera + 1 }) : undefined}
                  onDecrement={canEdit ? () => updateCharacter({ currentTera: character.currentTera - 1 }) : undefined}
                  {...lockIfReadOnly(character.currentTera)}
                />
              </div>

              {canEdit && (
                <div className="pt-4">
                  <Button
                    variant="danger"
                    loading={isDeleting}
                    onClick={() => {
                      if (confirm(`Haluatko varmasti poistaa hahmon "${character.name}"? Tätä ei voi peruuttaa.`)) {
                        deleteCharacter();
                      }
                    }}
                  >
                    Poista hahmo
                  </Button>
                </div>
              )}
            </div>
          </HeadingLevelProvider>
        </div>
      </div>
    </HeadingLevelProvider>
  );
}

function EditableTextarea({
  label,
  value,
  canEdit,
  placeholder,
  onSave,
}: {
  label: string;
  value: string;
  canEdit: boolean;
  placeholder: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!canEdit) {
    return value ? (
      <div>
        <p className="text-sm text-secondary mb-1">{label}:</p>
        <p className="text-sm whitespace-pre-wrap">{value}</p>
      </div>
    ) : null;
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-secondary">{label}:</p>
        <textarea
          className="w-full p-2 border rounded-md text-sm h-20 resize-none bg-transparent border-[var(--theme-secondary)]/30"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          // biome-ignore lint/a11y/noAutofocus: intentional for edit mode
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              onSave(draft);
              setEditing(false);
            }}
          >
            Tallenna
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setDraft(value);
              setEditing(false);
            }}
          >
            Peruuta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-secondary mb-1">{label}:</p>
      <p
        className="text-sm whitespace-pre-wrap cursor-pointer hover:text-primary"
        onClick={() => setEditing(true)}
        title="Klikkaa muokataksesi"
      >
        {value || <span className="italic opacity-50">{placeholder}</span>}
      </p>
    </div>
  );
}
