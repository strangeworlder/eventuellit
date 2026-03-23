import { AttributeCard, getScoreBonusFromValue } from "@repo/ui/components/AttributeCard";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { DiceIcon } from "@repo/ui/components/DiceIcon";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page } from "@repo/ui/components/Page";
import { Tabs, TabsList, TabsLink } from "@repo/ui/components/Tabs";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useMatch,
} from "react-router-dom";
import { apiBaseUrl } from "./api/base-url";
import { useCreateCharacter } from "./api/characters";
import { CharacterSheet } from "./CharacterSheet";
import { useAuth } from "@repo/auth/use-auth";
import { useActiveEpisodes, useEpisodeSkills } from "./api/episodes";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const TAIDOT_COUNTS: Record<"soldier" | "expert", number> = {
  soldier: 2,
  expert: 3,
};

const SEX_OPTIONS = [
  { value: "male", label: "Mies" },
  { value: "female", label: "Nainen" },
  { value: "non-binary", label: "Ei-binäärinen" },
  { value: "none", label: "Ei määritelty" },
];

function GeneratorForm() {
  const { mutate: createCharacter, isPending, isSuccess, reset } = useCreateCharacter();
  const navigate = useNavigate();

  const [characterName, setCharacterName] = useState("");
  const [archetype, setArchetype] = useState<"soldier" | "expert">("soldier");
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);
  const [sex, setSex] = useState("");
  const [motivation, setMotivation] = useState("");
  const [notes, setNotes] = useState("");

  const taidotCount = TAIDOT_COUNTS[archetype];
  const [selectedTaidot, setSelectedTaidot] = useState<Array<string | null>>(
    Array(TAIDOT_COUNTS["soldier"]).fill(null),
  );
  const [customSkillText, setCustomSkillText] = useState("");

  const handleArchetypeChange = (a: "soldier" | "expert") => {
    setArchetype(a);
    setSelectedTaidot(Array(TAIDOT_COUNTS[a]).fill(null));
    setCustomSkillText("");
  };

  const [fysiikka, setFysiikka] = useState(0);
  const [nopeus, setNopeus] = useState(0);
  const [ymmarrys, setYmmarrys] = useState(0);
  const [persoona, setPersoona] = useState(0);
  const [nakemys, setNakemys] = useState(0);
  const [napparyys, setNapparyys] = useState(0);

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

  const { data: activeEpisodes, isLoading: isEpisodesLoading } = useActiveEpisodes();
  const { data: episodeSkills, isLoading: isSkillsLoading } = useEpisodeSkills(
    selectedEpisodeId ?? undefined,
  );

  const handleTaidotSelect = (slotIndex: number, value: string | null) => {
    setSelectedTaidot((prev) => {
      const next = [...prev];
      next[slotIndex] = value;
      return next;
    });
    if (value !== "custom") setCustomSkillText("");
  };

  const hasCustomSlot = selectedTaidot.includes("custom");

  const buildSkills = () =>
    selectedTaidot
      .filter((s): s is string => s !== null)
      .map((s) => ({
        name: s === "custom" ? customSkillText.trim() : s,
        isCustom: s === "custom",
      }));

  const taidotFilled =
    selectedTaidot.every((s) => s !== null) &&
    (!hasCustomSlot || customSkillText.trim() !== "");

  const canSubmit =
    characterName.trim() !== "" &&
    diceRemaining === 0 &&
    selectedEpisodeId !== null &&
    taidotFilled;

  const handleSave = () => {
    if (!canSubmit || !selectedEpisodeId) return;
    createCharacter({
      name: characterName,
      archetype,
      episodeId: selectedEpisodeId,
      sex: sex || undefined,
      motivation: motivation || undefined,
      notes: notes || undefined,
      keho: kehoScore,
      mieli: mieliScore,
      tera: teraScore,
      sisuCount: 3,
      sisuDie: archetype === "soldier" ? "n8" : "n6",
      skills: buildSkills(),
    });
  };

  const handleReset = () => {
    reset();
    setCharacterName("");
    setArchetype("soldier");
    setSelectedEpisodeId(null);
    setSex("");
    setMotivation("");
    setNotes("");
    setSelectedTaidot(Array(TAIDOT_COUNTS["soldier"]).fill(null));
    setCustomSkillText("");
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
          actions={
            <>
              <Button onClick={() => navigate("../list")}>Palaa listaan</Button>
              <Button variant="secondary" onClick={handleReset}>
                Tee uusi hahmo
              </Button>
            </>
          }
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
            {/* ── Episode ── */}
            <div className="space-y-4">
              <div className="border-b-2 border-primary/20 pb-2">
                <Heading>Jakso</Heading>
              </div>
              {isEpisodesLoading ? (
                <LoadingState message="Ladataan jaksoja..." />
              ) : activeEpisodes && activeEpisodes.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {activeEpisodes.map((ep) => (
                    <Button
                      key={ep.id}
                      variant={selectedEpisodeId === ep.id ? "primary" : "secondary"}
                      onClick={() => {
                        setSelectedEpisodeId(ep.id);
                        setSelectedTaidot(Array(taidotCount).fill(null));
                        setCustomSkillText("");
                      }}
                    >
                      #{ep.order}: {ep.title}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-sm">
                  Ei aktiivisia jaksoja saatavilla.
                </p>
              )}
            </div>

            {/* ── Name ── */}
            <Input
              label="Hahmon Nimi"
              placeholder="Syötä nimi..."
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />

            {/* ── Sex ── */}
            <div className="space-y-3">
              <div className="border-b-2 border-primary/20 pb-2">
                <Heading>Sukupuoli</Heading>
              </div>
              <div className="flex flex-wrap gap-3">
                {SEX_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={sex === opt.value ? "primary" : "secondary"}
                    onClick={() => setSex(sex === opt.value ? "" : opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* ── Archetype ── */}
            <div className="space-y-4">
              <div className="border-b-2 border-primary/20 pb-2">
                <Heading>Arkkityyppi</Heading>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="obscured"
                  disabled
                >
                  Munkki (Sisu: 3n4, Taidot: 2)
                </Button>
                <Button
                  variant={archetype === "expert" ? "primary" : "secondary"}
                  onClick={() => handleArchetypeChange("expert")}
                >
                  Ekspertti (Sisu: 3n6, Taidot: 3)
                </Button>
                <Button
                  variant={archetype === "soldier" ? "primary" : "secondary"}
                  onClick={() => handleArchetypeChange("soldier")}
                >
                  Sotilas (Sisu: 3n8, Taidot: 2)
                </Button>
              </div>
            </div>

            {/* ── Attributes ── */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <Heading>Ominaisuudet (Kestot)</Heading>
                <div className="flex items-center gap-2 text-slate-400 font-mono">
                  <span>Noppia jäljellä:</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: diceRemaining }).map((_, i) => (
                      <DiceIcon key={i} faces={4} size="sm" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
                <AttributeCard
                  label="Keho"
                  score={kehoScore}
                  subAttributes={[
                    {
                      name: "Fysiikka", label: "Fysiikka", value: fysiikka,
                      onAdd: () => handleAssignDie(setFysiikka, fysiikka),
                      onRemove: () => handleRemoveDie(setFysiikka, fysiikka),
                      canAdd: diceRemaining > 0, canRemove: fysiikka > 0,
                    },
                    {
                      name: "Nopeus", label: "Nopeus", value: nopeus,
                      onAdd: () => handleAssignDie(setNopeus, nopeus),
                      onRemove: () => handleRemoveDie(setNopeus, nopeus),
                      canAdd: diceRemaining > 0, canRemove: nopeus > 0,
                    },
                  ]}
                />
                <AttributeCard
                  label="Mieli"
                  score={mieliScore}
                  subAttributes={[
                    {
                      name: "Ymmärrys", label: "Ymmärrys", value: ymmarrys,
                      onAdd: () => handleAssignDie(setYmmarrys, ymmarrys),
                      onRemove: () => handleRemoveDie(setYmmarrys, ymmarrys),
                      canAdd: diceRemaining > 0, canRemove: ymmarrys > 0,
                    },
                    {
                      name: "Persoona", label: "Persoona", value: persoona,
                      onAdd: () => handleAssignDie(setPersoona, persoona),
                      onRemove: () => handleRemoveDie(setPersoona, persoona),
                      canAdd: diceRemaining > 0, canRemove: persoona > 0,
                    },
                  ]}
                />
                <AttributeCard
                  label="Terä"
                  score={teraScore}
                  subAttributes={[
                    {
                      name: "Näkemys", label: "Näkemys", value: nakemys,
                      onAdd: () => handleAssignDie(setNakemys, nakemys),
                      onRemove: () => handleRemoveDie(setNakemys, nakemys),
                      canAdd: diceRemaining > 0, canRemove: nakemys > 0,
                    },
                    {
                      name: "Näppäryys", label: "Näppäryys", value: napparyys,
                      onAdd: () => handleAssignDie(setNapparyys, napparyys),
                      onRemove: () => handleRemoveDie(setNapparyys, napparyys),
                      canAdd: diceRemaining > 0, canRemove: napparyys > 0,
                    },
                  ]}
                />
              </div>
            </div>

            {/* ── Taidot ── */}
            <div className="space-y-4">
              <div className="border-b-2 border-primary/20 pb-2">
                <Heading>Taidot ({taidotCount} valittava)</Heading>
              </div>
              {!selectedEpisodeId ? (
                <p className="text-secondary text-sm">
                  Valitse ensin jakso nähdäksesi saatavilla olevat taidot.
                </p>
              ) : isSkillsLoading ? (
                <LoadingState message="Ladataan taitoja..." />
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: taidotCount }).map((_, slotIndex) => {
                    const slotValue = selectedTaidot[slotIndex];
                    const isCustomSlot = slotValue === "custom";
                    return (
                      <Card key={slotIndex} variant="secondary">
                        <CardHeader>
                          <CardTitle>Taito {slotIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {episodeSkills?.map((skill) => {
                              const selectedElsewhere = selectedTaidot.some(
                                (s, i) => i !== slotIndex && s === skill.name,
                              );
                              return (
                                <Button
                                  key={skill.id}
                                  size="sm"
                                  variant={slotValue === skill.name ? "primary" : "secondary"}
                                  disabled={selectedElsewhere}
                                  onClick={() =>
                                    handleTaidotSelect(
                                      slotIndex,
                                      slotValue === skill.name ? null : skill.name,
                                    )
                                  }
                                >
                                  {skill.name}
                                </Button>
                              );
                            })}
                            {(!hasCustomSlot || isCustomSlot) && (
                              <Button
                                size="sm"
                                variant={isCustomSlot ? "primary" : "secondary"}
                                onClick={() =>
                                  handleTaidotSelect(
                                    slotIndex,
                                    isCustomSlot ? null : "custom",
                                  )
                                }
                              >
                                Oma taito...
                              </Button>
                            )}
                          </div>
                          {isCustomSlot && (
                            <div className="mt-3">
                              <Input
                                label="Kirjoita oma taito"
                                placeholder="Esim. Hakkerointi"
                                value={customSkillText}
                                onChange={(e) => setCustomSkillText(e.target.value)}
                              />
                              <p className="text-xs text-secondary mt-1">
                                GM tarkastaa omat taidot.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Motivation ── */}
            <div className="space-y-2">
              <div className="border-b-2 border-primary/20 pb-2">
                <Heading>Motivaatio (valinnainen)</Heading>
              </div>
              <textarea
                className="w-full p-3 border rounded-md text-sm h-20 resize-none bg-transparent border-[var(--theme-secondary)]/30"
                placeholder="Mikä ajaa hahmoasi eteenpäin?"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              />
            </div>

            {/* ── Notes ── */}
            <div className="space-y-2">
              <div className="border-b-2 border-primary/20 pb-2">
                <Heading>Muistiinpanot (valinnainen)</Heading>
              </div>
              <textarea
                className="w-full p-3 border rounded-md text-sm h-20 resize-none bg-transparent border-[var(--theme-secondary)]/30"
                placeholder="Lisätietoja hahmostasi..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button size="lg" onClick={handleSave} loading={isPending} disabled={!canSubmit}>
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
  const { user } = useAuth();

  const getBasePath = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "";
    if (["list", "new", "character"].includes(segments[0])) return "";
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();

  const characterMatchAbsolute = useMatch(`${basePath}/character/:id`);
  const characterMatchRelative = useMatch(`character/:id`);
  const activeCharId = (characterMatchAbsolute ?? characterMatchRelative)?.params?.id;

  const { data: characters, isLoading } = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/characters`, {
        credentials: "include",
      });
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
            <Route
              path="list"
              element={
                <>
                  <HeadingLevelProvider>
                    <Hero title="Hahmot" description="Hahmot" />
                    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-8 animate-in fade-in duration-500">
                      {isLoading && <LoadingState message="Ladataan hahmoja..." />}
                      {!isLoading && characters?.length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <p className="text-secondary mb-4">Ei hahmoja vielä.</p>
                          <Button onClick={() => navigate(`${basePath}/new`)}>
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
                                {char.episodeTitle && (
                                  <p className="text-xs text-secondary">
                                    Jakso: {char.episodeTitle}
                                  </p>
                                )}
                                <div className="flex justify-between items-center w-full">
                                  <p className="text-left">Vaurio: {char.vaurio}</p>
                                  <p className="text-right">
                                    Sisu: {char.currentSisuCount} x {char.sisuDie}
                                  </p>
                                </div>
                                {char.ownerName && (
                                  <p className="text-sm text-secondary mt-1">
                                    Pelaaja: {char.ownerName}
                                    {user && char.userId === user.id && (
                                      <span className="ml-2 text-xs font-semibold text-[var(--theme-accent)] uppercase">
                                        (sinun)
                                      </span>
                                    )}
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </HeadingLevelProvider>
                </>
              }
            />
            <Route path="new" element={<GeneratorForm />} />
            <Route path="character/:id" element={<CharacterSheetRoute />} />
          </Routes>
        </div>
      </Tabs>
    </Page>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  );
}
