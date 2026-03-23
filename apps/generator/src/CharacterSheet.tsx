import { AspectTag } from "@repo/ui/components/AspectTag";
import { TextArea } from "@repo/ui/components/TextArea";
import { Button } from "@repo/ui/components/Button";
import { Checkbox } from "@repo/ui/components/Checkbox";
import { DicePoolTracker } from "@repo/ui/components/DicePoolTracker";
import { EnduranceBlock } from "@repo/ui/components/EnduranceBlock";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Select } from "@repo/ui/components/Select";
import { useAuth } from "@repo/auth/use-auth";
import { Input } from "@repo/ui/components/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { apiBaseUrl } from "./api/base-url";

interface Character {
  id: number;
  userId: number;
  name: string;
  archetype: string;
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
  harmit: Array<{ text: string; healed: boolean }>;
  skills: { name: string; isCustom?: boolean }[] | string[];
  ownerName: string | null;
  fysiikka: number;
  nopeus: number;
  ymmarrys: number;
  persoona: number;
  nakemys: number;
  napparyys: number;
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
          description={character.archetype}
        />

        {!canEdit && character.ownerName && (
          <NoticePanel variant="info" title="Katselutila" className="mb-6">
            <p>Tämä on <strong>{character.ownerName}</strong>:n hahmo. Voit katsella hahmosivua, mutta et voi muokata sitä.</p>
          </NoticePanel>
        )}

        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <section
              className="rounded-sm border-l-4 border-[var(--theme-secondary)] bg-[var(--theme-secondary)]/5 p-6 mt-4 shadow-[0_0_12px_color-mix(in_srgb,var(--theme-secondary)_8%,transparent)]"
            >
              <HeadingLevelProvider>
                <Heading className="mb-4">Perustiedot</Heading>
              </HeadingLevelProvider>
              <div className="space-y-4">
                <EditableText
                  label="Arkkityyppi"
                  value={character.archetype}
                  canEdit={canEdit}
                  placeholder="Ei arkkityyppiä."
                  onSave={(v) => updateCharacter({ archetype: v })}
                />

                {character.episodeTitle && (
                  <p className="text-sm text-[var(--theme-text)]/70">
                    Jakso: <span className="font-semibold text-[var(--theme-text)]">{ character.episodeTitle}</span>
                  </p>
                )}

                <EditableSex
                  value={character.sex}
                  canEdit={canEdit}
                  sexLabel={sexLabel}
                  onSave={(v) => updateCharacter({ sex: v })}
                />

                <SkillsSection
                  skills={character.skills}
                  canEdit={canEdit}
                  onUpdate={(skills) => updateCharacter({ skills })}
                />

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
              </div>
            </section>
          </div>
          <HeadingLevelProvider>
            <div className="space-y-6">
              <Heading>Resurssit</Heading>

              <div className="space-y-4 mt-4 mb-8">
                <SisuPoolSection
                  character={character}
                  canEdit={canEdit}
                  onUpdate={updateCharacter}
                />

                <HarmiSection
                  harmit={character.harmit ?? []}
                  canEdit={canEdit}
                  onUpdate={(harmit) => updateCharacter({ harmit })}
                />
              </div>

              <Heading>Kestot</Heading>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <EnduranceBlock
                  label="Keho"
                  value={character.currentKeho}
                  maxValue={canEdit ? character.keho : character.currentKeho}
                  subAttributes={[
                    { label: "Fysiikka", diceValue: character.fysiikka },
                    { label: "Nopeus", diceValue: character.nopeus },
                  ]}
                  onIncrement={canEdit ? () => updateCharacter({ currentKeho: character.currentKeho + 1 }) : undefined}
                  onDecrement={canEdit ? () => updateCharacter({ currentKeho: character.currentKeho - 1 }) : undefined}
                  {...lockIfReadOnly(character.currentKeho)}
                />
                <EnduranceBlock
                  label="Mieli"
                  value={character.currentMieli}
                  maxValue={canEdit ? character.mieli : character.currentMieli}
                  subAttributes={[
                    { label: "Ymmärrys", diceValue: character.ymmarrys },
                    { label: "Persoona", diceValue: character.persoona },
                  ]}
                  onIncrement={canEdit ? () => updateCharacter({ currentMieli: character.currentMieli + 1 }) : undefined}
                  onDecrement={canEdit ? () => updateCharacter({ currentMieli: character.currentMieli - 1 }) : undefined}
                  {...lockIfReadOnly(character.currentMieli)}
                />
                <EnduranceBlock
                  label="Terä"
                  value={character.currentTera}
                  maxValue={canEdit ? character.tera : character.currentTera}
                  subAttributes={[
                    { label: "Näkemys", diceValue: character.nakemys },
                    { label: "Näppäryys", diceValue: character.napparyys },
                  ]}
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
        <p className="text-sm text-[var(--theme-text)]/70 font-semibold mb-1">{label}:</p>
        <p className="text-sm whitespace-pre-wrap text-[var(--theme-text)]/85">{value}</p>
      </div>
    ) : null;
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-[var(--theme-text)]/70 font-semibold">{label}:</p>
        <TextArea
          className="h-20"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          // biome-ignore lint/a11y/noAutofocus: intentional for edit mode
          autoFocus
        />
        <div className="flex items-center gap-3 mt-3">
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
            variant="ghost-secondary"
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
      <p className="text-sm text-[var(--theme-text)]/70 font-semibold mb-1">{label}:</p>
      <p
        className="text-sm whitespace-pre-wrap cursor-pointer text-[var(--theme-text)]/85 hover:text-[var(--theme-secondary)] transition-colors"
        onClick={() => setEditing(true)}
        title="Klikkaa muokataksesi"
      >
        {value || <span className="italic opacity-50">{placeholder}</span>}
      </p>
    </div>
  );
}

