import {
  Badge,
  Checkbox,
  ConfirmDialog,
  ConsoleButton,
  ConsolePill,
  ConsoleRow,
  Input,
  MarkdownRenderer,
  NoticePanel,
  ObscuredWrapper,
  ProgressClock,
  Select,
  Text,
  TextArea,
} from "@repo/ui";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type MyShipCharacter,
  type ShipOverviewResponse,
  type ShipRoom,
  type ShipRoomStatusTone,
  useClaimCabin,
  useUpdateShipRoom,
  useVacateCabin,
} from "../api/ship";
import { getRoomStatusPillTone } from "./ship-zones";

export interface RoomInspectorContentProps {
  room: ShipRoom;
  overview: ShipOverviewResponse;
  basePath: string;
  isGm: boolean;
  focusedDeck?: number | null;
  onFocusDeck?: (deckNumber: number) => void;
  onBackToWing?: () => void;
}

/**
 * Room/compartment telemetry inspector rendered inside `ConsoleSheet`.
 */
export function RoomInspectorContent({
  room,
  overview,
  basePath,
  isGm,
  focusedDeck,
  onFocusDeck,
  onBackToWing,
}: RoomInspectorContentProps) {
  const navigate = useNavigate();
  const claimMutation = useClaimCabin();
  const vacateMutation = useVacateCabin();
  const updateRoomMutation = useUpdateShipRoom();

  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    () => overview.myCharacters[0]?.id ?? null,
  );
  const [confirmMoveOpen, setConfirmMoveOpen] = useState(false);
  const [confirmVacateOpen, setConfirmVacateOpen] = useState(false);

  const [editingRoomKey, setEditingRoomKey] = useState<string | null>(null);
  const isEditing = editingRoomKey === room.key;
  const [editName, setEditName] = useState(room.name);
  const [editSubtitle, setEditSubtitle] = useState(room.subtitle ?? "");
  const [editStatusTone, setEditStatusTone] = useState<ShipRoomStatusTone>(room.statusTone);
  const [editStatusLabel, setEditStatusLabel] = useState(room.statusLabel);
  const [editIsLocked, setEditIsLocked] = useState(room.isLocked);
  const [editDescription, setEditDescription] = useState(room.description);
  const [editGmNotes, setEditGmNotes] = useState(room.gmRoomNotes ?? "");

  useEffect(() => {
    setEditName(room.name);
    setEditSubtitle(room.subtitle ?? "");
    setEditStatusTone(room.statusTone);
    setEditStatusLabel(room.statusLabel);
    setEditIsLocked(room.isLocked);
    setEditDescription(room.description);
    setEditGmNotes(room.gmRoomNotes ?? "");
  }, [
    room.description,
    room.gmRoomNotes,
    room.isLocked,
    room.name,
    room.statusLabel,
    room.statusTone,
    room.subtitle,
  ]);

  const activeCharacter: MyShipCharacter | null = useMemo(() => {
    if (overview.myCharacters.length === 0) return null;
    return (
      overview.myCharacters.find((c) => c.id === selectedCharacterId) ?? overview.myCharacters[0]
    );
  }, [overview.myCharacters, selectedCharacterId]);

  const linkedClocks = useMemo(
    () =>
      overview.clocks.filter((clock) => clock.roomKey === room.key && clock.status !== "archived"),
    [overview.clocks, room.key],
  );

  const isOwnOccupiedCabin = Boolean(
    room.kind === "cabin" &&
      room.occupant &&
      overview.myCharacters.some((c) => c.id === room.occupant?.characterId),
  );

  const revealed = !room.isLocked || isGm;

  const handleClaim = () => {
    if (!activeCharacter) return;
    if (activeCharacter.claimedRoom && activeCharacter.claimedRoom.key !== room.key) {
      setConfirmMoveOpen(true);
      return;
    }
    claimMutation.mutate({ key: room.key, characterId: activeCharacter.id });
  };

  return (
    <div className="space-y-3.5">
      {(onBackToWing || (onFocusDeck && focusedDeck !== room.deckNumber) || isGm) && (
        <div className="flex flex-wrap items-center gap-2">
          {onBackToWing && (
            <ConsoleButton
              variant="ghost"
              size="compact"
              iconLeft="chevron-left"
              onClick={onBackToWing}
            >
              Takaisin siipeen
            </ConsoleButton>
          )}
          {onFocusDeck && focusedDeck !== room.deckNumber && (
            <ConsoleButton
              variant="outline"
              size="compact"
              iconLeft="compass"
              onClick={() => onFocusDeck(room.deckNumber)}
            >
              {`Näytä kansi ${room.deckNumber}`}
            </ConsoleButton>
          )}
          {isGm && (
            <ConsoleButton
              variant="outline"
              size="compact"
              iconLeft="pencil"
              onClick={() => setEditingRoomKey((prev) => (prev === room.key ? null : room.key))}
            >
              {isEditing ? "Sulje muokkaus" : "Muokkaa osastoa"}
            </ConsoleButton>
          )}
        </div>
      )}

      {/* Telemetry pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <ConsolePill tone={getRoomStatusPillTone(room)} icon={room.isLocked ? "lock" : undefined}>
          {room.statusLabel}
        </ConsolePill>
        {room.occupant && (
          <ConsolePill tone={room.occupant.isOwn ? "accent" : "secondary"}>
            {`Asukas: ${room.occupant.name}`}
          </ConsolePill>
        )}
      </div>

      {/* Inline GM room editor */}
      {isGm && isEditing && (
        <div className="border border-[var(--theme-cockpit-border)] rounded-[4px] p-3 bg-[var(--theme-cockpit-elevated)] space-y-2.5">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Input
              size="compact"
              label="Osaston nimi"
              aria-label="Osaston nimi"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Input
              size="compact"
              label="Alaotsikko"
              aria-label="Alaotsikko"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Select
              size="compact"
              label="Tilaväri"
              aria-label="Tilaväri"
              value={editStatusTone}
              onChange={(e) => setEditStatusTone(e.target.value as ShipRoomStatusTone)}
              options={[
                { value: "normal", label: "Normaali (petroli)" },
                { value: "warning", label: "Varoitus (meripihka)" },
                { value: "critical", label: "Kriittinen (punainen)" },
                { value: "locked", label: "Lukittu (sininen)" },
              ]}
            />
            <Input
              size="compact"
              label="Tilateksti"
              aria-label="Tilateksti"
              value={editStatusLabel}
              onChange={(e) => setEditStatusLabel(e.target.value)}
            />
          </div>
          <Checkbox
            label="Lukittu pelaajilta"
            checked={editIsLocked}
            onChange={(e) => setEditIsLocked(e.target.checked)}
          />
          <TextArea
            size="compact"
            rows={3}
            label="Kuvaus"
            aria-label="Kuvaus"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <TextArea
            size="compact"
            rows={2}
            label="Pelinjohtajan salaiset huomiot"
            aria-label="Pelinjohtajan salaiset huomiot"
            value={editGmNotes}
            onChange={(e) => setEditGmNotes(e.target.value)}
          />
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <ConsoleButton
              variant="ghost"
              size="compact"
              onClick={() => {
                setEditName(room.name);
                setEditSubtitle(room.subtitle ?? "");
                setEditStatusTone(room.statusTone);
                setEditStatusLabel(room.statusLabel);
                setEditIsLocked(room.isLocked);
                setEditDescription(room.description);
                setEditGmNotes(room.gmRoomNotes ?? "");
                setEditingRoomKey(null);
              }}
            >
              Peruuta
            </ConsoleButton>
            <ConsoleButton
              variant="primary"
              size="compact"
              loading={updateRoomMutation.isPending}
              disabled={!editName.trim() || !editStatusLabel.trim()}
              onClick={() =>
                updateRoomMutation.mutate(
                  {
                    key: room.key,
                    name: editName.trim(),
                    subtitle: editSubtitle.trim() || null,
                    statusTone: editStatusTone,
                    statusLabel: editStatusLabel.trim(),
                    isLocked: editIsLocked,
                    description: editDescription.trim() || room.description,
                    gmRoomNotes: editGmNotes.trim() || null,
                  },
                  { onSuccess: () => setEditingRoomKey(null) },
                )
              }
            >
              Tallenna osasto
            </ConsoleButton>
          </div>
        </div>
      )}

      {/* Explicit warning banner for sealed rooms */}
      {room.isLocked && !isGm && (
        <NoticePanel variant="error" title="Pääsy estetty">
          <Text variant="small">
            Osaston laipio on lukittu komentotasolta. Pelinjohtaja voi avata osaston tai jakaa
            tietoja myöhemmin.
          </Text>
        </NoticePanel>
      )}

      {/* Room details with ObscuredWrapper for sealed rooms */}
      <ObscuredWrapper revealed={revealed}>
        <div className="space-y-3">
          <div className="text-sm leading-relaxed text-[var(--theme-text)]">
            <MarkdownRenderer>{room.description}</MarkdownRenderer>
          </div>

          {room.cabinDecoration && (
            <div className="border-t border-[var(--theme-border-soft)] pt-3 space-y-1.5">
              <div className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Sisustus ja tunnelma
              </div>
              <MarkdownRenderer>{room.cabinDecoration}</MarkdownRenderer>
            </div>
          )}

          {isGm && room.gmRoomNotes && (
            <div className="border border-dashed border-[var(--theme-accent)] p-3 rounded-[4px] bg-[color-mix(in_srgb,var(--theme-accent)_8%,var(--theme-bg))] space-y-1">
              <div className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)]">
                Pelinjohtajan salaiset huomiot
              </div>
              <Text variant="small">{room.gmRoomNotes}</Text>
            </div>
          )}
        </div>
      </ObscuredWrapper>

      {/* Cabin occupation / management actions */}
      {room.kind === "cabin" && (
        <div className="border-t border-[var(--theme-border-soft)] pt-3 space-y-2.5">
          {room.occupant ? (
            <div className="flex flex-wrap items-center gap-2">
              <ConsoleButton
                variant="primary"
                iconRight="arrow-right"
                onClick={() => navigate(`${basePath}/hytti/${room.occupant?.characterId}`)}
              >
                Avaa hytin näkymä
              </ConsoleButton>
              {isOwnOccupiedCabin && (
                <ConsoleButton
                  variant="danger"
                  loading={vacateMutation.isPending}
                  onClick={() => setConfirmVacateOpen(true)}
                >
                  Luovu hytistä
                </ConsoleButton>
              )}
            </div>
          ) : !room.isLocked && activeCharacter ? (
            <div className="space-y-2.5">
              {overview.myCharacters.length > 1 && (
                <Select
                  size="compact"
                  label="Varaa hahmolle"
                  value={String(activeCharacter.id)}
                  onChange={(e) => setSelectedCharacterId(Number(e.target.value))}
                  options={overview.myCharacters.map((c) => ({
                    value: String(c.id),
                    label: `${c.name}${c.claimedRoom ? ` (${c.claimedRoom.name})` : ""}`,
                  }))}
                />
              )}
              <ConsoleButton
                variant="primary"
                loading={claimMutation.isPending}
                onClick={handleClaim}
              >
                Varaa tämä hytti
              </ConsoleButton>
            </div>
          ) : null}
        </div>
      )}

      {/* Linked active clocks */}
      {linkedClocks.length > 0 && (
        <div className="border-t border-[var(--theme-border-soft)] pt-3 space-y-2">
          <div className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
            Osaston aktiiviset kellot
          </div>
          {linkedClocks.map((clock) => (
            <ConsoleRow
              key={clock.id}
              title={clock.title}
              subtitle={clock.description || undefined}
              statusTone={clock.status === "completed" ? "active" : "normal"}
              leading={
                <ProgressClock
                  segmentsTotal={clock.segmentsTotal}
                  segmentsFilled={clock.segmentsFilled}
                  category={clock.category}
                  size="sm"
                />
              }
              badge={
                <Badge variant={clock.category === "tutkimus" ? "highlight" : "outline"}>
                  {clock.category === "tutkimus" ? "Tutkimus" : "Projekti"}
                </Badge>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmMoveOpen}
        onOpenChange={setConfirmMoveOpen}
        title="Vaihda hyttiä?"
        description={
          activeCharacter
            ? `${activeCharacter.name} vapauttaa hytin ${
                activeCharacter.claimedRoom?.name ?? ""
              } ja siirtyy hyttiin ${room.name}.`
            : ""
        }
        confirmLabel="Siirry hyttiin"
        cancelLabel="Peruuta"
        onConfirm={() => {
          if (activeCharacter) {
            claimMutation.mutate({ key: room.key, characterId: activeCharacter.id });
          }
        }}
      />

      <ConfirmDialog
        open={confirmVacateOpen}
        onOpenChange={setConfirmVacateOpen}
        title="Luovu hytistä?"
        description="Hytin omistukset säilyvät hahmollasi, mutta hytti vapautuu muiden käyttöön."
        confirmLabel="Luovu hytistä"
        cancelLabel="Peruuta"
        variant="danger"
        onConfirm={() => {
          vacateMutation.mutate(room.key);
        }}
      />
    </div>
  );
}
