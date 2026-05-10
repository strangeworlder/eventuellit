import { AccordionContent, AccordionItem, AccordionTrigger } from "@repo/ui/components/Accordion";
import { useAuth } from "@repo/auth/use-auth";
import { addN4, AttributeCard, getScoreBonusFromValue } from "@repo/ui/components/AttributeCard";
import { Badge } from "@repo/ui/components/Badge";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Checkbox } from "@repo/ui/components/Checkbox";
import { DiceIcon } from "@repo/ui/components/DiceIcon";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { Link } from "@repo/ui/components/Link";
import { List, ListItem } from "@repo/ui/components/List";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { ObscuredWrapper } from "@repo/ui/components/ObscuredWrapper";
import { PageBody } from "@repo/ui/components/Page";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/RadioGroup";
import { SkillMasonry } from "@repo/ui/components/SkillMasonry";
import { Text } from "@repo/ui/components/Text";
import { useMemo, useState } from "react";
import {
  useAdvanceCharacterForEpisode,
  useCharacters,
  useRefreshCharacterForEpisode,
} from "./api/characters";
import { useMyEnrollment } from "./api/enrollment";
import { useEpisode, useEpisodeSkills } from "./api/episodes";
import { type ReadingItem, useEpisodeReadingItems, useToggleReadingProgress } from "./api/reading";
import { EnrollmentError, type Session, useSessions } from "./api/sessions";

function StatusBadge({ status }: { status: string }) {
  if (status === "active")
    return (
      <Badge variant="solid" icon="sparkles">
        Aktiivinen Jakso
      </Badge>
    );
  if (status === "completed") return <Badge variant="outline">Arkistoitu</Badge>;
  return <Badge variant="outline">Tulossa</Badge>;
}

function SessionStatusBadge({ status }: { status: Session["status"] }) {
  if (status === "played") return <Badge variant="outline">Pelattu</Badge>;
  if (status === "next")
    return (
      <Badge variant="solid" icon="sparkles">
        Seuraava
      </Badge>
    );
  return <Badge variant="ghost">Tulossa</Badge>;
}

function typeLabel(contentType: string) {
  if (contentType === "world") return "Maailma";
  if (contentType === "ruleset") return "Säännöt";
  if (contentType === "custom") return "Muut";
  return "";
}

function PracticalInfoCard({
  playerNames,
  sessions,
  location,
  locationLink,
}: {
  playerNames: string[];
  sessions: Session[];
  location: string | null;
  locationLink: string | null;
}) {
  const hasPlayers = playerNames.length > 0;
  const hasSessions = sessions.length > 0;
  const hasLocation = location && location.trim();

  if (!hasPlayers && !hasSessions && !hasLocation) return null;

  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>Käytännön tiedot</CardTitle>
      </CardHeader>
      <CardContent>
        <HeadingLevelProvider>
          {hasPlayers && (
            <div className="mb-4">
              <Heading>Pelaajat</Heading>
              <List variant="unbulleted">
                {playerNames.map((name) => (
                  <ListItem key={name}>{name}</ListItem>
                ))}
              </List>
            </div>
          )}
          {hasSessions && (
            <div className="mb-4">
              <Heading>Sessiot</Heading>
              <List variant="unbulleted">
                {sessions.map((s) => {
                  const formatted = s.date ? new Date(s.date).toLocaleDateString("fi-FI") : "—";
                  return (
                    <ListItem key={s.id}>
                      #{String(s.sessionNumber).padStart(2, "0")} {s.label ? `${s.label} ` : ""}
                      {formatted}
                    </ListItem>
                  );
                })}
              </List>
            </div>
          )}
          {hasLocation && (
            <div>
              <Heading>Sijainti</Heading>
              {locationLink ? (
                <Link href={locationLink} external>
                  {location}
                </Link>
              ) : (
                <Text>{location}</Text>
              )}
            </div>
          )}
        </HeadingLevelProvider>
      </CardContent>
    </Card>
  );
}