function EditableText({
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
        <p className="text-sm text-[var(--theme-text)]/70 font-semibold mb-1">{label}:</p>
        <p className="text-sm text-[var(--theme-text)]/85">{value}</p>
      </div>
    ) : null;
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-[var(--theme-text)]/70 font-semibold">{label}:</p>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave(draft);
              setEditing(false);
            }
          }}
          // biome-ignore lint/a11y/noAutofocus: intentional for edit mode
          autoFocus
        />
        <div className="flex items-center gap-3 mt-3">
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
            variant="ghost-secondary"
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
      <p className="text-sm text-[var(--theme-text)]/70 font-semibold mb-1">{label}:</p>
      <p
        className="text-sm cursor-pointer text-[var(--theme-text)]/85 hover:text-[var(--theme-secondary)] transition-colors"
        onClick={() => setEditing(true)}
        title="Klikkaa muokataksesi"
      >
        {value || <span className="italic opacity-50">{placeholder}</span>}
      </p>
    </div>
  );
}

const sexOptions = [
  { value: "male", label: "Mies" },
  { value: "female", label: "Nainen" },
  { value: "non-binary", label: "Ei-binäärinen" },
  { value: "none", label: "Ei määritelty" },
];

function EditableSex({
  value,
  canEdit,
  sexLabel,
  onSave,
}: {
  value: string | null;
  canEdit: boolean;
  sexLabel: Record<string, string>;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (!canEdit) {
    return value ? (
      <p className="text-sm text-[var(--theme-text)]/70">
        Sukupuoli:{" "}
        <span className="font-semibold text-[var(--theme-text)]">
          {sexLabel[value] ?? value}
        </span>
      </p>
    ) : null;
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <Select
          label="Sukupuoli"
          options={sexOptions}
          value={value ?? ""}
          onChange={(e) => {
            onSave(e.target.value);
            setEditing(false);
          }}
          placeholder="Valitse sukupuoli"
        />
        <Button
          size="sm"
          variant="ghost-secondary"
          onClick={() => setEditing(false)}
        >
          Peruuta
        </Button>
      </div>
    );
  }

  return (
    <p
      className="text-sm text-[var(--theme-text)]/70 cursor-pointer hover:text-[var(--theme-secondary)] transition-colors"
      onClick={() => setEditing(true)}
      title="Klikkaa muokataksesi"
    >
      Sukupuoli:{" "}
      <span className="font-semibold text-[var(--theme-text)]">
        {value ? (sexLabel[value] ?? value) : <span className="italic opacity-50">Ei valittu</span>}
      </span>
    </p>
  );
}

