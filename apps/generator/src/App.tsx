import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { DiceRoller } from "@repo/ui/components/DiceRoller";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { Page } from "@repo/ui/components/Page";
import { StatBlock } from "@repo/ui/components/StatBlock";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Routes, Route, Navigate, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "@repo/ui/components/Button";
import { useCreateCharacter } from "./api/characters";
import { CharacterSheet } from "./CharacterSheet";

const queryClient = new QueryClient();

function GeneratorForm() {
  const { mutate: createCharacter, isPending, isSuccess, reset } = useCreateCharacter();
  const navigate = useNavigate();

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
  const kehoScore = 8 + fysiikka * 2 + nopeus * 2;
  const mieliScore = 8 + ymmarrys * 2 + persoona * 2;
  const teraScore = 8 + nakemys * 2 + napparyys * 2;

  const totalDiceAssigned = fysiikka + nopeus + ymmarrys + persoona + nakemys + napparyys;
  const diceRemaining = 2 - totalDiceAssigned;

  const handleAssignDie = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number,
  ) => {
    if (diceRemaining > 0) setter(current + 1);
  };
  const handleRemoveDie = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number,
  ) => {
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
      sisuDie: archetype === "soldier" ? "n8" : "n6",
      skills: [], // We'll add dynamic episode skills later
    });
  };

  const handleReset = () => {
    reset();
    setCharacterName("");
    setArchetype("soldier");
    setFysiikka(0);
    setNopeus(0);
    setYmmarrys(0);
    setPersoona(0);
    setNakemys(0);
    setNapparyys(0);
  };

  if (isSuccess) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="border-2 border-[var(--theme-secondary)]/50 bg-[var(--theme-secondary)]/5 shadow-[0_0_15px_color-mix(in_srgb,var(--theme-secondary)_20%,transparent)] p-8 rounded-sm text-[var(--theme-text)]">
          <HeadingLevelProvider>
            <Heading data-theme="secondary" className="mb-4">
              Hahmo Luotu Onnistuneesti!
            </Heading>
            <p className="text-text/80 text-lg">Hahmosi tallennettiin tietokantaan.</p>
            <div className="flex gap-4 mt-6">
              <Button onClick={() => navigate("../list")}>
                Palaa listaan
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                Tee uusi hahmo
              </Button>
            </div>
          </HeadingLevelProvider>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <HeadingLevelProvider>
        <Hero title="Uusi Hahmo" />

        <HeadingLevelProvider>
          <div className="flex flex-col gap-8">
            <Input
              label="Hahmon Nimi"
              placeholder="Syötä nimi..."
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />

            <div className="space-y-6">
              <div className="border-b-2 border-primary/20 pb-2">
                <Heading>Arkkityyppi</Heading>
              </div>
              <div className="flex gap-4">
                <Button
                  variant={archetype === "soldier" ? "primary" : "secondary"}
                  onClick={() => setArchetype("soldier")}
                >
                  Sotilas (Sisu: 3n8, Taidot: 2)
                </Button>
                <Button
                  variant={archetype === "expert" ? "primary" : "secondary"}
                  onClick={() => setArchetype("expert")}
                >
                  Ekspertti (Sisu: 3n6, Taidot: 3)
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <Heading>Ominaisuudet (Kestot)</Heading>
                <span className="text-slate-400 font-mono">
                  Noppia jäljellä: {diceRemaining}x 1d4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="subtle">
                  <CardContent variant="dense">
                    <StatBlock theme="inverted" label="Keho (Kesto)" value={kehoScore} />
                    <div className="flex justify-between items-center text-sm px-2">
                      <span className="font-bold text-text/80">Fysiikka (d4: {fysiikka})</span>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="icon"
                          onClick={() => handleRemoveDie(setFysiikka, fysiikka)}
                        >
                          -
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleAssignDie(setFysiikka, fysiikka)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm px-2">
                      <span className="font-bold text-text/80">Nopeus (d4: {nopeus})</span>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="icon"
                          onClick={() => handleRemoveDie(setNopeus, nopeus)}
                        >
                          -
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleAssignDie(setNopeus, nopeus)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="subtle">
                  <CardContent variant="dense">
                    <StatBlock theme="secondary-light" label="Mieli (Kesto)" value={mieliScore} />
                    <div className="flex justify-between items-center text-sm px-2">
                      <span className="font-bold text-text/80">Ymmärrys (d4: {ymmarrys})</span>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="icon"
                          onClick={() => handleRemoveDie(setYmmarrys, ymmarrys)}
                        >
                          -
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleAssignDie(setYmmarrys, ymmarrys)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm px-2">
                      <span className="font-bold text-text/80">Persoona (d4: {persoona})</span>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="icon"
                          onClick={() => handleRemoveDie(setPersoona, persoona)}
                        >
                          -
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleAssignDie(setPersoona, persoona)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="subtle">
                  <CardContent variant="dense">
                    <StatBlock theme="secondary-light" label="Terä (Kesto)" value={teraScore} />
                    <div className="flex justify-between items-center text-sm px-2">
                      <span className="font-bold text-text/80">Näkemys (d4: {nakemys})</span>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="icon"
                          onClick={() => handleRemoveDie(setNakemys, nakemys)}
                        >
                          -
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleAssignDie(setNakemys, nakemys)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm px-2">
                      <span className="font-bold text-text/80">Näppäryys (d4: {napparyys})</span>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="icon"
                          onClick={() => handleRemoveDie(setNapparyys, napparyys)}
                        >
                          -
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleAssignDie(setNapparyys, napparyys)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DiceRoller />

            <Button
              size="lg"
              className="mt-8 self-start"
              onClick={handleSave}
              disabled={isPending || characterName.trim() === "" || diceRemaining > 0}
            >
              {isPending ? "Tallennetaan..." : "Tallenna Hahmo"}
            </Button>
          </div>
        </HeadingLevelProvider>
      </HeadingLevelProvider>
    </div>
  );
}

function CharacterSheetRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) return <div>Virheellinen id</div>;

  return <CharacterSheet characterId={Number(id)} onBack={() => navigate("../list")} />;
}

function InnerApp() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Dynamically determine the correct base path for absolute routing to avoid nesting issues
  const getBasePath = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return '';
    // If the first segment is an internal page, we are mounted at root
    if (['list', 'new', 'character'].includes(segments[0])) return '';
    // Otherwise, use the first segment as the mount point (e.g. "/generator")
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();

  // Quick helper to fetch character list
  const { data: characters, isLoading } = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/characters");
      if (!res.ok) throw new Error("Failed to fetch characters");
      return res.json();
    },
  });

  const tabClass = (isActive: boolean) => cn(
    "relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm sm:text-base font-bold uppercase tracking-widest transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "rounded-t-md",
    "mb-[-2px]", // Overlap the bottom border of the list
    isActive
      ? "bg-[var(--theme-bg)] text-[var(--theme-primary)] z-10 border-2 border-b-[var(--theme-text)] font-bold"
      : "border-2 border-transparent bg-transparent text-[var(--theme-text)] hover:bg-[var(--theme-primary)]/15 hover:text-[var(--theme-text)] font-semibold"
  );

  return (
    <Page>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex flex-wrap items-end border-b-2 border-[var(--theme-primary)] gap-1 px-4 sm:px-0"
      >
        <NavLink
          to={`${basePath}/list`}
          className={({ isActive }) => tabClass(isActive)}
        >
          Hahmoluettelo
        </NavLink>
        <NavLink
          to={`${basePath}/new`}
          className={({ isActive }) => tabClass(isActive)}
        >
          Uusi Hahmo
        </NavLink>
      </div>

      <div className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] animate-in fade-in duration-300 pt-8">
        <Routes>
          <Route path="/" element={<Navigate to="list" replace />} />

          <Route path="list" element={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {isLoading && (
                <p className="text-primary animate-pulse uppercase tracking-widest font-bold">
                  Ladataan hahmoja...
                </p>
              )}

              {!isLoading && characters?.length === 0 && (
                <div className="col-span-full text-center py-12 text-text/60">
                  <p className="text-xl">Ei hahmoja vielä.</p>
                  <Button
                    className="mt-6 rounded-none font-bold uppercase tracking-wide shadow-md"
                    onClick={() => navigate(`${basePath}/new`)}
                  >
                    Luo ensimmäinen hahmosi
                  </Button>
                </div>
              )}

              {!isLoading &&
                characters?.map((char: any) => (
                  <Card
                    key={char.id}
                    className="hover:bg-secondary/5 cursor-pointer hover:shadow-[4px_4px_0px_rgba(201,42,42,1)] transition-all transform hover:-translate-y-1"
                    onClick={() => navigate(`${basePath}/character/${char.id}`)}
                  >
                    <CardHeader>
                      <CardTitle>{char.name}</CardTitle>
                    </CardHeader>
                    <CardContent variant="dense">
                      <div className="flex flex-col gap-2 w-full">
                        <p className="font-bold text-[var(--theme-accent)] uppercase">
                          {char.archetype}
                        </p>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-left">Vaurio: {char.vaurio}</p>
                          <p className="text-right">
                            Sisu: {char.currentSisuCount} x {char.sisuDie}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          } />

          <Route path="new" element={<GeneratorForm />} />

          <Route path="character/:id" element={<CharacterSheetRoute />} />
        </Routes>
      </div>
    </Page>
  );
}

// This replaces the old App function
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  );
}