function ReadingItemRow({
  item,
  onToggle,
  isPending,
}: {
  item: ReadingItem;
  onToggle: (item: ReadingItem) => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--theme-border-soft)] last:border-0">
      <div className="pt-0.5">
        <Checkbox
          label=""
          checked={item.completed}
          onChange={() => onToggle(item)}
          disabled={isPending}
          aria-label={`Merkitse luetuksi: ${item.title}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              item.completed ? "line-through text-text-placeholder" : "text-[var(--theme-text)]"
            }`}
          >
            {item.title}
          </span>
          {item.contentType !== "task" && (
            <Badge variant="ghost">{typeLabel(item.contentType)}</Badge>
          )}
        </div>
        {item.description && <p className="text-xs text-text-muted mt-0.5">{item.description}</p>}
      </div>
      {item.url && (
        <div className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.location.href = item.url!;
            }}
          >
            Avaa
          </Button>
        </div>
      )}
    </div>
  );
}

function SessionProgress({ items }: { items: ReadingItem[] }) {
  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  if (totalCount === 0) return null;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  return (
    <div className="space-y-1 pt-2">
      <div className="flex justify-between items-center text-xs text-text-muted">
        <span className="font-bold uppercase tracking-widest">Edistyminen</span>
        <span>
          {completedCount} / {totalCount} valmis
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--theme-surface-tint)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--theme-secondary)] transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}

