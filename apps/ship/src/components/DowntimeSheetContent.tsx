import {
  Badge,
  ConfirmDialog,
  ConsoleButton,
  ConsolePill,
  ConsoleRow,
  ConsoleSheet,
  type ConsoleSheetSnap,
  countAllocatedDowntimeDice,
  Dialog,
  DiceIcon,
  type DowntimeDraftAllocation,
  Input,
  LoadingState,
  NoticePanel,
  ProgressClock,
  type ProgressClockSegments,
  Select,
  Text,
  TextArea,
} from "@repo/ui";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  type DowntimeResolutionPayload,
  type ShipClock,
  type ShipOverviewResponse,
  useCharacterDowntime,
  useCreateShipClock,
  useResolveDowntime,
  useSaveDowntimeDraft,
} from "../api/ship";

export interface DowntimeSheetContentProps {
  overview: ShipOverviewResponse;
  basePath: string;
  isGm: boolean;
  onClose?: () => void;
}

const EMPTY_DRAFT: DowntimeDraftAllocation = {
  healedHarmiIndices: [],
  clockDice: {},
  prepDice: 0,
  prepDescription: "",
};

function sanitizeDraft(
  raw: Partial<DowntimeDraftAllocation> | null | undefined,
): DowntimeDraftAllocation {
  if (!raw) return { ...EMPTY_DRAFT, healedHarmiIndices: [], clockDice: {} };
  return {
    healedHarmiIndices: Array.isArray(raw.healedHarmiIndices) ? [...raw.healedHarmiIndices] : [],
    clockDice: raw.clockDice ? { ...raw.clockDice } : {},
    prepDice: typeof raw.prepDice === "number" ? raw.prepDice : 0,
    prepDescription: typeof raw.prepDescription === "string" ? raw.prepDescription : "",
  };
}

