import {
  Badge,
  ConfirmDialog,
  ConsoleButton,
  ConsolePill,
  ConsoleRow,
  Icon,
  Select,
  Text,
} from "@repo/ui";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type MyShipCharacter,
  type ShipOverviewResponse,
  type ShipRoom,
  useClaimCabin,
} from "../api/ship";
import { type CabinWingSpec, formatCabinCode, getRoomStatusRowTone } from "./ship-zones";

export interface SectorPopupContentProps {
  wing: CabinWingSpec;
  overview: ShipOverviewResponse;
  basePath: string;
  isGm: boolean;
  onSelectCabinRoom: (room: ShipRoom) => void;
}

type WingFilter = "all" | "free" | "occupied";

function getOccupantInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Sector cabin selector inside `ConsoleSheet`: 2D corridor layout grid plus filterable cabin list.
 */
export function SectorPopupContent({
  wing,
  overview,
  basePath,
  isGm,
  onSelectCabinRoom,
}: SectorPopupContentProps) {
  const navigate = useNavigate();
  const claimMutation = useClaimCabin();

  const [filter, setFilter] = useState<WingFilter>("all");
  const [focusedCabinKey, setFocusedCabinKey] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    () => overview.myCharacters[0]?.id ?? null,
  );
  const [moveConfirmRoom, setMoveConfirmRoom] = useState<ShipRoom | null>(null);

  const wingCabins = useMemo(
    () =>
      overview.rooms
        .filter((room) => room.kind === "cabin" && room.svgZoneId === wing.wingId)
        .sort((a, b) => a.orderIndex - b.orderIndex || a.key.localeCompare(b.key)),
    [overview.rooms, wing.wingId],
  );

  const activeCharacter: MyShipCharacter | null = useMemo(() => {
    if (overview.myCharacters.length === 0) return null;
    return (
      overview.myCharacters.find((c) => c.id === selectedCharacterId) ?? overview.myCharacters[0]
    );
  }, [overview.myCharacters, selectedCharacterId]);

  const filteredCabins = useMemo(() => {
    const baseList =
      filter === "free"
        ? wingCabins.filter((c) => !c.occupant && !c.isLocked)
        : filter === "occupied"
          ? wingCabins.filter((c) => Boolean(c.occupant))
          : wingCabins;
    if (!focusedCabinKey) return baseList;
    const focused = baseList.find((c) => c.key === focusedCabinKey);
    if (!focused) return baseList;
    return [focused, ...baseList.filter((c) => c.key !== focusedCabinKey)];
  }, [filter, focusedCabinKey, wingCabins]);

  const splitIndex = Math.ceil(wingCabins.length / 2);
  const portCabins = wingCabins.slice(0, splitIndex);
  const starboardCabins = wingCabins.slice(splitIndex);

  const occupiedCount = wingCabins.filter((c) => Boolean(c.occupant)).length;
  const freeCount = wingCabins.filter((c) => !c.occupant && !c.isLocked).length;

  const handleRequestClaim = (room: ShipRoom) => {
    if (!activeCharacter) return;
    if (activeCharacter.claimedRoom && activeCharacter.claimedRoom.key !== room.key) {
      setMoveConfirmRoom(room);
      return;
    }
    claimMutation.mutate({ key: room.key, characterId: activeCharacter.id });
  };

  const renderCorridorCell = (cabin: ShipRoom) => {
    const code = formatCabinCode(cabin.key);
    const isOwn = Boolean(cabin.occupant?.isOwn);
    const isOccupied = Boolean(cabin.occupant);
    const isFocused = focusedCabinKey === cabin.key;

    return (
      <button
        key={cabin.key}
        type="button"
        onClick={() => setFocusedCabinKey((prev) => (prev === cabin.key ? null : cabin.key))}
        aria-pressed={isFocused}
        aria-label={`${cabin.cabinCustomTitle || cabin.name}: ${
          cabin.occupant ? cabin.occupant.name : cabin.isLocked ? "Lukittu" : "Vapaa"
        }`}
        className={[
          "min-h-11 px-1.5 py-1.5 rounded-[3px] border text-center transition-colors cursor-pointer",
          "flex flex-col items-center justify-center gap-1 font-heading text-xs font-semibold tabular-nums",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)]",
          isOwn
            ? "border-[var(--theme-dawn)] bg-[color-mix(in_srgb,var(--theme-dawn)_20%,var(--theme-bg))] text-[var(--theme-text)] font-bold"
            : isOccupied
              ? "border-[var(--theme-secondary)] bg-[color-mix(in_srgb,var(--theme-secondary)_18%,var(--theme-bg))] text-[var(--theme-text)]"
              : cabin.isLocked
                ? "border-dashed border-[var(--theme-border-soft)] bg-[var(--theme-bg)] text-text-muted"
                : "border-[var(--theme-border-soft)] bg-[var(--theme-bg)] text-text-muted hover:border-[var(--theme-secondary)] hover:text-[var(--theme-text)]",
          isFocused ? "ring-2 ring-[var(--theme-secondary)]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="leading-none">{code}</span>
        {cabin.occupant ? (
          <span
            className={`font-sans text-xs leading-none font-semibold ${
              isOwn ? "text-[var(--theme-dawn-muted)]" : "text-[var(--theme-secondary)]"
            }`}
          >
            {getOccupantInitials(cabin.occupant.name)}
          </span>
        ) : cabin.isLocked ? (
          <Icon name="lock" size={12} aria-hidden="true" />
        ) : (
          <span className="font-sans text-xs text-text-muted leading-none">Vapaa</span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      {/* Character switcher for claiming cabins */}
      {overview.myCharacters.length > 1 && (
        <Select
          size="compact"
          label="Varaava hahmo"
          value={activeCharacter ? String(activeCharacter.id) : ""}
          onChange={(e) => setSelectedCharacterId(Number(e.target.value))}
          options={overview.myCharacters.map((c) => ({
            value: String(c.id),
            label: `${c.name}${c.claimedRoom ? ` (${c.claimedRoom.name})` : ""}`,
          }))}
        />
      )}

      {/* Compact 2D corridor schematic */}
      <div className="border border-[var(--theme-border-soft)] rounded-[4px] p-2.5 bg-[color-mix(in_srgb,var(--theme-bg)_92%,var(--theme-surface-tint))] space-y-2">
        <div
          className={`grid gap-1.5 ${
            wing.cols === 3 ? "grid-cols-3" : wing.cols === 5 ? "grid-cols-5" : "grid-cols-6"
          }`}
        >
          {portCabins.map(renderCorridorCell)}
        </div>

        <div className="py-1.5 border-y border-dashed border-[var(--theme-border-soft)] text-center font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
          Käytävä
        </div>

        <div
          className={`grid gap-1.5 ${
            wing.cols === 3 ? "grid-cols-3" : wing.cols === 5 ? "grid-cols-5" : "grid-cols-6"
          }`}
        >
          {starboardCabins.map(renderCorridorCell)}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <ConsolePill active={filter === "all"} onClick={() => setFilter("all")}>
            {`Kaikki (${wingCabins.length})`}
          </ConsolePill>
          <ConsolePill active={filter === "free"} onClick={() => setFilter("free")}>
            {`Vapaat (${freeCount})`}
          </ConsolePill>
          <ConsolePill active={filter === "occupied"} onClick={() => setFilter("occupied")}>
            {`Varatut (${occupiedCount})`}
          </ConsolePill>
        </div>

        {focusedCabinKey && (
          <ConsoleButton variant="ghost" size="compact" onClick={() => setFocusedCabinKey(null)}>
            Näytä järjestys
          </ConsoleButton>
        )}
      </div>

      {/* Filterable cabin rows */}
      {filteredCabins.length === 0 ? (
        <div className="border border-dashed border-[var(--theme-border-soft)] p-4 text-center rounded-[4px]">
          <Text variant="muted" className="text-sm">
            Tällä suodatuksella ei ole hyttejä tässä siivessä.
          </Text>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filteredCabins.map((room) => {
            const code = formatCabinCode(room.key);
            const isOwn = Boolean(room.occupant?.isOwn);
            const canClaim = Boolean(!room.occupant && (!room.isLocked || isGm) && activeCharacter);

            return (
              <ConsoleRow
                key={room.key}
                code={code}
                title={room.cabinCustomTitle || room.name}
                subtitle={
                  room.occupant
                    ? `${room.occupant.name}, ${room.occupant.archetype}`
                    : room.isLocked
                      ? "Lukittu osasto"
                      : "Vapaa asuinhuone"
                }
                statusTone={getRoomStatusRowTone({
                  isLocked: room.isLocked,
                  statusTone: room.statusTone,
                  isOwn,
                })}
                badge={
                  isOwn ? (
                    <Badge variant="highlight">Oma hytti</Badge>
                  ) : room.occupant ? (
                    <Badge variant="outline">Varattu</Badge>
                  ) : room.isLocked ? (
                    <Badge variant="outline">Lukittu</Badge>
                  ) : undefined
                }
                actions={
                  <div className="flex items-center gap-1.5">
                    {room.occupant && (
                      <ConsoleButton
                        variant="outline"
                        size="compact"
                        onClick={() => navigate(`${basePath}/hytti/${room.occupant?.characterId}`)}
                      >
                        Avaa hytti
                      </ConsoleButton>
                    )}
                    {canClaim && !room.isLocked && (
                      <ConsoleButton
                        variant="primary"
                        size="compact"
                        loading={claimMutation.isPending}
                        onClick={() => handleRequestClaim(room)}
                      >
                        Varaa
                      </ConsoleButton>
                    )}
                    <ConsoleButton
                      variant="ghost"
                      size="compact"
                      onClick={() => onSelectCabinRoom(room)}
                    >
                      Tiedot
                    </ConsoleButton>
                  </div>
                }
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(moveConfirmRoom)}
        onOpenChange={(open) => {
          if (!open) setMoveConfirmRoom(null);
        }}
        title="Vaihda hyttiä?"
        description={
          activeCharacter && moveConfirmRoom
            ? `${activeCharacter.name} muuttaa pois hytistä ${
                activeCharacter.claimedRoom?.name ?? ""
              } hyttiin ${moveConfirmRoom.name}. Sisustus ja omistukset siirtyvät mukana.`
            : ""
        }
        confirmLabel="Siirry hyttiin"
        cancelLabel="Peruuta"
        onConfirm={() => {
          if (activeCharacter && moveConfirmRoom) {
            claimMutation.mutate({
              key: moveConfirmRoom.key,
              characterId: activeCharacter.id,
            });
          }
        }}
      />
    </div>
  );
}
