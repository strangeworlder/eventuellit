import { useAuth } from "@repo/auth/use-auth";
import { AspectTag } from "@repo/ui/components/AspectTag";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { ConfirmDialog } from "@repo/ui/components/ConfirmDialog";
import { DicePoolTracker } from "@repo/ui/components/DicePoolTracker";
import { EditableField } from "@repo/ui/components/EditableField";
import { EnduranceBlock } from "@repo/ui/components/EnduranceBlock";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { Link } from "@repo/ui/components/Link";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { PageBody } from "@repo/ui/components/Page";
import { SkillTagList } from "@repo/ui/components/SkillTagList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { apiBaseUrl } from "./api/base-url";
import { suggestNames } from "./name-generator";

interface Character {
  id: number;
  userId: number;
  name: string;
  archetype: string;
  episodes: { id: number; title: string; status: string }[];
  sex: string | null;
  motivation: string | null;
  notes: string | null;
  keho: number;
  currentKeho: number;
  mieli: number;
  currentMieli: number;
  tera: number;
  currentTera: number;
  sisuDice: Array<{ id: string; faces: number }>;
  removedSisuIds: string[];
  harmit: Array<{ text: string; healed: boolean }>;
  skills: { name: string; isCustom?: boolean }[] | string[];
  ownerName: string | null;
  fysiikka: number;
  nopeus: number;
  ymmarrys: number;
  persoona: number;
  nakemys: number;
  napparyys: number;
  nicknames: string[];
  inventory?: Array<{ id: string; name: string; description?: string; quantity: number }>;
}