function SessionPrepSection({
  session,
  episodeId,
  defaultOpen,
}: {
  session: Session;
  episodeId: number;
  defaultOpen: boolean;
}) {
  const { data: items, isLoading } = useEpisodeReadingItems(episodeId, session.id);
  const { toggle, isPending } = useToggleReadingProgress();

  const readingItems = (items ?? []).filter((i) => i.contentType !== "task");
  const taskItems = (items ?? []).filter((i) => i.contentType === "task");
  const allItems = items ?? [];

  const sessionDate = session.date ? new Date(session.date).toLocaleDateString("fi-FI") : null;

  const isPlayed = session.status === "played";

  return (
    <AccordionItem
      defaultOpen={defaultOpen}
      className={isPlayed ? "bg-[var(--theme-surface-tint)]" : undefined}
    >
      <AccordionTrigger>
        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 font-mono text-xs text-text-subtle">
              #{String(session.sessionNumber).padStart(2, "0")}
            </span>
            <span
              className={`truncate text-sm font-bold uppercase tracking-widest ${isPlayed ? "text-text-muted" : "text-[var(--theme-text)]"}`}
            >
              {session.label || `Sessio ${session.sessionNumber}`}
            </span>
            {sessionDate && (
              <span className="hidden shrink-0 text-xs text-text-subtle tablet:block">
                {sessionDate}
              </span>
            )}
          </div>
          <SessionStatusBadge status={session.status} />
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-4 p-4">
        {isLoading ? (
          <LoadingState message="Ladataan..." />
        ) : allItems.length === 0 ? (
          <Text variant="muted">Tälle sessiolle ei ole vielä lukemistoa tai tehtäviä.</Text>
        ) : (
          <>
            {readingItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lukemisto ({readingItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 tablet:pt-0">
                  {readingItems.map((item) => (
                    <ReadingItemRow
                      key={item.id}
                      item={item}
                      onToggle={toggle}
                      isPending={isPending}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {taskItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tehtävät ({taskItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 tablet:pt-0">
                  {taskItems.map((item) => (
                    <ReadingItemRow
                      key={item.id}
                      item={item}
                      onToggle={toggle}
                      isPending={isPending}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            <SessionProgress items={allItems} />
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function EpisodeLevelItems({ episodeId }: { episodeId: number }) {
  const { data: items, isLoading } = useEpisodeReadingItems(episodeId);
  const { toggle, isPending } = useToggleReadingProgress();

  const unassigned = (items ?? []).filter((i) => i.sessionId === null);
  if (isLoading || unassigned.length === 0) return null;

  const readingItems = unassigned.filter((i) => i.contentType !== "task");
  const taskItems = unassigned.filter((i) => i.contentType === "task");

  return (
    <div className="space-y-4">
      <div className="border-b-2 border-[var(--theme-border-medium)] pb-2">
        <Heading>Yleinen lukemisto</Heading>
      </div>
      {readingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lukemisto ({readingItems.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 tablet:pt-0">
            {readingItems.map((item) => (
              <ReadingItemRow key={item.id} item={item} onToggle={toggle} isPending={isPending} />
            ))}
          </CardContent>
        </Card>
      )}
      {taskItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tehtävät ({taskItems.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 tablet:pt-0">
            {taskItems.map((item) => (
              <ReadingItemRow key={item.id} item={item} onToggle={toggle} isPending={isPending} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReturningCharacterPrep({
  character,
  episodeId,
  needsRefresh,
  needsAdvance,
}: {
  character: any;
  episodeId: number;
  needsRefresh: boolean;
  needsAdvance: boolean;
}) {
  const refreshMutation = useRefreshCharacterForEpisode();
  const advanceMutation = useAdvanceCharacterForEpisode();
  const { data: episodeSkills, isLoading: isSkillsLoading } = useEpisodeSkills(episodeId);

  const [selectedHarmit, setSelectedHarmit] = useState<number[]>([]);
  const [reward, setReward] = useState<"skills_plus_n6" | "skill_plus_n8" | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  const [selectedTaidot, setSelectedTaidot] = useState<Array<string | null>>([null]);
  const [customSkillText, setCustomSkillText] = useState("");

  const rewardSelected = reward !== null;
  const attributeAssigned = selectedAttribute !== null;
  const taidotCount = reward === "skills_plus_n6" ? 2 : 1;

  const handleRewardChange = (v: string) => {
    if (v !== "skills_plus_n6" && v !== "skill_plus_n8") return;
    setReward(v);
    setSelectedTaidot(Array(v === "skills_plus_n6" ? 2 : 1).fill(null));
    setCustomSkillText("");
  };

  const handleTaidotSelect = (slotIndex: number, value: string | null) => {
    setSelectedTaidot((prev) => {
      const next = [...prev];
      next[slotIndex] = value;
      return next;
    });
    if (value !== "custom") setCustomSkillText("");
  };

  const hasCustomSlot = selectedTaidot.includes("custom");
  const taidotFilled =
    selectedTaidot.every((s) => s !== null) &&
    (!hasCustomSlot || customSkillText.trim() !== "");

  const diceRemaining = selectedAttribute === null ? 1 : 0;

  // Compute per-attribute packed values with live preview: if this attribute is the
  // selected advancement target, show addN4() result; otherwise show the stored value.
  // Number() coercion guards against the API returning these as strings.
  const advVal = (attr: string, stored: unknown) => {
    const packed = Number(stored ?? 0);
    return selectedAttribute === attr ? addN4(packed) : packed;
  };
  const fysiikkaVal  = advVal("fysiikka",  character.fysiikka);
  const nopeusVal    = advVal("nopeus",    character.nopeus);
  const ymmarrysVal  = advVal("ymmarrys",  character.ymmarrys);
  const persoonaVal  = advVal("persoona",  character.persoona);
  const nakemysVal   = advVal("nakemys",   character.nakemys);
  const napparyysVal = advVal("napparyys", character.napparyys);

  const kehoScore  = 8 + getScoreBonusFromValue(fysiikkaVal)  + getScoreBonusFromValue(nopeusVal);
  const mieliScore = 8 + getScoreBonusFromValue(ymmarrysVal)  + getScoreBonusFromValue(persoonaVal);
  const teraScore  = 8 + getScoreBonusFromValue(nakemysVal)   + getScoreBonusFromValue(napparyysVal);

  const buildNewSkills = () =>
    selectedTaidot
      .filter((s): s is string => s !== null)
      .map((s) => (s === "custom" ? customSkillText.trim() : s))
      .filter(Boolean);

  const activeHarmit = (character.harmit ?? [])
    .map((h: { text: string; healed: boolean }, index: number) => ({ ...h, index }))
    .filter((h: { healed: boolean }) => !h.healed);

  const canSubmit = reward !== null && selectedAttribute !== null && taidotFilled;

  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>Hahmon päivitys jaksoa varten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <Text variant="muted">
          Hahmo: <span className="font-semibold text-[var(--theme-text)]">{character.name}</span>
        </Text>

        {needsRefresh ? (
          <div className="space-y-3">
            <Heading>Toipuminen</Heading>
            <Text variant="muted" className="text-sm">
              Päivitys palauttaa Keston ja Sisun jaksojen välisen toipumisen mukaisesti.
            </Text>
            {activeHarmit.length > 0 && (
              <div className="space-y-2">
                <Text className="text-sm">Merkitse parantuneet harmit:</Text>
                {activeHarmit.map((h: { index: number; text: string }) => (
                  <Checkbox
                    key={h.index}
                    label={h.text}
                    checked={selectedHarmit.includes(h.index)}
                    onChange={() =>
                      setSelectedHarmit((current) =>
                        current.includes(h.index)
                          ? current.filter((idx) => idx !== h.index)
                          : [...current, h.index],
                      )
                    }
                  />
                ))}
              </div>
            )}
            <Button
              onClick={() =>
                refreshMutation.mutate({
                  characterId: character.id,
                  episodeId,
                  healedHarmitIndexes: selectedHarmit,
                })
              }
              disabled={refreshMutation.isPending}
            >
              Merkitse toipuminen tehdyksi
            </Button>
          </div>
        ) : (
          <NoticePanel variant="success" title="Toipuminen tehty">
            Jaksojen välinen toipuminen on jo kirjattu tälle hahmolle.
          </NoticePanel>
        )}

        {needsAdvance ? (
          <div className="space-y-6 border-t border-[var(--theme-border-soft)] pt-4">
            <Heading>Kehitys</Heading>

            {/* Step 1: Reward type — mirrors archetype picker in character creation */}
            <RadioGroup
              name="advancement-reward"
              label="Palkinto"
              value={reward ?? undefined}
              onValueChange={handleRewardChange}
            >
              <RadioGroupItem value="munkki" label="Munkki" description="Sisu: 3n4, Taidot: 2" obscured />
              <RadioGroupItem
                value="skills_plus_n6"
                label="Ekspertti"
                description="2 taitoa + 1n6 sisu"
              />
              <RadioGroupItem
                value="skill_plus_n8"
                label="Sotilas"
                description="1 taito + 1n8 sisu"
              />
            </RadioGroup>

            {/* Step 2: Attribute — one die to assign, mirrors attribute step in character creation.
                Values computed in component body (not IIFE) so React re-renders correctly.
                Selecting an attribute previews the post-advancement dice and live Kesto score. */}
            <ObscuredWrapper revealed={rewardSelected}>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <Heading>Ominaisuus</Heading>
                  <div className="flex items-center gap-2 text-text-muted font-mono">
                    <span>Noppia jäljellä:</span>
                    <div className="flex gap-1.5">
                      {diceRemaining > 0 && <DiceIcon faces={4} size="sm" />}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
                  <AttributeCard
                    label="Keho"
                    score={kehoScore}
                    subAttributes={[
                      {
                        name: "Fysiikka",
                        label: "Fysiikka",
                        value: fysiikkaVal,
                        onAdd: () => setSelectedAttribute("fysiikka"),
                        onRemove: () => setSelectedAttribute(null),
                        canAdd: diceRemaining > 0,
                        canRemove: selectedAttribute === "fysiikka",
                      },
                      {
                        name: "Nopeus",
                        label: "Nopeus",
                        value: nopeusVal,
                        onAdd: () => setSelectedAttribute("nopeus"),
                        onRemove: () => setSelectedAttribute(null),
                        canAdd: diceRemaining > 0,
                        canRemove: selectedAttribute === "nopeus",
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
                        value: ymmarrysVal,
                        onAdd: () => setSelectedAttribute("ymmarrys"),
                        onRemove: () => setSelectedAttribute(null),
                        canAdd: diceRemaining > 0,
                        canRemove: selectedAttribute === "ymmarrys",
                      },
                      {
                        name: "Persoona",
                        label: "Persoona",
                        value: persoonaVal,
                        onAdd: () => setSelectedAttribute("persoona"),
                        onRemove: () => setSelectedAttribute(null),
                        canAdd: diceRemaining > 0,
                        canRemove: selectedAttribute === "persoona",
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
                        value: nakemysVal,
                        onAdd: () => setSelectedAttribute("nakemys"),
                        onRemove: () => setSelectedAttribute(null),
                        canAdd: diceRemaining > 0,
                        canRemove: selectedAttribute === "nakemys",
                      },
                      {
                        name: "Näppäryys",
                        label: "Näppäryys",
                        value: napparyysVal,
                        onAdd: () => setSelectedAttribute("napparyys"),
                        onRemove: () => setSelectedAttribute(null),
                        canAdd: diceRemaining > 0,
                        canRemove: selectedAttribute === "napparyys",
                      },
                    ]}
                  />
                </div>
              </div>
            </ObscuredWrapper>

            {/* Step 3: Skills — SkillMasonry per slot, mirrors taidot step in character creation */}
            <ObscuredWrapper revealed={attributeAssigned}>
              <div className="space-y-4">
                <div className="border-b-2 border-[var(--theme-border-medium)] pb-2">
                  <Heading>Taidot ({taidotCount} valittava)</Heading>
                </div>
                {isSkillsLoading ? (
                  <LoadingState message="Ladataan taitoja..." />
                ) : (
                  <div className="space-y-4">
                    {Array.from({ length: taidotCount }).map((_, slotIndex) => {
                      const slotValue = selectedTaidot[slotIndex] ?? null;
                      const isCustomSlot = slotValue === "custom";
                      return (
                        <Card key={slotIndex} variant="outline">
                          <CardHeader>
                            <CardTitle>Taito {slotIndex + 1}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <SkillMasonry
                              sort="optimal"
                              skills={
                                episodeSkills?.map((skill) => ({
                                  id: skill.id,
                                  name: skill.name,
                                  disabled: selectedTaidot.some(
                                    (s, i) => i !== slotIndex && s === skill.name,
                                  ),
                                  selected: slotValue === skill.name,
                                })) ?? []
                              }
                              onSkillClick={(skill) =>
                                handleTaidotSelect(
                                  slotIndex,
                                  slotValue === skill.name ? null : skill.name,
                                )
                              }
                              showCustomButton={!hasCustomSlot || isCustomSlot}
                              isCustomSelected={isCustomSlot}
                              onCustomClick={() =>
                                handleTaidotSelect(slotIndex, isCustomSlot ? null : "custom")
                              }
                            />
                            {isCustomSlot && (
                              <div className="mt-3">
                                <Input
                                  label="Kirjoita oma taito"
                                  placeholder="Esim. Hakkerointi"
                                  value={customSkillText}
                                  onChange={(e) => setCustomSkillText(e.target.value)}
                                />
                                <p className="text-xs text-text-muted mt-1">
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

            {/* Confirm — only revealed once all choices are made */}
            <ObscuredWrapper revealed={canSubmit}>
              <Button
                onClick={() => {
                  if (!canSubmit || !selectedAttribute || !reward) return;
                  advanceMutation.mutate({
                    characterId: character.id,
                    episodeId,
                    attribute: selectedAttribute as
                      | "fysiikka"
                      | "nopeus"
                      | "ymmarrys"
                      | "persoona"
                      | "nakemys"
                      | "napparyys",
                    reward,
                    newSkills: buildNewSkills(),
                  });
                }}
                loading={advanceMutation.isPending}
                disabled={!canSubmit || advanceMutation.isPending}
              >
                Vahvista kehitys
              </Button>
            </ObscuredWrapper>
          </div>
        ) : (
          <NoticePanel variant="success" title="Kehitys tehty">
            Tämä hahmo on jo kehitetty tätä jaksoa varten.
          </NoticePanel>
        )}
      </CardContent>
    </Card>
  );
}

export function SessionPrepView({ episodeId, basePath }: { episodeId: number; basePath: string }) {
  // All hooks must run unconditionally before any early return.
  const { user } = useAuth();
  const { data: episode, isLoading: isEpisodeLoading } = useEpisode(episodeId);
  const {
    data: sessions,
    isLoading: isSessionsLoading,
    error: sessionsError,
  } = useSessions(episodeId);
  const { data: enrollment } = useMyEnrollment(episodeId);
  const { data: characters, isLoading: isCharactersLoading } = useCharacters();

  const linkedOwnCharacters = useMemo(
    () =>
      (characters ?? []).filter(
        (character) =>
          character.userId === user?.id &&
          (character.episodes ?? []).some((ep) => ep.id === episodeId),
      ),
    [characters, user?.id, episodeId],
  );

  // Derived values — safe after all hooks are declared.
  const isNotEnrolled = sessionsError instanceof EnrollmentError;
  const isEpisodeCompleted = episode?.status === "completed";
  const nextSessionIndex = sessions ? sessions.findIndex((s) => s.status === "next") : -1;
  const linkedCharacter = linkedOwnCharacters[0];
  const episodeLink = linkedCharacter?.episodes?.find((ep) => ep.id === episodeId);
  const needsRefresh = !episodeLink?.refreshedAt;
  const needsAdvance = !episodeLink?.advancedAt;
  const isDebut = linkedCharacter != null && linkedCharacter.hasPlayedSessions === false;

  // Early returns after all hooks.
  if (isEpisodeLoading) return <LoadingState message="Ladataan jaksoa..." />;
  if (!episode) return <div className="p-8 text-center">Jaksoa ei löydy.</div>;

  if (isNotEnrolled) {
    return (
      <HeadingLevelProvider>
        <Hero
          title={`Valmistaudu: ${episode.title}`}
          description={episode.description ?? undefined}
        >
          <div className="mt-4">
            <StatusBadge status={episode.status} />
          </div>
        </Hero>
        <PageBody>
          <Breadcrumb
            className="mb-6"
            items={[
              { label: "Hahmot", to: `${basePath}/list` },
              { label: `Valmistaudu: ${episode.title}` },
            ]}
          />
          <div className="py-12 text-center space-y-2">
            <Text variant="muted">Et ole ilmoittautunut tähän jaksoon.</Text>
            <Text variant="muted">Ota yhteyttä pelinjohtajaan.</Text>
          </div>
        </PageBody>
      </HeadingLevelProvider>
    );
  }

  return (
    <HeadingLevelProvider>
      <Hero title={`Valmistaudu: ${episode.title}`} description={episode.description ?? undefined}>
        <div className="mt-4">
          <StatusBadge status={episode.status} />
        </div>
      </Hero>
      <PageBody>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Hahmot", to: `${basePath}/list` },
            { label: `Valmistaudu: ${episode.title}` },
          ]}
        />
        <HeadingLevelProvider>
          <div className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8 items-start">
            <div className="space-y-6">
              {isEpisodeCompleted ? (
                <NoticePanel variant="info" title="Jakso on päättynyt">
                  Tämä jakso on arkistoitu eikä valmistautumistoimia voi enää tehdä.
                </NoticePanel>
              ) : isCharactersLoading ? (
                <LoadingState message="Ladataan hahmotietoja..." />
              ) : linkedCharacter && !isDebut ? (
                <ReturningCharacterPrep
                  character={linkedCharacter}
                  episodeId={episodeId}
                  needsRefresh={needsRefresh}
                  needsAdvance={needsAdvance}
                />
              ) : !linkedCharacter ? (
                <NoticePanel variant="info" title="Ei liitettyä hahmoa">
                  Liitä hahmo tähän jaksoon hahmoluettelossa ennen valmistautumista.
                </NoticePanel>
              ) : null}
              {isSessionsLoading ? (
                <LoadingState message="Ladataan sessioita..." />
              ) : sessions && sessions.length > 0 ? (
                <>
                  <div className="border-b-2 border-[var(--theme-border-medium)] pb-2">
                    <Heading>Sessiot</Heading>
                  </div>
                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <SessionPrepSection
                        key={session.id}
                        session={session}
                        episodeId={episodeId}
                        defaultOpen={
                          session.status === "next" || (nextSessionIndex === -1 && index === 0)
                        }
                      />
                    ))}
                  </div>
                  <EpisodeLevelItems episodeId={episodeId} />
                </>
              ) : (
                <EpisodeLevelItems episodeId={episodeId} />
              )}
            </div>

            <div>
              <PracticalInfoCard
                playerNames={(enrollment ?? []).map((e) => e.username ?? "—")}
                sessions={sessions ?? []}
                location={episode.location}
                locationLink={episode.locationLink}
              />
            </div>
          </div>
        </HeadingLevelProvider>
      </PageBody>
    </HeadingLevelProvider>
  );
}
