import React from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { DiceIcon } from "./DiceIcon";
import { FieldLabel } from "./FieldLabel";
import { Heading, HeadingLevelProvider } from "./Heading";
import { HudPanel } from "./HudPanel";
import { Icon } from "./Icon";
import { ProgressClock, type ProgressClockSegments } from "./ProgressClock";
import { Text } from "./Text";
import { TextArea } from "./TextArea";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface DowntimeHarmiItem {
  index: number;
  text: string;
}

export interface DowntimeClockTarget {
  id: number;
  title: string;
  description: string;
  category: "tutkimus" | "projekti";
  scope: "ship" | "character";
  roomLabel?: string | null;
  segmentsTotal: ProgressClockSegments | null;
  segmentsFilled: number;
}

export interface DowntimeDraftAllocation {
  healedHarmiIndices: number[];
  clockDice: Record<number, number>;
  prepDice: number;
  prepDescription: string;
}

export interface DowntimeAllocatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Number of d20 dice available (`5 - activeHarmitCount`, clamped `0..5`). */
  availableDice: number;
  /** Active unhealed harmit on the character. */
  activeHarmit: DowntimeHarmiItem[];
  /** Active research and project clocks eligible for allocation. */
  clocks: DowntimeClockTarget[];
  /** Current allocation draft state. */
  value: DowntimeDraftAllocation;
  /** Called whenever any die or prep description changes. */
  onChange: (next: DowntimeDraftAllocation) => void;
  /** Optional callback to open a new clock creation modal for the selected category. */
  onCreateClock?: (category: "tutkimus" | "projekti") => void;
  /** Locks editing when viewing an archived/resolved turn. */
  readOnly?: boolean;
  /** Optional scoped theme. */
  theme?: Theme;
}

const MAX_BASE_POOL = 5;
const DICE_SLOT_KEYS = ["slot-0", "slot-1", "slot-2", "slot-3", "slot-4"] as const;

export function countAllocatedDowntimeDice(draft: DowntimeDraftAllocation): number {
  const clockSum = Object.values(draft.clockDice).reduce(
    (sum, count) => sum + Math.max(0, count),
    0,
  );
  return draft.healedHarmiIndices.length + clockSum + Math.max(0, draft.prepDice);
}

/**
 * Between-episode 5n20 allocator for base-ship downtime actions.
 * Players allocate available `n20` dice (reduced 1:1 by active harmit, with zero attribute dice)
 * across automatic Harmi recovery, Research clocks, Project clocks, and Mission Preparation.
 *
 * @summary between-episode 5n20 pool allocator for rest, research, projects, and mission prep
 */