export function CharacterSheet({
  characterId,
  basePath,
  onBack,
}: {
  characterId: number;
  basePath: string;
  onBack: () => void;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: character, isLoading } = useQuery<Character>({
    queryKey: ["character", characterId],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error("Character fetch failed");
      return res.json();
    },
  });

  const { mutate: updateCharacter } = useMutation({
    mutationFn: async (updates: Partial<Character>) => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

  const [deleteCharacterOpen, setDeleteCharacterOpen] = useState(false);

  const { mutate: deleteCharacter, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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


  return (
    <HeadingLevelProvider>
      <div className="animate-in fade-in duration-500">
        <Hero title={character.name} description={character.archetype} />

        <PageBody className="pb-0 pt-4">
          <Breadcrumb
            items={[{ label: "Hahmot", to: `${basePath}/list` }, { label: character.name }]}
          />
        </PageBody>

        {!canEdit && character.ownerName && (
          <NoticePanel variant="info" title="Katselutila" className="mb-6">
            <p>
              Tämä on <strong>{character.ownerName}</strong>:n hahmo. Voit katsella hahmosivua,
              mutta et voi muokata sitä.
            </p>
          </NoticePanel>
        )}

        <PageBody className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card variant="highlight" className="mt-4">
              <CardHeader>
                <CardTitle>Perustiedot</CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                <EditableName
                  value={character.name}
                  sex={character.sex ?? "none"}
                  canEdit={canEdit}
                  onSave={(v) => updateCharacter({ name: v })}
                />

                <EditableField
                  label="Arkkityyppi"
                  value={character.archetype}
                  readOnly={!canEdit}
                  placeholder="Ei arkkityyppiä."
                  onSave={(v) => updateCharacter({ archetype: v })}
                />

                <NicknamesSection
                  nicknames={character.nicknames ?? []}
                  canEdit={canEdit}
                  onUpdate={(nicknames) => updateCharacter({ nicknames })}
                />

                {character.episodes?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-text-muted">
                      Jaksot:{" "}
                      <span className="font-semibold text-[var(--theme-text)]">
                        {character.episodes.map((e) => e.title).join(", ")}
                      </span>
                    </p>
                    <div className="flex flex-col gap-1.5 items-start">
                      {character.episodes.map((ep) => (
                        <Link key={ep.id} href={`${basePath}/prep/${ep.id}`} className="text-sm">
                          Valmistaudu: {ep.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <EditableField
                  label="Sukupuoli"
                  value={character.sex ?? ""}
                  readOnly={!canEdit}
                  placeholder="Ei valittu"
                  options={[
                    { value: "male", label: "Mies" },
                    { value: "female", label: "Nainen" },
                    { value: "non-binary", label: "Ei-binäärinen" },
                    { value: "none", label: "Ei määritelty" },
                  ]}
                  selectPlaceholder="Valitse sukupuoli"
                  onSave={(v) => updateCharacter({ sex: v })}
                />

                <SkillsSection
                  skills={character.skills}
                  canEdit={canEdit}
                  onUpdate={(skills) => updateCharacter({ skills })}
                />

                <EditableField
                  label="Motivaatio"
                  value={character.motivation ?? ""}
                  readOnly={!canEdit}
                  placeholder="Ei motivaatiota kirjattu."
                  onSave={(v) => updateCharacter({ motivation: v })}
                  multiline
                />

                <EditableField
                  label="Muistiinpanot"
                  value={character.notes ?? ""}
                  readOnly={!canEdit}
                  placeholder="Ei muistiinpanoja."
                  onSave={(v) => updateCharacter({ notes: v })}
                  multiline
                />
              </CardContent>
            </Card>
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
                  onIncrement={
                    canEdit
                      ? () => updateCharacter({ currentKeho: character.currentKeho + 1 })
                      : undefined
                  }
                  onDecrement={
                    canEdit
                      ? () => updateCharacter({ currentKeho: character.currentKeho - 1 })
                      : undefined
                  }
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
                  onIncrement={
                    canEdit
                      ? () => updateCharacter({ currentMieli: character.currentMieli + 1 })
                      : undefined
                  }
                  onDecrement={
                    canEdit
                      ? () => updateCharacter({ currentMieli: character.currentMieli - 1 })
                      : undefined
                  }
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
                  onIncrement={
                    canEdit
                      ? () => updateCharacter({ currentTera: character.currentTera + 1 })
                      : undefined
                  }
                  onDecrement={
                    canEdit
                      ? () => updateCharacter({ currentTera: character.currentTera - 1 })
                      : undefined
                  }
                  {...lockIfReadOnly(character.currentTera)}
                />
              </div>

              {canEdit && (
                <div className="pt-4">
                  <Button
                    variant="danger"
                    loading={isDeleting}
                    onClick={() => setDeleteCharacterOpen(true)}
                  >
                    Poista hahmo
                  </Button>
                  <ConfirmDialog
                    open={deleteCharacterOpen}
                    onOpenChange={setDeleteCharacterOpen}
                    title="Poista hahmo?"
                    description={`Haluatko varmasti poistaa hahmon "${character.name}"? Tätä ei voi peruuttaa.`}
                    confirmLabel="Poista hahmo"
                    cancelLabel="Peruuta"
                    variant="danger"
                    onConfirm={() => deleteCharacter()}
                  />
                </div>
              )}
            </div>
          </HeadingLevelProvider>
        </PageBody>
      </div>
    </HeadingLevelProvider>
  );
}



function EditableName({
  value,
  sex,
  canEdit,
  onSave,
}: {
  value: string;
  sex: string;
  canEdit: boolean;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onSave(trimmed);
      setEditing(false);
      setSuggestions([]);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
    setSuggestions([]);
  };

  const handleSuggest = () => {
    const excluded = [...suggestions, draft, value].filter(Boolean);
    setSuggestions(suggestNames(sex, 5, excluded));
  };

  if (!canEdit) {
    return (
      <div>
        <p className="text-sm text-text-muted font-semibold mb-1">Nimi:</p>
        <p className="text-sm text-[var(--theme-text)]">{value}</p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-text-muted font-semibold">Nimi:</p>
        <Input
          size="compact"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          // biome-ignore lint/a11y/noAutofocus: intentional for edit mode
          autoFocus
        />

        <div className="space-y-1.5">
          <Button size="compact" variant="ghost-subtle" onClick={handleSuggest}>
            {suggestions.length > 0 ? "Ehdota uudelleen" : "Ehdota nimiä"}
          </Button>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 animate-in fade-in duration-200">
              {suggestions.map((name) => (
                <AspectTag
                  key={name}
                  text={name}
                  variant="name"
                  onSelect={() => {
                    setDraft(name);
                    setSuggestions([]);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="compact" onClick={handleSave} disabled={!draft.trim()}>
            Tallenna
          </Button>
          <Button size="compact" variant="ghost-subtle" onClick={handleCancel}>
            Peruuta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text-muted font-semibold mb-1">Nimi:</p>
      <p
        className="text-sm cursor-pointer text-[var(--theme-text)] hover:text-[var(--theme-secondary)] transition-colors"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        title="Klikkaa muokataksesi"
      >
        {value}
      </p>
    </div>
  );
}


export function NicknamesSection({
  nicknames,
  canEdit,
  onUpdate,
}: {
  nicknames: string[];
  canEdit: boolean;
  onUpdate: (nicknames: string[]) => void;
}) {
  const [newNickname, setNewNickname] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    const trimmed = newNickname.trim();
    if (!trimmed || nicknames.includes(trimmed)) return;
    onUpdate([...nicknames, trimmed]);
    setNewNickname("");
    setIsAdding(false);
  };

  const handleRemove = (index: number) => {
    onUpdate(nicknames.filter((_, i) => i !== index));
  };

  if (!canEdit && nicknames.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-muted font-semibold">Lempinimet:</p>
      {nicknames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {nicknames.map((nick, i) => (
            <AspectTag
              key={nick}
              text={nick}
              variant="skill"
              readOnly={!canEdit}
              onRemove={canEdit ? () => handleRemove(i) : undefined}
            />
          ))}
        </div>
      )}
      {canEdit && nicknames.length < 5 &&
        (isAdding ? (
          <div>
            <Input
              label=""
              size="compact"
              placeholder="Kirjoita lempinimi..."
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <div className="flex items-center gap-3 mt-2">
              <Button size="compact" onClick={handleAdd} disabled={!newNickname.trim()}>
                Tallenna
              </Button>
              <Button
                size="compact"
                variant="ghost-subtle"
                onClick={() => {
                  setIsAdding(false);
                  setNewNickname("");
                }}
              >
                Peruuta
              </Button>
            </div>
          </div>
        ) : (
          <p
            className="text-sm cursor-pointer italic text-text-placeholder hover:text-[var(--theme-secondary)] transition-colors"
            onClick={() => setIsAdding(true)}
            title="Klikkaa lisätäksesi lempinimi"
          >
            {nicknames.length === 0 ? "Ei lempinimiä." : "+ Lisää lempinimi"}
          </p>
        ))
      }
    </div>
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
  if (!skills || skills.length === 0) return null;

  const normalizedSkills = skills.map((s, i) =>
    typeof s === "string"
      ? { id: i, name: s, isCustom: false }
      : { id: i, name: s.name, isCustom: s.isCustom ?? false },
  );

  return (
    <div>
      <p className="text-sm text-text-muted mb-2">Taidot:</p>
      <SkillTagList
        items={normalizedSkills}
        readOnly={!canEdit}
        showCustomToggle
        onItemEdit={
          canEdit
            ? (id, name, isCustom) => {
                const updated = normalizedSkills.map((s) =>
                  s.id === id
                    ? { name, isCustom: isCustom ?? s.isCustom }
                    : { name: s.name, isCustom: s.isCustom },
                );
                onUpdate(updated);
              }
            : undefined
        }
      />
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
    onUpdate(harmit.map((h, i) => (i === index ? { ...h, healed: !h.healed } : h)));
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
            <Button onClick={handleAdd} disabled={!newHarmiText.trim()}>
              Lisää
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Maps sisuDice/removedSisuIds into DicePoolTracker props */
function SisuPoolSection({
  character,
  canEdit,
  onUpdate,
}: {
  character: Character;
  canEdit: boolean;
  onUpdate: (updates: Partial<Character>) => void;
}) {
  const dice = useMemo(
    () =>
      (character.sisuDice ?? []).map((d) => ({
        id: d.id,
        faces: d.faces as 4 | 6 | 8 | 10 | 12 | 20,
      })),
    [character.sisuDice],
  );

  const removedIds = character.removedSisuIds ?? [];

  const handleToggle = (id: string) => {
    const isCurrentlyRemoved = removedIds.includes(id);
    const newRemoved = isCurrentlyRemoved
      ? removedIds.filter((rid) => rid !== id)
      : [...removedIds, id];
    onUpdate({ removedSisuIds: newRemoved });
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