function ResolutionCompactCard({
  entry,
  episodeLabel,
}: {
  entry: DowntimeResolutionPayload;
  episodeLabel?: string | null;
}) {
  return (
    <div className="border border-[var(--theme-secondary)] rounded-[4px] p-3 bg-[color-mix(in_srgb,var(--theme-secondary)_8%,var(--theme-bg))] space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-heading text-xs uppercase tracking-wider text-[var(--theme-secondary)] font-bold">
          {episodeLabel || "Ratkaistu väliaika"}
        </span>
        <Badge variant="highlight">Lukittu</Badge>
      </div>

      {entry.healedHarmit.length > 0 && (
        <div className="space-y-1">
          {entry.healedHarmit.map((heal) => (
            <div key={heal.index} className="text-xs text-[var(--theme-text)]">
              <span className="font-heading text-xs font-semibold text-[var(--theme-accent)] mr-1.5">
                PARANNETTU:
              </span>
              <span>{heal.text}</span>
            </div>
          ))}
        </div>
      )}

      {entry.clockResults.length > 0 && (
        <div className="space-y-1.5">
          {entry.clockResults.map((roll) => (
            <div
              key={roll.clockId}
              className="flex flex-wrap items-center justify-between gap-2 border border-[var(--theme-border-soft)] rounded-[3px] px-2.5 py-1.5 bg-[var(--theme-bg)]"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-[var(--theme-text)] truncate">
                  {roll.title}
                </div>
                <div className="font-heading text-xs font-semibold tabular-nums text-text-muted">
                  {`Kello +${roll.ticksAdded} (yhteensä ${roll.segmentsFilledAfter}${
                    roll.segmentsTotal ? `/${roll.segmentsTotal}` : ""
                  })${roll.isCritical ? ", kriittinen" : roll.hasDoubles ? ", tuplat" : ""}`}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {roll.rolls.map((value, dieIndex) => (
                  <DiceIcon
                    key={`${roll.clockId}-${dieIndex}-${value}`}
                    faces={20}
                    value={value}
                    size="sm"
                    active={value >= 13}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {entry.prepResult && (
        <div className="flex flex-wrap items-center justify-between gap-2 border border-[var(--theme-border-soft)] rounded-[3px] px-2.5 py-1.5 bg-[var(--theme-bg)]">
          <div className="min-w-0">
            <div className="text-xs font-bold text-[var(--theme-text)]">Keikkavalmistautuminen</div>
            <div className="text-xs text-text-muted">
              {`${entry.prepResult.hits} osumaa${
                entry.prepResult.isCritical
                  ? " (kriittinen)"
                  : entry.prepResult.hasDoubles
                    ? " (tuplat)"
                    : ""
              }${entry.prepResult.description ? `: ${entry.prepResult.description}` : ""}`}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {entry.prepResult.rolls.map((value, dieIndex) => (
              <DiceIcon
                key={`prep-${dieIndex}-${value}`}
                faces={20}
                value={value}
                size="sm"
                active={value >= 13}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact 5n20 downtime action terminal inside `ConsoleSheet`.
 */
export function DowntimeSheetContent({ overview, basePath, onClose }: DowntimeSheetContentProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectableCharacters = useMemo(() => {
    const map = new Map<number, { id: number; name: string; archetype: string }>();
    for (const c of [...overview.myCharacters, ...overview.crewCharacters]) {
      if (!map.has(c.id)) {
        map.set(c.id, { id: c.id, name: c.name, archetype: c.archetype });
      }
    }
    return Array.from(map.values());
  }, [overview.crewCharacters, overview.myCharacters]);

  const [selectedCharId, setSelectedCharId] = useState<number | null>(() => {
    const paramId = Number(searchParams.get("characterId"));
    if (
      searchParams.get("characterId") &&
      Number.isFinite(paramId) &&
      selectableCharacters.some((c) => c.id === paramId)
    ) {
      return paramId;
    }
    return overview.myCharacters[0]?.id ?? selectableCharacters[0]?.id ?? null;
  });
  const [sheetSnap, setSheetSnap] = useState<ConsoleSheetSnap>("full");

  const { data: downtime, isLoading } = useCharacterDowntime(selectedCharId);
  const saveDraftMutation = useSaveDowntimeDraft();
  const resolveMutation = useResolveDowntime();
  const createClockMutation = useCreateShipClock();

  const [draft, setDraft] = useState<DowntimeDraftAllocation>(() => sanitizeDraft(EMPTY_DRAFT));
  const [confirmResolveOpen, setConfirmResolveOpen] = useState(false);

  // Create clock dialog state
  const [createDialogCategory, setCreateDialogCategory] = useState<"tutkimus" | "projekti" | null>(
    null,
  );
  const [newClockScope, setNewClockScope] = useState<"ship" | "character">("ship");
  const [newClockTitle, setNewClockTitle] = useState("");
  const [newClockDesc, setNewClockDesc] = useState("");
  const [newClockRoomKey, setNewClockRoomKey] = useState("");
  const [newClockSegments, setNewClockSegments] = useState<string>("6");

  useEffect(() => {
    if (!downtime) return;
    setDraft(sanitizeDraft(downtime.draft));
  }, [downtime]);

  const activeClocks = useMemo(
    () => downtime?.eligibleClocks ?? overview.clocks.filter((clock) => clock.status === "active"),
    [downtime?.eligibleClocks, overview.clocks],
  );
  const researchClocks = useMemo(
    () => activeClocks.filter((c) => c.category === "tutkimus"),
    [activeClocks],
  );
  const projectClocks = useMemo(
    () => activeClocks.filter((c) => c.category === "projekti"),
    [activeClocks],
  );

  const availableDice = downtime?.availableDice ?? 0;
  const allocatedCount = countAllocatedDowntimeDice(draft);
  const diceRemaining = Math.max(0, availableDice - allocatedCount);
  const canDraft = Boolean(downtime?.canDraft);
  const canRoll = Boolean(downtime?.canRoll);
  const readOnly = !canDraft || resolveMutation.isPending;

  const handleToggleHarm = (harmIndex: number) => {
    if (readOnly) return;
    setDraft((prev) => {
      const exists = prev.healedHarmiIndices.includes(harmIndex);
      if (exists) {
        return {
          ...prev,
          healedHarmiIndices: prev.healedHarmiIndices.filter((i) => i !== harmIndex),
        };
      }
      if (diceRemaining <= 0) return prev;
      return {
        ...prev,
        healedHarmiIndices: [...prev.healedHarmiIndices, harmIndex],
      };
    });
  };

  const handleClockDelta = (clockId: number, delta: 1 | -1) => {
    if (readOnly) return;
    setDraft((prev) => {
      const current = prev.clockDice[clockId] ?? 0;
      if (delta > 0 && diceRemaining <= 0) return prev;
      const next = current + delta;
      if (next < 0) return prev;
      const nextClockDice = { ...prev.clockDice };
      if (next === 0) {
        delete nextClockDice[clockId];
      } else {
        nextClockDice[clockId] = next;
      }
      return {
        ...prev,
        clockDice: nextClockDice,
      };
    });
  };

  const handlePrepDelta = (delta: 1 | -1) => {
    if (readOnly) return;
    setDraft((prev) => {
      if (delta > 0 && diceRemaining <= 0) return prev;
      const nextPrep = prev.prepDice + delta;
      if (nextPrep < 0) return prev;
      return {
        ...prev,
        prepDice: nextPrep,
      };
    });
  };

  const handleSaveDraft = () => {
    if (!selectedCharId || readOnly) return;
    saveDraftMutation.mutate({
      characterId: selectedCharId,
      allocation: draft,
    });
  };

  const handleConfirmResolve = () => {
    if (!selectedCharId || !canRoll || resolveMutation.isPending || allocatedCount === 0) return;
    resolveMutation.mutate({
      characterId: selectedCharId,
      allocation: draft,
    });
  };

  const handleCreateClockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createDialogCategory || !newClockTitle.trim()) return;
    createClockMutation.mutate(
      {
        category: createDialogCategory,
        scope: newClockScope,
        characterId: newClockScope === "character" ? selectedCharId : null,
        roomKey: newClockRoomKey || null,
        title: newClockTitle.trim(),
        description: newClockDesc.trim(),
        segmentsTotal: newClockSegments
          ? (Number(newClockSegments) as ProgressClockSegments)
          : null,
      },
      {
        onSuccess: () => {
          setCreateDialogCategory(null);
          setNewClockTitle("");
          setNewClockDesc("");
          setNewClockRoomKey("");
        },
      },
    );
  };

  const renderClockGroup = (
    category: "tutkimus" | "projekti",
    title: string,
    clocks: ShipClock[],
    createLabel: string,
  ) => (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
          {title}
        </span>
        {!readOnly && (
          <ConsoleButton
            variant="outline"
            size="compact"
            iconLeft="plus"
            onClick={() => setCreateDialogCategory(category)}
          >
            {createLabel}
          </ConsoleButton>
        )}
      </div>

      {clocks.length === 0 ? (
        <div className="border border-dashed border-[var(--theme-border-soft)] rounded-[4px] p-3 text-center">
          <Text variant="muted" className="text-xs">
            Ei aktiivisia kelloja tässä luokassa.
          </Text>
        </div>
      ) : (
        <div className="space-y-1.5">
          {clocks.map((clock) => {
            const assigned = draft.clockDice[clock.id] ?? 0;
            const roomName = clock.roomKey
              ? overview.rooms.find((r) => r.key === clock.roomKey)?.name
              : null;

            return (
              <ConsoleRow
                key={clock.id}
                statusTone={assigned > 0 ? "active" : "normal"}
                title={clock.title}
                subtitle={
                  clock.segmentsTotal === null
                    ? `Odottaa mitoitusta (+${clock.segmentsFilled})`
                    : `${clock.segmentsFilled}/${clock.segmentsTotal} osaa täynnä`
                }
                leading={
                  <ProgressClock
                    segmentsTotal={clock.segmentsTotal}
                    segmentsFilled={clock.segmentsFilled}
                    pendingTicks={assigned}
                    category={clock.category}
                    size="sm"
                  />
                }
                badge={roomName ? <Badge variant="outline">{roomName}</Badge> : undefined}
                actions={
                  <div className="flex items-center gap-1.5">
                    <ConsoleButton
                      variant="outline"
                      size="compact"
                      disabled={readOnly || assigned <= 0}
                      aria-label={`Vähennä noppaa kellosta ${clock.title}`}
                      onClick={() => handleClockDelta(clock.id, -1)}
                    >
                      -
                    </ConsoleButton>
                    <span className="min-w-8 text-center font-heading text-sm font-bold tabular-nums text-[var(--theme-text)]">
                      {`${assigned}n`}
                    </span>
                    <ConsoleButton
                      variant="outline"
                      size="compact"
                      disabled={readOnly || diceRemaining <= 0}
                      aria-label={`Lisää noppa kelloon ${clock.title}`}
                      onClick={() => handleClockDelta(clock.id, 1)}
                    >
                      +
                    </ConsoleButton>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );

  const harmReduction = downtime ? downtime.activeHarmit.length : 0;

  const sheetFooter =
    downtime && canDraft ? (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-heading text-xs font-semibold uppercase tracking-wider tabular-nums text-text-muted">
          {`Vapaita: ${diceRemaining} n20`}
        </span>
        <div className="flex items-center gap-2">
          <ConsoleButton
            variant="outline"
            loading={saveDraftMutation.isPending}
            disabled={readOnly}
            onClick={handleSaveDraft}
          >
            Tallenna luonnos
          </ConsoleButton>
          <ConsoleButton
            variant="primary"
            loading={resolveMutation.isPending}
            disabled={!canRoll || resolveMutation.isPending || allocatedCount === 0}
            onClick={() => setConfirmResolveOpen(true)}
          >
            {`Lukitse ja heitä (${allocatedCount}n20)`}
          </ConsoleButton>
        </div>
      </div>
    ) : undefined;

  return (
    <ConsoleSheet
      title="Väliaikatoiminnot"
      subtitle={
        downtime?.pendingSourceEpisode
          ? `Lähdejakso: ${downtime.pendingSourceEpisode.title}`
          : "Jaa 5n20 toimintopistettä jaksojen välillä"
      }
      snap={sheetSnap}
      onSnapChange={setSheetSnap}
      statusSlot={
        downtime ? (
          <ConsolePill tone={diceRemaining === 0 && availableDice > 0 ? "dawn" : "secondary"}>
            {`${allocatedCount}/${availableDice} n20`}
          </ConsolePill>
        ) : undefined
      }
      footer={sheetFooter}
      onClose={onClose}
    >
      {selectableCharacters.length > 0 && (
        <Select
          size="compact"
          label="Toimiva hahmo"
          value={selectedCharId !== null ? String(selectedCharId) : ""}
          onChange={(e) => setSelectedCharId(Number(e.target.value))}
          options={selectableCharacters.map((c) => ({
            value: String(c.id),
            label: `${c.name} (${c.archetype})`,
          }))}
        />
      )}

      {selectedCharId === null ? (
        <NoticePanel variant="info" title="Ei valittavaa hahmoa">
          <Text variant="small">
            Luo hahmo generaattorissa voidaksesi suunnitella väliaikatoimintoja.
          </Text>
          <div className="mt-3">
            <ConsoleButton variant="outline" onClick={() => navigate(basePath || "/")}>
              Takaisin alukselle
            </ConsoleButton>
          </div>
        </NoticePanel>
      ) : isLoading || !downtime ? (
        <LoadingState message="Ladataan noppapoolia..." size="default" layout="inline" />
      ) : (
        <div className="space-y-4">
          {/* Dice pool telemetry bar */}
          <div className="border border-[var(--theme-border-soft)] rounded-[4px] p-2.5 bg-[color-mix(in_srgb,var(--theme-bg)_92%,var(--theme-surface-tint))] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Noppapooli
              </span>
              <span className="font-heading text-xs tabular-nums text-[var(--theme-secondary)] font-bold">
                {`Käytettävissä: ${availableDice} (5 perus - ${harmReduction} harmia)`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {([0, 1, 2, 3, 4] as const).map((slot) => {
                const isHarmBlocked = slot >= availableDice;
                const isAllocated = !isHarmBlocked && slot < allocatedCount;
                return (
                  <div
                    key={`pool-slot-${slot}`}
                    className={[
                      "inline-flex items-center gap-1 px-2 py-1 rounded-[3px] border font-heading text-xs font-semibold",
                      isHarmBlocked
                        ? "border-dashed border-[var(--theme-accent)] text-[var(--theme-accent)]"
                        : isAllocated
                          ? "border-[var(--theme-dawn)] bg-[color-mix(in_srgb,var(--theme-dawn)_16%,var(--theme-bg))] text-[var(--theme-text)]"
                          : "border-[var(--theme-border-soft)] bg-[var(--theme-bg)] text-text-muted",
                    ].join(" ")}
                  >
                    <DiceIcon faces={20} size="sm" active={isAllocated} hideValue />
                    <span>{isHarmBlocked ? "Harmi" : isAllocated ? "Käytössä" : "Vapaa"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {downtime.blockReason && (
            <NoticePanel
              variant="info"
              title={canDraft ? "Luonnos avoinna" : "Toiminnot lukittu tällä kierroksella"}
            >
              <Text variant="small">{downtime.blockReason}</Text>
            </NoticePanel>
          )}

          {/* 1. Healing harms */}
          <div className="space-y-2">
            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
              1. Harmien parantaminen (1 noppa poistaa yhden harmin)
            </span>
            {downtime.activeHarmit.length === 0 ? (
              <div className="border border-dashed border-[var(--theme-border-soft)] rounded-[4px] p-2.5 text-center">
                <Text variant="muted" className="text-xs">
                  Hahmolla ei ole parannettavia harmeja.
                </Text>
              </div>
            ) : (
              <div className="space-y-1.5">
                {downtime.activeHarmit.map((harm) => {
                  const selected = draft.healedHarmiIndices.includes(harm.index);
                  return (
                    <ConsoleRow
                      key={harm.index}
                      statusTone={selected ? "active" : "normal"}
                      title={harm.text}
                      subtitle="Aktiivinen harmi (-1n20 väliaikaan)"
                      actions={
                        <ConsoleButton
                          variant={selected ? "primary" : "outline"}
                          size="compact"
                          disabled={readOnly || (!selected && diceRemaining <= 0)}
                          onClick={() => handleToggleHarm(harm.index)}
                        >
                          {selected ? "Parannetaan (1n)" : "Paranna (1n)"}
                        </ConsoleButton>
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Research clocks */}
          {renderClockGroup("tutkimus", "2. Tutkimuskellot", researchClocks, "Uusi tutkimus")}

          {/* 3. Project clocks */}
          {renderClockGroup("projekti", "3. Projektikellot", projectClocks, "Uusi projekti")}

          {/* 4. Prep */}
          <div className="space-y-2 border border-[var(--theme-border-soft)] rounded-[4px] p-3 bg-[color-mix(in_srgb,var(--theme-bg)_92%,var(--theme-surface-tint))]">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                  4. Keikkavalmistautuminen
                </div>
                <div className="text-xs text-text-muted">
                  Heitä haluamasi nopat ja vie tulokset seuraavaan jaksoon.
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <ConsoleButton
                  variant="outline"
                  size="compact"
                  disabled={readOnly || draft.prepDice <= 0}
                  aria-label="Vähennä valmistautumisnoppaa"
                  onClick={() => handlePrepDelta(-1)}
                >
                  -
                </ConsoleButton>
                <span className="min-w-8 text-center font-heading text-sm font-bold tabular-nums text-[var(--theme-text)]">
                  {`${draft.prepDice}n`}
                </span>
                <ConsoleButton
                  variant="outline"
                  size="compact"
                  disabled={readOnly || diceRemaining <= 0}
                  aria-label="Lisää valmistautumisnoppa"
                  onClick={() => handlePrepDelta(1)}
                >
                  +
                </ConsoleButton>
              </div>
            </div>

            <Input
              label="Valmistautumisen kuvaus"
              size="compact"
              disabled={readOnly || draft.prepDice === 0}
              value={draft.prepDescription}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  prepDescription: e.target.value,
                }))
              }
              placeholder="Mitä tarkistat, hankit tai rakennat seuraavaa keikkaa varten?"
            />
          </div>

          {/* Latest resolution & history */}
          {downtime.resolvedTurns.length > 0 && (
            <div className="space-y-2">
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Ratkaistut tulokset
              </span>
              {downtime.resolvedTurns.map((turn) =>
                turn.resolution ? (
                  <ResolutionCompactCard
                    key={turn.id}
                    entry={turn.resolution}
                    episodeLabel={turn.lockedEpisodeTitle || turn.sourceEpisodeTitle}
                  />
                ) : null,
              )}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmResolveOpen}
        onOpenChange={setConfirmResolveOpen}
        title="Lukitse ja heitä väliaikatoiminnot?"
        description={`Heitetään ${allocatedCount} n20 noppaa valituille toiminnoille. Tulokset tallennetaan pysyvästi.`}
        confirmLabel="Heitä nopat"
        cancelLabel="Peruuta"
        onConfirm={handleConfirmResolve}
      />

      <Dialog
        open={Boolean(createDialogCategory)}
        onClose={() => setCreateDialogCategory(null)}
        title={createDialogCategory === "tutkimus" ? "Uusi tutkimuskello" : "Uusi projektikello"}
        description="Voit aloittaa kellon nyt. Pelinjohtaja voi myöhemmin tarkentaa sen mitoituksen."
      >
        <form onSubmit={handleCreateClockSubmit} className="space-y-3">
          <Input
            label="Kellon nimi"
            size="compact"
            value={newClockTitle}
            onChange={(e) => setNewClockTitle(e.target.value)}
            placeholder="Esim. signaalidekooderin rakentaminen"
            required
          />
          <TextArea
            label="Kuvaus"
            size="compact"
            rows={2}
            value={newClockDesc}
            onChange={(e) => setNewClockDesc(e.target.value)}
            placeholder="Mitä kellon täyttyminen saa aikaan?"
          />
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Select
              label="Laajuus"
              size="compact"
              value={newClockScope}
              onChange={(e) => setNewClockScope(e.target.value as "ship" | "character")}
              options={[
                { value: "ship", label: "Koko miehistön yhteinen" },
                { value: "character", label: "Hahmon oma" },
              ]}
            />
            <Select
              label="Osioiden määrä"
              size="compact"
              value={newClockSegments}
              onChange={(e) => setNewClockSegments(e.target.value)}
              options={[
                { value: "", label: "Odottaa PJ:n mitoitusta" },
                { value: "4", label: "4 osaa" },
                { value: "6", label: "6 osaa" },
                { value: "8", label: "8 osaa" },
                { value: "10", label: "10 osaa" },
                { value: "12", label: "12 osaa" },
              ]}
            />
          </div>
          <Select
            label="Liitetty osasto (valinnainen)"
            size="compact"
            value={newClockRoomKey}
            onChange={(e) => setNewClockRoomKey(e.target.value)}
            options={[
              { value: "", label: "Ei rajattu osastoon" },
              ...overview.rooms
                .filter((r) => r.kind !== "cabin")
                .map((r) => ({
                  value: r.key,
                  label: `K0${r.deckNumber}: ${r.name}`,
                })),
            ]}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--theme-border-soft)]">
            <ConsoleButton
              type="button"
              variant="ghost"
              size="compact"
              onClick={() => setCreateDialogCategory(null)}
            >
              Peruuta
            </ConsoleButton>
            <ConsoleButton
              type="submit"
              variant="primary"
              size="compact"
              loading={createClockMutation.isPending}
            >
              Luo kello
            </ConsoleButton>
          </div>
        </form>
      </Dialog>
    </ConsoleSheet>
  );
}
