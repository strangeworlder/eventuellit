import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/components/Card";
import { Button } from "@repo/ui/components/Button";
import { Input } from "@repo/ui/components/Input";
import { StatBlock } from "@repo/ui/components/StatBlock";
import { DiceRoller } from "@repo/ui/components/DiceRoller";
import { useCreateCharacter } from "./api/characters";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Heading } from "@repo/ui/components/Heading";
import { CharacterSheet } from "./CharacterSheet";

const queryClient = new QueryClient();

function GeneratorForm() {
  const { mutate: createCharacter, isPending, isSuccess } = useCreateCharacter();

  const [characterName, setCharacterName] = useState("");
  const [archetype, setArchetype] = useState<"soldier" | "expert">("soldier");

  // Base Durations (Kesto) are 8. Sub-attributes start at 0 (representing no extra d4s).
  const [fysiikka, setFysiikka] = useState(0);
  const [nopeus, setNopeus] = useState(0);
  const [ymmarrys, setYmmarrys] = useState(0);
  const [persoona, setPersoona] = useState(0);
  const [nakemys, setNakemys] = useState(0);
  const [napparyys, setNapparyys] = useState(0);

  // Math logic: Base 8 + (+2 per assigned d4 in the category)
  const kehoScore = 8 + (fysiikka * 2) + (nopeus * 2);
  const mieliScore = 8 + (ymmarrys * 2) + (persoona * 2);
  const teraScore = 8 + (nakemys * 2) + (napparyys * 2);

  const totalDiceAssigned = fysiikka + nopeus + ymmarrys + persoona + nakemys + napparyys;
  const diceRemaining = 2 - totalDiceAssigned;

  const handleAssignDie = (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => {
    if (diceRemaining > 0) setter(current + 1);
  };
  const handleRemoveDie = (setter: React.Dispatch<React.SetStateAction<number>>, current: number) => {
    if (current > 0) setter(current - 1);
  };

  const handleSave = () => {
    if (characterName.trim() === "" || diceRemaining > 0) return;

    createCharacter({
      name: characterName,
      archetype,
      keho: kehoScore,
      mieli: mieliScore,
      tera: teraScore,
      sisuCount: 3,
      sisuDie: archetype === "soldier" ? "d8" : "d6",
      skills: [], // We'll add dynamic episode skills later
    });
  };

  if (isSuccess) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Card variant="success">
          <CardHeader>
            <CardTitle variant="secondary">Hahmo Luotu Onnistuneesti!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text/80 text-lg">Hahmosi tallennettiin tietokantaan.</p>
            <Button className="mt-6" onClick={() => window.location.reload()}>Tee uusi hahmo</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Uusi Hahmo</CardTitle>
        </CardHeader>
        <CardContent variant="default">
          <Input
            label="Hahmon Nimi"
            placeholder="Syötä nimi..."
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />

          <div className="space-y-6">
            <div className="border-b-2 border-primary/20 pb-2">
              <Heading variant="h2">Arkkityyppi</Heading>
            </div>
            <div className="flex gap-4">
              <Button
                variant={archetype === "soldier" ? "primary" : "secondary"}
                onClick={() => setArchetype("soldier")}
              >
                Sotilas (Sisu: 3d8, Taidot: 2)
              </Button>
              <Button
                variant={archetype === "expert" ? "primary" : "secondary"}
                onClick={() => setArchetype("expert")}
              >
                Ekspertti (Sisu: 3d6, Taidot: 3)
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Heading variant="h4">Ominaisuudet (Kestot)</Heading>
              <span className="text-slate-400 font-mono">Noppia jäljellä: {diceRemaining}x 1d4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="subtle">
                <CardContent variant="dense">
                  <StatBlock label="Keho (Kesto)" value={kehoScore} className="bg-secondary/10 border-secondary/30" />
                  <div className="flex justify-between items-center text-sm px-2">
                    <span className="font-bold text-text/80">Fysiikka (d4: {fysiikka})</span>
                    <div className="flex gap-2">
                      <Button variant="primary" size="icon" onClick={() => handleRemoveDie(setFysiikka, fysiikka)}>-</Button>
                      <Button variant="secondary" size="icon" onClick={() => handleAssignDie(setFysiikka, fysiikka)}>+</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm px-2">
                    <span className="font-bold text-text/80">Nopeus (d4: {nopeus})</span>
                    <div className="flex gap-2">
                      <Button variant="primary" size="icon" onClick={() => handleRemoveDie(setNopeus, nopeus)}>-</Button>
                      <Button variant="secondary" size="icon" onClick={() => handleAssignDie(setNopeus, nopeus)}>+</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="subtle">
                <CardContent variant="dense">
                  <StatBlock label="Mieli (Kesto)" value={mieliScore} className="bg-secondary/10 border-secondary/30" />
                  <div className="flex justify-between items-center text-sm px-2">
                    <span className="font-bold text-text/80">Ymmärrys (d4: {ymmarrys})</span>
                    <div className="flex gap-2">
                      <Button variant="primary" size="icon" onClick={() => handleRemoveDie(setYmmarrys, ymmarrys)}>-</Button>
                      <Button variant="secondary" size="icon" onClick={() => handleAssignDie(setYmmarrys, ymmarrys)}>+</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm px-2">
                    <span className="font-bold text-text/80">Persoona (d4: {persoona})</span>
                    <div className="flex gap-2">
                      <Button variant="primary" size="icon" onClick={() => handleRemoveDie(setPersoona, persoona)}>-</Button>
                      <Button variant="secondary" size="icon" onClick={() => handleAssignDie(setPersoona, persoona)}>+</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="subtle">
                <CardContent variant="dense">
                  <StatBlock label="Terä (Kesto)" value={teraScore} className="bg-secondary/10 border-secondary/30" />
                  <div className="flex justify-between items-center text-sm px-2">
                    <span className="font-bold text-text/80">Näkemys (d4: {nakemys})</span>
                    <div className="flex gap-2">
                      <Button variant="primary" size="icon" onClick={() => handleRemoveDie(setNakemys, nakemys)}>-</Button>
                      <Button variant="secondary" size="icon" onClick={() => handleAssignDie(setNakemys, nakemys)}>+</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm px-2">
                    <span className="font-bold text-text/80">Näppäryys (d4: {napparyys})</span>
                    <div className="flex gap-2">
                      <Button variant="primary" size="icon" onClick={() => handleRemoveDie(setNapparyys, napparyys)}>-</Button>
                      <Button variant="secondary" size="icon" onClick={() => handleAssignDie(setNapparyys, napparyys)}>+</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DiceRoller />

          <Button
            size="lg"
            className="mt-8"
            onClick={handleSave}
            disabled={isPending || characterName.trim() === "" || diceRemaining > 0}
          >
            {isPending ? "Tallennetaan..." : "Tallenna Hahmo"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InnerApp() {
  const [view, setView] = useState<"list" | "generator" | "sheet">("list");
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

  // Quick helper to fetch character list
  const { data: characters, isLoading } = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/characters");
      if (!res.ok) throw new Error("Failed to fetch characters");
      return res.json();
    }
  });

  return (
    <div className="space-y-6">
      {/* Navigation / Header */}
      <div className="flex gap-4 border-b-2 border-primary/30 pb-4">
        <Button
          variant={view === "list" ? "primary" : "ghost"}
          onClick={() => setView("list")}
        >
          Hahmoluettelo
        </Button>
        <Button
          variant={view === "generator" ? "primary" : "ghost"}
          onClick={() => setView("generator")}
        >
          Uusi Hahmo
        </Button>
      </div>

      {/* Views */}
      {view === "generator" && <GeneratorForm />}

      {view === "sheet" && selectedCharacterId && (
        <CharacterSheet characterId={selectedCharacterId} onBack={() => setView("list")} />
      )}

      {view === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          {isLoading && <p className="text-primary animate-pulse uppercase tracking-widest font-bold">Ladataan hahmoja...</p>}

          {!isLoading && characters?.length === 0 && (
            <div className="col-span-full text-center py-12 text-text/60">
              <p className="text-xl">Ei hahmoja vielä.</p>
              <Button className="mt-6 rounded-none font-bold uppercase tracking-wide shadow-md" onClick={() => setView("generator")}>Luo ensimmäinen hahmosi</Button>
            </div>
          )}

          {!isLoading && characters?.map((char: any) => (
            <Card key={char.id} className="hover:bg-secondary/5 cursor-pointer hover:shadow-[4px_4px_0px_rgba(201,42,42,1)] transition-all transform hover:-translate-y-1" onClick={() => { setSelectedCharacterId(char.id); setView("sheet"); }}>
              <CardHeader>
                <CardTitle>{char.name}</CardTitle>
              </CardHeader>
              <CardContent variant="dense">
                <p className="text-secondary font-bold uppercase tracking-widest text-sm border-b border-secondary/20 pb-2">{char.archetype}</p>
                <div className="flex justify-between items-center bg-background rounded-none p-3 border border-primary/10 shadow-inner">
                  <span className="text-primary font-black uppercase tracking-wider text-xs">Vaurio: {char.vaurio}</span>
                  <span className="text-text font-bold uppercase tracking-wider text-xs">Sisu: {char.currentSisuCount}x{char.sisuDie}</span>
                </div>
                <Button className="w-full mt-4" variant="secondary">Avaa Pelinäkymä</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// This replaces the old App function
export default function App() {
  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8">
      <QueryClientProvider client={queryClient}>
        <div className="max-w-5xl mx-auto space-y-8">
          <InnerApp />
        </div>
      </QueryClientProvider>
    </div>
  );
}
