import { Badge } from "@repo/ui/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { useMemo, useState } from "react";
import { type MonkPower, useMonkPowers } from "./api/monk-powers";

export interface MonkPowerPickerProps {
  characterPowers?: MonkPower[];
  selectedPowerId: number | null;
  onSelectPower: (power: MonkPower) => void;
}

export function MonkPowerPicker({
  characterPowers = [],
  selectedPowerId,
  onSelectPower,
}: MonkPowerPickerProps) {
  const { data: allPowers, isLoading, error } = useMonkPowers();
  const [selectedTierFilter, setSelectedTierFilter] = useState<number | "all">("all");

  const ownedPowerIds = useMemo(() => new Set(characterPowers.map((p) => p.id)), [characterPowers]);

  const tierCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const p of characterPowers) {
      counts.set(p.tier, (counts.get(p.tier) ?? 0) + 1);
    }
    return counts;
  }, [characterPowers]);

  const maxAvailableTier = useMemo(() => {
    let max = 1;
    for (let t = 2; t <= 8; t++) {
      const lowerCount = tierCounts.get(t - 1) ?? 0;
      const targetCount = tierCounts.get(t) ?? 0;
      if (lowerCount >= targetCount + 2) {
        max = t;
      } else {
        break;
      }
    }
    return max;
  }, [tierCounts]);

  const availablePowers = useMemo(() => {
    if (!allPowers) return [];
    const canAcquirePower = (power: MonkPower) => {
      if (ownedPowerIds.has(power.id)) return false;
      if (power.tier === 1) return true;
      const lowerCount = tierCounts.get(power.tier - 1) ?? 0;
      const targetCount = tierCounts.get(power.tier) ?? 0;
      return lowerCount >= targetCount + 2;
    };
    return allPowers.filter((p) => {
      if (ownedPowerIds.has(p.id)) return false;
      if (!canAcquirePower(p)) return false;
      if (selectedTierFilter !== "all" && p.tier !== selectedTierFilter) return false;
      return true;
    });
  }, [allPowers, ownedPowerIds, tierCounts, selectedTierFilter]);

  if (isLoading) {
    return <LoadingState message="Ladataan munkin voimia..." />;
  }

  if (error) {
    return (
      <NoticePanel variant="error">
        Voimien lataus epäonnistui. Yritä hetken kuluttua uudelleen.
      </NoticePanel>
    );
  }

  if (!allPowers || allPowers.length === 0) {
    return (
      <NoticePanel variant="info">
        Pelinjohtaja ei ole vielä luonut munkin voimia tietokantaan.
      </NoticePanel>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--theme-border-soft)] pb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs uppercase tracking-wider text-text-muted font-bold mr-1">
            Piiri:
          </span>
          <button
            type="button"
            onClick={() => setSelectedTierFilter("all")}
            className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
              selectedTierFilter === "all"
                ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] font-bold"
                : "bg-[var(--theme-bg)] text-text-muted hover:text-[var(--theme-text)] border border-[var(--theme-border-soft)]"
            }`}
          >
            Kaikki saatavilla
          </button>
          {Array.from({ length: maxAvailableTier }, (_, i) => i + 1).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTierFilter(tier)}
              className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
                selectedTierFilter === tier
                  ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] font-bold"
                  : "bg-[var(--theme-bg)] text-text-muted hover:text-[var(--theme-text)] border border-[var(--theme-border-soft)]"
              }`}
            >
              {tier}. piiri
            </button>
          ))}
        </div>
        <span className="text-xs text-text-muted">
          Korkein avoin piiri:{" "}
          <strong className="text-[var(--theme-text)]">{maxAvailableTier}. piiri</strong>
        </span>
      </div>

      <div className="text-xs text-text-muted italic">
        Pyramidisääntö: piiriltä N voi ottaa voiman vain, jos alemmalta piiriltä N-1 on riittävästi
        voimia.
      </div>

      {availablePowers.length === 0 ? (
        <p className="text-sm text-text-muted py-4 text-center">
          Ei valittavissa olevia voimia valitulla suodattimella.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {availablePowers.map((power) => {
            const isSelected = selectedPowerId === power.id;
            const propertyEntries = Object.entries(power.properties || {});

            return (
              <Card
                key={power.id}
                onClick={() => onSelectPower(power)}
                className={`cursor-pointer transition-all border ${
                  isSelected
                    ? "border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 shadow-md"
                    : "border-[var(--theme-border-soft)] hover:border-[var(--theme-secondary)]"
                }`}
              >
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CardTitle className="text-base font-bold">{power.name}</CardTitle>
                    <Badge variant="outline">{power.tier}. piiri</Badge>
                  </div>
                  {isSelected && <Badge variant="highlight-solid">Valittu</Badge>}
                </CardHeader>
                <CardContent className="py-2 px-4 space-y-2">
                  {power.description && (
                    <p className="text-xs text-text-muted whitespace-pre-wrap">
                      {power.description}
                    </p>
                  )}
                  {propertyEntries.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-[var(--theme-border-soft)]/50">
                      {propertyEntries.map(([key, val]) => (
                        <div
                          key={key}
                          className="text-[11px] bg-[var(--theme-bg)] border border-[var(--theme-border-soft)] px-2 py-0.5 rounded font-mono text-text-muted"
                        >
                          <span className="font-semibold text-[var(--theme-text)]">{key}:</span>{" "}
                          {String(val)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
