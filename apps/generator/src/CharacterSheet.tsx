import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ActiveStatBlock } from "@repo/ui/components/ActiveStatBlock";
import { DicePoolAllocator } from "@repo/ui/components/DicePoolAllocator";
import { Button } from "@repo/ui/components/Button";
import { Heading } from "@repo/ui/components/Heading";

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
    sisuDie: "d4" | "d6" | "d8" | "d10" | "d12";
    sisuCount: number;
    currentSisuCount: number;
    vaurio: number;
    skills: string[];
}

export function CharacterSheet({ characterId, onBack }: { characterId: number, onBack: () => void }) {
    const queryClient = useQueryClient();

    const { data: character, isLoading } = useQuery<Character>({
        queryKey: ["character", characterId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/characters/${characterId}`);
            if (!res.ok) throw new Error("Character fetch failed");
            return res.json();
        }
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
            queryClient.setQueryData(["character", characterId], (old: any) => ({ ...old, ...newUpdates }));
            return { previous };
        },
        onError: (_err, _newUpdates, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["character", characterId], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["character", characterId] });
        }
    });

    if (isLoading || !character) {
        return <div className="p-8 text-primary animate-pulse uppercase tracking-widest font-black text-2xl">Ladataan hahmoa...</div>;
    }

    // PRD logic for dice limit
    const baseDice = 5;
    const maxDice = Math.max(0, baseDice - character.vaurio);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center border-b-4 border-primary pb-6 bg-secondary/10 p-6 shadow-[inset_0_0_20px_rgba(201,42,42,0.1)]">
                <div>
                    <Button variant="secondary" onClick={onBack} className="mb-4 flex items-center gap-2 w-fit">
                        <span className="text-xl">◀</span> Paluu listaan
                    </Button>
                    <div className="drop-shadow-md pb-2">
                        <Heading variant="h1">{character.name}</Heading>
                    </div>
                    <p className="text-text/90 text-xl uppercase tracking-widest font-bold mt-2">
                        {character.archetype === "soldier" ? "Sotilas" : "Ekspertti"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="border-b-2 border-secondary/30 pb-3">
                        <Heading variant="h4">Resurssit</Heading>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Sisu (Grit) takes hits before Kesto/Vaurio */}
                        <ActiveStatBlock
                            label={`Sisu (${character.sisuCount}x${character.sisuDie})`}
                            value={character.currentSisuCount}
                            maxValue={character.sisuCount}
                            onIncrement={() => updateCharacter({ currentSisuCount: character.currentSisuCount + 1 })}
                            onDecrement={() => updateCharacter({ currentSisuCount: character.currentSisuCount - 1 })}
                            className="col-span-2 border-secondary border-2 rounded-none bg-secondary/10"
                        />

                        {/* Vaurio permanently reduces dice pool */}
                        <ActiveStatBlock
                            label="Vaurio"
                            value={character.vaurio}
                            maxAllowed={5}
                            onIncrement={() => updateCharacter({ vaurio: character.vaurio + 1 })}
                            onDecrement={() => updateCharacter({ vaurio: character.vaurio - 1 })}
                            className="col-span-2 border-primary border-2 rounded-none bg-primary/20 text-primary"
                        />
                    </div>

                    <div className="border-b-2 border-secondary/30 pb-3 mt-10">
                        <Heading variant="h4">Kestot (Durations)</Heading>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
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
                    <div className="border-b-2 border-accent/30 pb-3">
                        <Heading variant="h3">Nopat & Toiminta</Heading>
                    </div>
                    <p className="text-text/80 text-lg leading-relaxed bg-accent/10 p-4 border-l-4 border-accent">
                        Sinulla on <strong className="text-accent font-black text-xl">{baseDice}d20</strong> oletuksena. <br />
                        Olet ottanut <strong className="text-primary font-bold">{character.vaurio} Vauriota</strong>, joten noppapoolisi koko on <strong className="text-primary font-black text-2xl">{maxDice}</strong>.
                    </p>

                    <DicePoolAllocator
                        maxDice={maxDice}
                        axes={["Nopea", "Äänetön", "Tarkka"]}
                        attributeDie="d4" // For now hardcoded to demonstrate UI functionality
                    />

                    {/* Dummy Roll Action Button */}
                    <Button size="lg" className="mt-6">
                        Heitä Nopat
                    </Button>
                </div>
            </div>
        </div>
    );
}
