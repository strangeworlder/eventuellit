import { ActiveStatBlock } from "@repo/ui/components/ActiveStatBlock";
import { Button } from "@repo/ui/components/Button";
import { DicePoolAllocator } from "@repo/ui/components/DicePoolAllocator";
import { GameTerm } from "@repo/ui/components/GameTerm";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { useAuth } from "@repo/auth/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "./api/base-url";

interface Character {
  id: number;
  userId: number;
  name: string;
  archetype: "soldier" | "expert";
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
  skills: string[];
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
  const navigate = useNavigate();
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
  const canSeePrivate = canEdit;

  // When canEdit is false, lock min/max to current value so controls are visually disabled
  const lockIfReadOnly = (current: number) => ({
    minAllowed: canEdit ? 0 : current,
    maxAllowed: canEdit ? undefined : current,
  });

  const baseDice = 5;
  const maxDice = Math.max(0, baseDice - character.vaurio);

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

        <HeadingLevelProvider>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 mt-8">
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
                    variant="secondary"
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

            {/* Right Column: Dice Play Area — private to owner and GM */}
            {canSeePrivate && (
              <div className="space-y-6">
                <Heading>Nopat & Toiminta</Heading>
                <NoticePanel variant="info" title="Nopat ja toiminta" className="mt-4">
                  <p className="text-lg leading-relaxed">
                    Sinulla on <GameTerm variant="accent" className="font-black text-xl">{baseDice}n20</GameTerm>{" "}
                    oletuksena. Olet ottanut{" "}
                    <GameTerm variant="primary" className="font-bold">{character.vaurio} vauriota</GameTerm>,
                    joten noppapoolisi koko on{" "}
                    <GameTerm variant="primary" className="font-black text-2xl">{maxDice}</GameTerm>.
                  </p>
                </NoticePanel>

                <DicePoolAllocator
                  maxDice={maxDice}
                  axes={["Nopea", "Äänetön", "Tarkka"]}
                  attributeDie="n4"
                />

                <Button size="lg" className="mt-6">
                  Heitä Nopat
                </Button>
              </div>
            )}
          </div>
        </HeadingLevelProvider>
      </div>
    </HeadingLevelProvider>
  );
}