function SkillsSection({
  skills,
  canEdit,
  onUpdate,
}: {
  skills: { name: string; isCustom?: boolean }[] | string[];
  canEdit: boolean;
  onUpdate: (skills: { name: string; isCustom?: boolean }[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftCustom, setDraftCustom] = useState(false);

  if (!skills || skills.length === 0) return null;

  const normalizedSkills = skills.map((s) =>
    typeof s === "string" ? { name: s, isCustom: false } : s,
  );

  const startEditing = (index: number) => {
    if (!canEdit) return;
    const skill = normalizedSkills[index];
    setEditingIndex(index);
    setDraftName(skill.name);
    setDraftCustom(skill.isCustom ?? false);
  };

  const saveSkill = () => {
    if (editingIndex === null || !draftName.trim()) return;
    const updated = normalizedSkills.map((s, i) =>
      i === editingIndex ? { name: draftName.trim(), isCustom: draftCustom } : s,
    );
    onUpdate(updated);
    setEditingIndex(null);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  return (
    <div>
      <p className="text-sm text-[var(--theme-text)]/70 mb-2">Taidot:</p>
      <div className="flex flex-wrap gap-2">
        {normalizedSkills.map((skill, i) => {
          if (editingIndex === i) {
            return (
              <div key={i} className="flex flex-col gap-2 w-full">
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveSkill();
                    if (e.key === "Escape") cancelEditing();
                  }}
                  // biome-ignore lint/a11y/noAutofocus: intentional for edit mode
                  autoFocus
                />
                <Checkbox
                  label="Oma taito"
                  checked={draftCustom}
                  onChange={(e) => setDraftCustom(e.target.checked)}
                />
                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={saveSkill} disabled={!draftName.trim()}>
                    Tallenna
                  </Button>
                  <Button size="sm" variant="ghost-secondary" onClick={cancelEditing}>
                    Peruuta
                  </Button>
                </div>
              </div>
            );
          }
          return (
            <AspectTag
              key={i}
              text={skill.name}
              variant="skill"
              isCustom={skill.isCustom ?? false}
              readOnly={!canEdit}
              onClick={() => startEditing(i)}
              className={canEdit ? "cursor-pointer" : undefined}
              title={canEdit ? "Klikkaa muokataksesi" : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Manages harm tags: add, heal/activate, remove */
function HarmiSection({
  harmit,
  canEdit,
  onUpdate,
}: {
  harmit: Array<{ text: string; healed: boolean }>;
  canEdit: boolean;
  onUpdate: (harmit: Array<{ text: string; healed: boolean }>) => void;
}) {
  const [newHarmiText, setNewHarmiText] = useState("");
  const activeCount = harmit.filter((h) => !h.healed).length;
  const totalCount = harmit.length;

  const handleAdd = () => {
    const text = newHarmiText.trim();
    if (!text || totalCount >= 5) return;
    onUpdate([...harmit, { text, healed: false }]);
    setNewHarmiText("");
  };

  const handleRemove = (index: number) => {
    onUpdate(harmit.filter((_, i) => i !== index));
  };

  const handleToggleHeal = (index: number) => {
    onUpdate(
      harmit.map((h, i) => (i === index ? { ...h, healed: !h.healed } : h)),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[var(--theme-text)]">
          Harmit{" "}
          <span className="font-normal text-[var(--theme-secondary)]">
            ({activeCount} aktiivista, {totalCount}/5)
          </span>
        </p>
      </div>

      {totalCount >= 5 && (
        <NoticePanel variant="info" title="Hahmo pois pelistä">
          <p>Hahmo on kerännyt 5 harmia ja on poistettu pelistä.</p>
        </NoticePanel>
      )}

      {harmit.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {harmit.map((h, i) => (
            <AspectTag
              key={`${h.text}-${i}`}
              text={h.text}
              variant="harm"
              healed={h.healed}
              onRemove={canEdit ? () => handleRemove(i) : undefined}
              onToggleHeal={canEdit ? () => handleToggleHeal(i) : undefined}
              readOnly={!canEdit}
            />
          ))}
        </div>
      )}

      {canEdit && totalCount < 5 && (
        <div className="flex gap-2 items-end">
          <Input
            label="Uusi harmi"
            placeholder="Esim. Palovamma"
            value={newHarmiText}
            onChange={(e) => setNewHarmiText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <div className="mt-2 shrink-0">
            <Button
              onClick={handleAdd}
              disabled={!newHarmiText.trim()}
            >
              Lisää
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Maps the flat sisuDie/sisuCount model into DicePoolTracker props */
function SisuPoolSection({
  character,
  canEdit,
  onUpdate,
}: {
  character: Character;
  canEdit: boolean;
  onUpdate: (updates: Partial<Character>) => void;
}) {
  const dieFaces = Number.parseInt(character.sisuDie.replace("n", ""), 10) as 4 | 6 | 8 | 10 | 12 | 20;

  const dice = useMemo(
    () =>
      Array.from({ length: character.sisuCount }, (_, i) => ({
        id: `sisu-${i}`,
        faces: dieFaces,
      })),
    [character.sisuCount, dieFaces],
  );

  // Treat the *last* N dice as removed (N = sisuCount - currentSisuCount)
  const removedIds = useMemo(() => {
    const removedCount = character.sisuCount - character.currentSisuCount;
    return dice.slice(dice.length - removedCount).map((d) => d.id);
  }, [dice, character.sisuCount, character.currentSisuCount]);

  const handleToggle = (id: string) => {
    const isCurrentlyRemoved = removedIds.includes(id);
    const newCount = isCurrentlyRemoved
      ? character.currentSisuCount + 1
      : character.currentSisuCount - 1;
    if (newCount >= 0 && newCount <= character.sisuCount) {
      onUpdate({ currentSisuCount: newCount });
    }
  };

  return (
    <DicePoolTracker
      dice={dice}
      removedIds={removedIds}
      onDieToggle={canEdit ? handleToggle : undefined}
      readOnly={!canEdit}
      label="Sisu"
    />
  );
}
