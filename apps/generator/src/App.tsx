import { AttributeCard, getScoreBonusFromValue } from "@repo/ui/components/AttributeCard";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page } from "@repo/ui/components/Page";
import { Tabs, TabsList, TabsLink } from "@repo/ui/components/Tabs";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams, useMatch } from "react-router-dom";
import { apiBaseUrl } from "./api/base-url";
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

  // Math logic: Base 8 + bonus based on assigned dice
  const kehoScore = 8 + getScoreBonusFromValue(fysiikka) + getScoreBonusFromValue(nopeus);
  const mieliScore = 8 + getScoreBonusFromValue(ymmarrys) + getScoreBonusFromValue(persoona);
  const teraScore = 8 + getScoreBonusFromValue(nakemys) + getScoreBonusFromValue(napparyys);

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
        <NoticePanel
          variant="success"
          title="Hahmo luotu onnistuneesti!"
          actions={(
            <>
              <Button onClick={() => navigate("../list")}>
                Palaa listaan
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                Tee uusi hahmo
              </Button>
            </>
          )}
        >
          <p className="text-lg">Hahmosi tallennettiin tietokantaan.</p>
        </NoticePanel>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <HeadingLevelProvider>
        <Hero title="Uusi Hahmo" />

        <HeadingLevelProvider>
          <div className="flex flex-col gap-8 px-4">
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

              <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
                <AttributeCard
                  label="Keho"
                  score={kehoScore}
                  subAttributes={[
                    {
                      name: "Fysiikka",
                      label: "Fysiikka",
                      value: fysiikka,
                      onAdd: () => handleAssignDie(setFysiikka, fysiikka),
                      onRemove: () => handleRemoveDie(setFysiikka, fysiikka),
                      canAdd: diceRemaining > 0,
                      canRemove: fysiikka > 0,
                    },
                    {
                      name: "Nopeus",
                      label: "Nopeus",
                      value: nopeus,
                      onAdd: () => handleAssignDie(setNopeus, nopeus),
                      onRemove: () => handleRemoveDie(setNopeus, nopeus),
                      canAdd: diceRemaining > 0,
                      canRemove: nopeus > 0,
                    },
                  ]}
                />
                <AttributeCard
                  label="Mieli"
                  score={mieliScore}
                  subAttributes={[
                    {
                      name: "Ymmärrys",
                      label: "Ymmärrys",
                      value: ymmarrys,
                      onAdd: () => handleAssignDie(setYmmarrys, ymmarrys),
                      onRemove: () => handleRemoveDie(setYmmarrys, ymmarrys),
                      canAdd: diceRemaining > 0,
                      canRemove: ymmarrys > 0,
                    },
                    {
                      name: "Persoona",
                      label: "Persoona",
                      value: persoona,
                      onAdd: () => handleAssignDie(setPersoona, persoona),
                      onRemove: () => handleRemoveDie(setPersoona, persoona),
                      canAdd: diceRemaining > 0,
                      canRemove: persoona > 0,
                    },
                  ]}
                />
                <AttributeCard
                  label="Terä"
                  score={teraScore}
                  subAttributes={[
                    {
                      name: "Näkemys",
                      label: "Näkemys",
                      value: nakemys,
                      onAdd: () => handleAssignDie(setNakemys, nakemys),
                      onRemove: () => handleRemoveDie(setNakemys, nakemys),
                      canAdd: diceRemaining > 0,
                      canRemove: nakemys > 0,
                    },
                    {
                      name: "Näppäryys",
                      label: "Näppäryys",
                      value: napparyys,
                      onAdd: () => handleAssignDie(setNapparyys, napparyys),
                      onRemove: () => handleRemoveDie(setNapparyys, napparyys),
                      canAdd: diceRemaining > 0,
                      canRemove: napparyys > 0,
                    },
                  ]}
                />
              </div>
            </div>

            <Button
              size="lg"
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

  // Detect if we're currently on a character sheet page (handles both mounted-at-root and at /generator)
  const characterMatchAbsolute = useMatch(`${basePath}/character/:id`);
  const characterMatchRelative = useMatch(`character/:id`);
  const activeCharId = (characterMatchAbsolute ?? characterMatchRelative)?.params?.id;

  // Quick helper to fetch character list
  const { data: characters, isLoading } = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/characters`);
      if (!res.ok) throw new Error("Failed to fetch characters");
      return res.json();
    },
  });

  return (
    <Page>
      <Tabs>
        <TabsList>
          <TabsLink to={`${basePath}/list`}>Hahmoluettelo</TabsLink>
          <TabsLink to={`${basePath}/new`}>Uusi Hahmo</TabsLink>
          {activeCharId && (
            <TabsLink to={`${basePath}/character/${activeCharId}`}>Hahmosivu</TabsLink>
          )}
        </TabsList>
        <div className="animate-in fade-in duration-300">
          <Routes>
            <Route path="/" element={<Navigate to="list" replace />} />
            <Route path="list" element={
              <>
                <HeadingLevelProvider>
                  <Hero title="Hahmot" description="Hahmot" />

                  <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-8 animate-in fade-in duration-500">
                    {isLoading && (
                      <LoadingState message="Ladataan hahmoja..." />
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
                </HeadingLevelProvider>
              </>
            } />

            <Route path="new" element={<GeneratorForm />} />

            <Route path="character/:id" element={<CharacterSheetRoute />} />
          </Routes>
        </div>
      </Tabs>
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