export const DowntimeAllocator = React.forwardRef<HTMLDivElement, DowntimeAllocatorProps>(
  (
    {
      className,
      availableDice,
      activeHarmit,
      clocks,
      value,
      onChange,
      onCreateClock,
      readOnly = false,
      theme,
      ...props
    },
    ref,
  ) => {
    const safeAvailable = Math.max(0, Math.min(MAX_BASE_POOL, availableDice));
    const totalAllocated = countAllocatedDowntimeDice(value);
    const diceRemaining = safeAvailable - totalAllocated;
    const harmPenaltyCount = Math.max(0, MAX_BASE_POOL - safeAvailable);

    const researchClocks = React.useMemo(
      () => clocks.filter((clock) => clock.category === "tutkimus"),
      [clocks],
    );
    const projectClocks = React.useMemo(
      () => clocks.filter((clock) => clock.category === "projekti"),
      [clocks],
    );

    const handleToggleHarmi = (harmiIndex: number) => {
      if (readOnly) return;
      const isSelected = value.healedHarmiIndices.includes(harmiIndex);
      if (isSelected) {
        onChange({
          ...value,
          healedHarmiIndices: value.healedHarmiIndices.filter((idx) => idx !== harmiIndex),
        });
        return;
      }
      if (diceRemaining <= 0) return;
      onChange({
        ...value,
        healedHarmiIndices: [...value.healedHarmiIndices, harmiIndex],
      });
    };

    const handleClockDelta = (clockId: number, delta: 1 | -1) => {
      if (readOnly) return;
      const current = value.clockDice[clockId] ?? 0;
      const nextCount = current + delta;
      if (delta > 0 && diceRemaining <= 0) return;
      if (nextCount < 0) return;

      const nextClockDice = { ...value.clockDice };
      if (nextCount === 0) {
        delete nextClockDice[clockId];
      } else {
        nextClockDice[clockId] = nextCount;
      }

      onChange({
        ...value,
        clockDice: nextClockDice,
      });
    };

    const handlePrepDelta = (delta: 1 | -1) => {
      if (readOnly) return;
      const nextPrep = value.prepDice + delta;
      if (delta > 0 && diceRemaining <= 0) return;
      if (nextPrep < 0) return;
      onChange({
        ...value,
        prepDice: nextPrep,
      });
    };

    const renderClockGroup = (
      category: "tutkimus" | "projekti",
      heading: string,
      subtitle: string,
      items: DowntimeClockTarget[],
      createLabel: string,
    ) => (
      <HudPanel
        title={heading}
        statusSlot={
          !readOnly &&
          onCreateClock && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onCreateClock(category)}
            >
              <Icon name="plus" size={14} className="mr-1.5" aria-hidden="true" />
              {createLabel}
            </Button>
          )
        }
      >
        <div className="space-y-4">
          <Text variant="small" className="text-text-muted">
            {subtitle}
          </Text>
          {items.length === 0 ? (
            <div className="border border-dashed border-[var(--theme-border-soft)] p-4 text-center">
              <Text variant="muted" className="text-sm">
                Ei aktiivisia kelloja tässä luokassa.
              </Text>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((clock) => {
                const assigned = value.clockDice[clock.id] ?? 0;
                return (
                  <div
                    key={clock.id}
                    className={cn(
                      "flex flex-col tablet:flex-row tablet:items-center justify-between gap-4 border p-3.5 transition-colors",
                      assigned > 0
                        ? "border-[var(--theme-secondary)] bg-[color-mix(in_srgb,var(--theme-secondary)_8%,var(--theme-bg))]"
                        : "border-[var(--theme-border-soft)] bg-[var(--theme-surface-tint)]",
                    )}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <ProgressClock
                        segmentsTotal={clock.segmentsTotal}
                        segmentsFilled={clock.segmentsFilled}
                        pendingTicks={assigned}
                        category={clock.category}
                        size="sm"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading font-bold text-sm uppercase tracking-wide text-[var(--theme-text)]">
                            {clock.title}
                          </span>
                          <Badge variant={clock.scope === "ship" ? "outline" : "ghost"}>
                            {clock.scope === "ship" ? "Miehistö" : "Oma"}
                          </Badge>
                          {clock.roomLabel && <Badge variant="highlight">{clock.roomLabel}</Badge>}
                        </div>
                        {clock.description && (
                          <Text variant="small" className="text-text-muted">
                            {clock.description}
                          </Text>
                        )}
                        <div className="font-heading text-xs font-semibold tabular-nums text-text-muted">
                          {clock.segmentsTotal === null
                            ? `Odottaa mitoitusta (+${clock.segmentsFilled} kertynyt)`
                            : `${clock.segmentsFilled} / ${clock.segmentsTotal} osaa täynnä`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end tablet:self-center shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={readOnly || assigned <= 0}
                        onClick={() => handleClockDelta(clock.id, -1)}
                        aria-label={`Vähennä noppa kellosta ${clock.title}`}
                      >
                        -
                      </Button>
                      <div className="min-w-14 text-center font-heading text-sm font-bold tabular-nums text-[var(--theme-text)]">
                        {assigned}n20
                      </div>
                      <Button
                        type="button"
                        variant="solid"
                        size="sm"
                        disabled={readOnly || diceRemaining <= 0}
                        onClick={() => handleClockDelta(clock.id, 1)}
                        aria-label={`Lisää noppa kelloon ${clock.title}`}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </HudPanel>
    );

    return (
      <div ref={ref} data-theme={theme} className={cn("space-y-5 font-sans", className)} {...props}>
        <HeadingLevelProvider>
          {/* Pool overview & active dice tray */}
          <HudPanel
            variant={diceRemaining === 0 && totalAllocated === safeAvailable ? "accent" : "default"}
            title="Käytettävissä olevat nopat"
            statusSlot={
              <Badge variant={diceRemaining === 0 ? "solid" : "outline"} icon="dice5">
                {`${Math.max(0, diceRemaining)} vapaana / ${safeAvailable}`}
              </Badge>
            }
          >
            <div className="flex flex-col desktop:flex-row desktop:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {DICE_SLOT_KEYS.map((slotKey, idx) => {
                  const isLostToHarm = idx >= safeAvailable;
                  const isUnallocated = idx < Math.max(0, diceRemaining);

                  if (isLostToHarm) {
                    return (
                      <div
                        key={slotKey}
                        title="Poistettu käytöstä aktiivisen harmin vuoksi"
                        className="flex flex-col items-center justify-center w-14 h-14 px-1 border border-dashed border-[var(--theme-primary)] bg-[color-mix(in_srgb,var(--theme-primary)_10%,var(--theme-bg))]"
                      >
                        <Icon
                          name="alert-triangle"
                          size={16}
                          className="text-[var(--theme-primary)]"
                          aria-hidden="true"
                        />
                        <span className="font-heading text-xs font-semibold text-[var(--theme-primary)] leading-none mt-0.5">
                          Harmi
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={slotKey}
                      className={cn(
                        "flex items-center justify-center w-14 h-14 border transition-opacity",
                        isUnallocated
                          ? "border-[var(--theme-secondary)] bg-[color-mix(in_srgb,var(--theme-secondary)_12%,var(--theme-bg))]"
                          : "border-[var(--theme-border-soft)] bg-[var(--theme-surface-tint)] opacity-45",
                      )}
                    >
                      <DiceIcon faces={20} size="sm" active={isUnallocated} />
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1 text-left desktop:text-right">
                <Text variant="small" className="text-[var(--theme-text)]">
                  Väliaikaheitot tehdään pelkällä noppapoolilla (OK 13, ei ominaisuusnoppia).
                </Text>
                {harmPenaltyCount > 0 && (
                  <Text variant="small" className="text-[var(--theme-primary)]">
                    {`Aktiiviset harmit vähentävät poolista ${harmPenaltyCount}n20.`}
                  </Text>
                )}
                {diceRemaining < 0 && (
                  <Text variant="small" className="text-[var(--theme-primary)] font-semibold">
                    {`Luonnoksessa on ${Math.abs(diceRemaining)} ylimääräistä noppaa. Vähennä sijoituksia.`}
                  </Text>
                )}
              </div>
            </div>
          </HudPanel>

          {/* 1. Hahmon lepo */}
          <HudPanel
            title="Hahmon lepo"
            statusSlot={<Badge variant="outline">1n20 = 1 harmi (ei heittoa)</Badge>}
          >
            <div className="space-y-3">
              <Text variant="small" className="text-text-muted">
                Jokainen lepoon sijoitettu noppa parantaa yhden aktiivisen harmin automaattisesti.
                Parantunut harmi jää hahmon historiaan, mutta ei enää vähennä noppapoolia.
              </Text>
              {activeHarmit.length === 0 ? (
                <div className="border border-dashed border-[var(--theme-border-soft)] p-4">
                  <Text variant="muted" className="text-sm">
                    Hahmolla ei ole aktiivisia parannettavia harmeja.
                  </Text>
                </div>
              ) : (
                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
                  {activeHarmit.map((harmi) => {
                    const isSelected = value.healedHarmiIndices.includes(harmi.index);
                    const isDisabled = readOnly || (!isSelected && diceRemaining <= 0);
                    return (
                      <button
                        key={`harmi-${harmi.index}`}
                        type="button"
                        aria-pressed={isSelected}
                        disabled={isDisabled}
                        onClick={() => handleToggleHarmi(harmi.index)}
                        className={cn(
                          "w-full text-left border p-3.5 transition-all flex items-center justify-between gap-3 cursor-pointer",
                          isSelected
                            ? "border-[var(--theme-secondary)] bg-[color-mix(in_srgb,var(--theme-secondary)_14%,var(--theme-bg))]"
                            : "border-[var(--theme-border-medium)] bg-[var(--theme-surface-tint)] hover:border-[var(--theme-secondary)]",
                          isDisabled && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="font-heading text-xs uppercase tracking-widest text-[var(--theme-primary)]">
                            Aktiivinen harmi
                          </div>
                          <div className="text-sm font-semibold text-[var(--theme-text)] break-words">
                            {harmi.text}
                          </div>
                        </div>
                        <Badge variant={isSelected ? "solid" : "ghost"}>
                          {isSelected ? "1n20 -> Parantuu" : "Valitse (1n20)"}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </HudPanel>

          {/* 2. Tutkimus-kellot */}
          {renderClockGroup(
            "tutkimus",
            "Tutkimus-kellot",
            "Mysteerien, datalevyjen, löydösten ja ilmiöiden analysointi. Jokainen n20 tuloksella 13+ täyttää 1 osan; onnistuneet tuplat lisäävät +1 kriittisen osan.",
            researchClocks,
            "Uusi tutkimuskello",
          )}

          {/* 3. Projekti-kellot */}
          {renderClockGroup(
            "projekti",
            "Projekti-kellot",
            "Aluksen järjestelmien korjaus, varusteiden rakentaminen, verkostot ja harjoittelu. OK 13 + onnistuneet tuplat täyttävät kellon segmenttejä.",
            projectClocks,
            "Uusi projektikello",
          )}

          {/* 4. Keikkavalmistautuminen */}
          <HudPanel
            title="Keikkavalmistautuminen"
            statusSlot={<Badge variant="highlight">OK 13 + tuplat tulevaan jaksoon</Badge>}
          >
            <div className="space-y-4">
              <div className="flex flex-col tablet:flex-row tablet:items-center justify-between gap-4">
                <div className="space-y-1">
                  <Heading variant="h4">Valmistaudu lukittuun jaksoon</Heading>
                  <Text variant="small" className="text-text-muted">
                    Kerro lyhyesti, mihin valmistaudut ennen seuraavaa tehtävää. Osumat ja tuplat
                    tallentuvat pelinjohtajalle jakson alun hyödyksi.
                  </Text>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end tablet:self-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={readOnly || value.prepDice <= 0}
                    onClick={() => handlePrepDelta(-1)}
                    aria-label="Vähennä noppa keikkavalmistautumisesta"
                  >
                    -
                  </Button>
                  <div className="min-w-14 text-center font-heading text-sm font-bold tabular-nums text-[var(--theme-text)]">
                    {value.prepDice}n20
                  </div>
                  <Button
                    type="button"
                    variant="solid"
                    size="sm"
                    disabled={readOnly || diceRemaining <= 0}
                    onClick={() => handlePrepDelta(1)}
                    aria-label="Lisää noppa keikkavalmistautumiseen"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Valmistautumisen kohde</FieldLabel>
                <TextArea
                  rows={2}
                  disabled={readOnly}
                  placeholder="Esim. Tiedustelen kohteen telakan huoltotunnelit ja piilotan varapuvun..."
                  value={value.prepDescription}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      prepDescription: e.target.value,
                    })
                  }
                />
                {value.prepDice > 0 && value.prepDescription.trim().length === 0 && (
                  <Text variant="small" className="text-[var(--theme-primary)]">
                    Kirjoita lyhyt kuvaus valmistautumiselle ennen heiton vahvistamista.
                  </Text>
                )}
              </div>
            </div>
          </HudPanel>
        </HeadingLevelProvider>
      </div>
    );
  },
);

DowntimeAllocator.displayName = "DowntimeAllocator";
