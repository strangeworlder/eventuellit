import { AttributeCard, getScoreBonusFromValue } from "@repo/ui/components/AttributeCard";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { DiceIcon } from "@repo/ui/components/DiceIcon";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/RadioGroup";
import { TextArea } from "@repo/ui/components/TextArea";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { ObscuredWrapper } from "@repo/ui/components/ObscuredWrapper";
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

const TAIDOT_COUNTS: Record<string, number> = {
  Sotilas: 2,
  Ekspertti: 3,
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
  const [archetype, setArchetype] = useState<string | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);
  const [sex, setSex] = useState("none");
  const [motivation, setMotivation] = useState("");
  const [notes, setNotes] = useState("");

  const taidotCount = archetype ? TAIDOT_COUNTS[archetype] : 0;
  const [selectedTaidot, setSelectedTaidot] = useState<Array<string | null>>(
    Array(TAIDOT_COUNTS["soldier"]).fill(null),
  );
  const [customSkillText, setCustomSkillText] = useState("");

  const handleArchetypeChange = (a: string) => {
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

  // ── Step progression gates ──
  const episodeSelected = selectedEpisodeId !== null;
  const archetypeSelected = archetype !== null;
  const nameEntered = characterName.trim() !== "";
  const sexStepReached = nameEntered; // sex is optional, reaching it is enough
  const diceAssigned = diceRemaining === 0;
  const skillsFilled = taidotFilled && archetypeSelected;

  const canSubmit =
    characterName.trim() !== "" &&
    diceRemaining === 0 &&
    selectedEpisodeId !== null &&
    archetypeSelected &&
    taidotFilled;

  const handleSave = () => {
    if (!canSubmit || !selectedEpisodeId || !archetype) return;
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
      sisuDie: archetype === "Sotilas" ? "n8" : "n6",
      skills: buildSkills(),
      fysiikka,
      nopeus,
      ymmarrys,
      persoona,
      nakemys,
      napparyys,
    });
  };

  const handleReset = () => {
    reset();
    setCharacterName("");
    setArchetype(null);
    setSelectedEpisodeId(null);
    setSex("none");
    setMotivation("");
    setNotes("");
    setSelectedTaidot(Array(TAIDOT_COUNTS["Sotilas"]).fill(null));
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
            {/* ── Step 1: Episode ── */}
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
                        setSelectedTaidot(Array(taidotCount || TAIDOT_COUNTS["Sotilas"]).fill(null));
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

            {/* ── Step 2: Archetype ── */}
            <ObscuredWrapper revealed={episodeSelected}>
              <RadioGroup
                name="archetype"
                label="Arkkityyppi"
                value={archetype ?? undefined}
                onValueChange={(v) => handleArchetypeChange(v)}
              >
                <RadioGroupItem value="Munkki" label="Munkki" description="Sisu: 3n4, Taidot: 2" obscured />
                <RadioGroupItem value="Ekspertti" label="Ekspertti" description="Sisu: 3n6, Taidot: 3" />
                <RadioGroupItem value="Sotilas" label="Sotilas" description="Sisu: 3n8, Taidot: 2" />
              </RadioGroup>
            </ObscuredWrapper>

            {/* ── Step 3: Name ── */}
            <ObscuredWrapper revealed={archetypeSelected}>
              <Input
                label="Hahmon Nimi"
                placeholder="Syötä nimi..."
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </ObscuredWrapper>

            {/* ── Step 4: Sex ── */}
            <ObscuredWrapper revealed={nameEntered}>
              <RadioGroup
                name="sex"
                label="Sukupuoli"
                orientation="horizontal"
                value={sex || undefined}
                onValueChange={(v) => setSex(v)}
              >
                {SEX_OPTIONS.map((opt) => (
                  <RadioGroupItem key={opt.value} value={opt.value} label={opt.label} />
                ))}
              </RadioGroup>
            </ObscuredWrapper>

            {/* ── Step 5: Attributes ── */}
            <ObscuredWrapper revealed={sexStepReached}>
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
            </ObscuredWrapper>

            {/* ── Step 6: Taidot ── */}
            <ObscuredWrapper revealed={diceAssigned}>
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
            </ObscuredWrapper>

            {/* ── Step 7: Motivation (optional) ── */}
            <ObscuredWrapper revealed={skillsFilled}>
              <div className="space-y-2">
                <div className="border-b-2 border-primary/20 pb-2">
                  <Heading>Motivaatio (valinnainen)</Heading>
                </div>
                <TextArea
                  className="h-20"
                  placeholder="Mikä ajaa hahmoasi eteenpäin?"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                />
              </div>
            </ObscuredWrapper>

            {/* ── Step 8: Notes (optional) ── */}
            <ObscuredWrapper revealed={skillsFilled}>
              <div className="space-y-2">
                <div className="border-b-2 border-primary/20 pb-2">
                  <Heading>Muistiinpanot (valinnainen)</Heading>
                </div>
                <TextArea
                  className="h-20"
                  placeholder="Lisätietoja hahmostasi..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </ObscuredWrapper>

            <ObscuredWrapper revealed={skillsFilled}>
              <Button size="lg" onClick={handleSave} loading={isPending} disabled={!canSubmit}>
                {isPending ? "Tallennetaan..." : "Tallenna Hahmo"}
              </Button>
            </ObscuredWrapper>
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
                        characters?.map((char: any) => {
                          const activeHarmit = (char.harmit ?? []).filter((h: { healed: boolean }) => !h.healed).length;
                          const archetypeLabel = char.archetype;
                          const isOwn = user && char.userId === user.id;

                          return (
                            <Card
                              key={char.id}
                              variant="interactive"
                              onClick={() => navigate(`${basePath}/character/${char.id}`)}
                            >
                              <CardHeader>
                                <CardTitle>{char.name}</CardTitle>
                                <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-secondary)]">
                                  {archetypeLabel}
                                </p>
                              </CardHeader>
                              <CardContent variant="dense">
                                <div className="flex flex-col gap-3 w-full">
                                  {char.episodeTitle && (
                                    <p className="text-xs text-[var(--theme-text)]/60">
                                      Jakso: <span className="text-[var(--theme-text)]/80 font-medium">{char.episodeTitle}</span>
                                    </p>
                                  )}
                                  <div className="flex justify-between items-center w-full text-sm">
                                    <span className="text-[var(--theme-text)]/70">
                                      Harmit: <span className={activeHarmit > 0 ? "font-bold text-[var(--theme-primary)]" : "font-medium text-[var(--theme-text)]/80"}>{activeHarmit} / 5</span>
                                    </span>
                                    <span className="text-[var(--theme-text)]/70 inline-flex items-center gap-1.5">
                                      Sisu: <span className="font-medium text-[var(--theme-text)]/80">{char.currentSisuCount}</span>
                                      <DiceIcon faces={Number.parseInt(char.sisuDie.replace("n", ""), 10) as 4 | 6 | 8 | 10 | 12 | 20} size="sm" />
                                    </span>
                                  </div>
                                  {char.ownerName && (
                                    <p className="text-xs text-[var(--theme-text)]/50 border-t border-[var(--theme-text)]/10 pt-2 mt-1">
                                      Pelaaja: {char.ownerName}
                                      {isOwn && (
                                        <span className="ml-2 text-[10px] font-black tracking-widest text-[var(--theme-secondary)] uppercase">
                                          sinun
                                        </span>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
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
