import { ActiveStatBlock } from "@repo/ui/components/ActiveStatBlock";
import { Button } from "@repo/ui/components/Button";
import { DicePoolAllocator } from "@repo/ui/components/DicePoolAllocator";
import { GameTerm } from "@repo/ui/components/GameTerm";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Character {
  id: number;
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
}

export function CharacterSheet({
  characterId,
  onBack: _onBack,
}: {
  characterId: number;
  onBack: () => void;
}) {
  const queryClient = useQueryClient();

  const { data: character, isLoading } = useQuery<Character>({
    queryKey: ["character", characterId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/characters/${characterId}`);
      if (!res.ok) throw new Error("Character fetch failed");
      return res.json();
    },
  });

  const { mutate: updateCharacter } = useMutation({
    mutationFn: async (updates: Partial<Character>) => {
      const res = await fetch(`http://localhost:3000/characters/${characterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onMutate: async (newUpdates) => {
      // Optimistic update for snappy UI
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

  if (isLoading || !character) {
    return (
      <div className="p-8 text-primary animate-pulse uppercase tracking-widest font-black text-2xl">
        Ladataan hahmoa...
      </div>
    );
  }

  // PRD logic for dice limit
  const baseDice = 5;
  const maxDice = Math.max(0, baseDice - character.vaurio);

  return (
    <HeadingLevelProvider>
      <div className="animate-in fade-in duration-500">
        <Hero
          title={character.name}
          description={character.archetype === "soldier" ? "Sotilas" : "Ekspertti"}
        />
        <HeadingLevelProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <Heading>Resurssit</Heading>

              <div className="grid grid-cols-2 gap-4 mt-4 mb-8">
                {/* Sisu (Grit) takes hits before Kesto/Vaurio */}
                <ActiveStatBlock
                  label={`Sisu (${character.sisuCount} x ${character.sisuDie})`}
                  value={character.currentSisuCount}
                  maxValue={character.sisuCount}
                  onIncrement={() =>
                    updateCharacter({ currentSisuCount: character.currentSisuCount + 1 })
                  }
                  onDecrement={() =>
                    updateCharacter({ currentSisuCount: character.currentSisuCount - 1 })
                  }
                  className="col-span-2"
                />

                {/* Vaurio permanently reduces dice pool */}
                <ActiveStatBlock
                  label="Vaurio"
                  value={character.vaurio}
                  maxAllowed={5}
                  onIncrement={() => updateCharacter({ vaurio: character.vaurio + 1 })}
                  onDecrement={() => updateCharacter({ vaurio: character.vaurio - 1 })}
                  className="col-span-2"
                />
              </div>

              <Heading>Kestot (Durations)</Heading>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <ActiveStatBlock
                  label="Keho"
                  value={character.currentKeho}
                  maxValue={character.keho}
                  onIncrement={() => updateCharacter({ currentKeho: character.currentKeho + 1 })}
                  onDecrement={() => updateCharacter({ currentKeho: character.currentKeho - 1 })}
                />
                <ActiveStatBlock
                  label="Mieli"
                  value={character.currentMieli}
                  maxValue={character.mieli}
                  onIncrement={() => updateCharacter({ currentMieli: character.currentMieli + 1 })}
                  onDecrement={() => updateCharacter({ currentMieli: character.currentMieli - 1 })}
                />
                <ActiveStatBlock
                  label="Terä"
                  value={character.currentTera}
                  maxValue={character.tera}
                  onIncrement={() => updateCharacter({ currentTera: character.currentTera + 1 })}
                  onDecrement={() => updateCharacter({ currentTera: character.currentTera - 1 })}
                />
              </div>
            </div>

            {/* Right Column: Dice Play Area */}
            <div className="space-y-6">
              <Heading>Nopat & Toiminta</Heading>
              <p className="text-text/80 text-lg leading-relaxed bg-accent/10 p-4 border-l-4 border-accent mt-4">
                Sinulla on <GameTerm variant="accent" className="font-black text-xl">{baseDice}n20</GameTerm>{" "}
                oletuksena. <br />
                Olet ottanut{" "}
                <GameTerm variant="primary" className="font-bold">{character.vaurio} Vauriota</GameTerm>,
                joten noppapoolisi koko on{" "}
                <GameTerm variant="primary" className="font-black text-2xl">{maxDice}</GameTerm>.
              </p>

              <DicePoolAllocator
                maxDice={maxDice}
                axes={["Nopea", "Äänetön", "Tarkka"]}
                attributeDie="n4" // For now hardcoded to demonstrate UI functionality
              />

              <Button size="lg" className="mt-6">
                Heitä Nopat
              </Button>
            </div>
          </div>
        </HeadingLevelProvider>
      </div>
    </HeadingLevelProvider>
  );
}
