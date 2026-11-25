import {
  Badge,
  Checkbox,
  ConfirmDialog,
  ConsoleButton,
  ConsolePill,
  ConsoleRow,
  ConsoleSheet,
  Dialog,
  Input,
  ProgressClock,
  type ProgressClockSegments,
  Select,
  Text,
  TextArea,
} from "@repo/ui";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  SHIP_THEME_OPTIONS,
  type ShipClock,
  type ShipOverviewResponse,
  type ShipRoom,
  type ShipRoomKind,
  type ShipRoomStatusTone,
  useCreateShipClock,
  useCreateShipRoom,
  useDeleteShipClock,
  useUpdateShipClock,
  useUpdateShipConfig,
  useUpdateShipRoom,
} from "../api/ship";
import {
  CABIN_WINGS,
  DECK_SPECS,
  formatCabinCode,
  getRoomStatusPillTone,
  getRoomStatusRowTone,
} from "./ship-zones";

function slugifyRoomKey(name: string, existingKeys: string[]): string {
  const base =
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "osasto";
  const taken = new Set(existingKeys.map((k) => k.toLowerCase()));
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}

export interface GmCommandSheetContentProps {
  overview: ShipOverviewResponse;
  basePath: string;
  isGm: boolean;
  onClose?: () => void;
}

type CommandTab = "config" | "clocks" | "rooms";

const SEGMENT_CHOICES: ProgressClockSegments[] = [4, 6, 8, 10, 12];

function ClockAdminItem({
  clock,
  rooms,
  crewCharacters,
}: {
  clock: ShipClock;
  rooms: ShipRoom[];
  crewCharacters: ShipOverviewResponse["crewCharacters"];
}) {
  const updateClockMutation = useUpdateShipClock();
  const deleteClockMutation = useDeleteShipClock();

  const [expanded, setExpanded] = useState(false);
  const [titleDraft, setTitleDraft] = useState(clock.title);
  const [descDraft, setDescDraft] = useState(clock.description ?? "");
  const [categoryDraft, setCategoryDraft] = useState<"tutkimus" | "projekti">(clock.category);
  const [scopeDraft, setScopeDraft] = useState<"ship" | "character">(clock.scope);
  const [characterIdDraft, setCharacterIdDraft] = useState<string>(
    clock.characterId ? String(clock.characterId) : "",
  );
  const [roomKeyDraft, setRoomKeyDraft] = useState<string>(clock.roomKey ?? "");
  const [segmentsTotalDraft, setSegmentsTotalDraft] = useState<string>(
    clock.segmentsTotal !== null ? String(clock.segmentsTotal) : "",
  );
  const [notesDraft, setNotesDraft] = useState(clock.completionNotes ?? "");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    setTitleDraft(clock.title);
    setDescDraft(clock.description ?? "");
    setCategoryDraft(clock.category);
    setScopeDraft(clock.scope);
    setCharacterIdDraft(clock.characterId ? String(clock.characterId) : "");
    setRoomKeyDraft(clock.roomKey ?? "");
    setSegmentsTotalDraft(clock.segmentsTotal !== null ? String(clock.segmentsTotal) : "");
    setNotesDraft(clock.completionNotes ?? "");
  }, [
    clock.category,
    clock.characterId,
    clock.completionNotes,
    clock.description,
    clock.roomKey,
    clock.scope,
    clock.segmentsTotal,
    clock.title,
  ]);

  return (
    <div className="border border-[var(--theme-border-soft)] rounded-[4px] p-2.5 bg-[color-mix(in_srgb,var(--theme-bg)_92%,var(--theme-surface-tint))] space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <ProgressClock
            segmentsTotal={clock.segmentsTotal}
            segmentsFilled={clock.segmentsFilled}
            category={clock.category}
            size="sm"
          />
          <div className="min-w-0 space-y-0.5">
            <div className="text-xs font-bold text-[var(--theme-text)] truncate">{clock.title}</div>
            {clock.description && (
              <div className="text-xs text-text-muted line-clamp-2">{clock.description}</div>
            )}
            <div className="flex flex-wrap items-center gap-1">
              <Badge variant={clock.category === "tutkimus" ? "highlight" : "outline"}>
                {clock.category === "tutkimus" ? "Tutkimus" : "Projekti"}
              </Badge>
              <Badge variant="outline">
                {clock.scope === "ship" ? "Miehistö" : clock.characterName || "Hahmo"}
              </Badge>
            </div>
            <div className="font-heading text-xs font-semibold tabular-nums text-text-muted">
              {clock.segmentsTotal === null
                ? `Odottaa mitoitusta (+${clock.segmentsFilled})`
                : `${clock.segmentsFilled}/${clock.segmentsTotal} osaa`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ConsoleButton
            variant="ghost"
            size="compact"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Piilota" : "Muokkaa"}
          </ConsoleButton>
          <ConsoleButton
            variant="danger"
            size="compact"
            disabled={deleteClockMutation.isPending}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Poista
          </ConsoleButton>
        </div>
      </div>

      {/* Calibration or segment steppers */}
      {clock.segmentsTotal === null ? (
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-heading text-xs font-semibold uppercase text-text-muted mr-1">
            Mitoita:
          </span>
          {SEGMENT_CHOICES.map((seg) => (
            <ConsoleButton
              key={seg}
              variant="outline"
              size="compact"
              onClick={() =>
                updateClockMutation.mutate({
                  id: clock.id,
                  segmentsTotal: seg,
                })
              }
            >
              {`${seg}`}
            </ConsoleButton>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <ConsoleButton
              variant="outline"
              size="compact"
              disabled={clock.segmentsFilled <= 0}
              onClick={() =>
                updateClockMutation.mutate({
                  id: clock.id,
                  segmentsFilled: Math.max(0, clock.segmentsFilled - 1),
                })
              }
            >
              -1
            </ConsoleButton>
            <ConsoleButton
              variant="outline"
              size="compact"
              onClick={() =>
                updateClockMutation.mutate({
                  id: clock.id,
                  segmentsFilled: clock.segmentsFilled + 1,
                })
              }
            >
              +1
            </ConsoleButton>
          </div>

          <Select
            size="compact"
            aria-label={`${clock.title} tila`}
            value={clock.status}
            onChange={(e) =>
              updateClockMutation.mutate({
                id: clock.id,
                status: e.target.value as ShipClock["status"],
              })
            }
            options={[
              { value: "active", label: "Käynnissä" },
              { value: "completed", label: "Valmis" },
              { value: "archived", label: "Arkistoitu" },
            ]}
          />
        </div>
      )}

      {expanded && (
        <div className="space-y-2 pt-2 border-t border-[var(--theme-border-soft)]">
          <Input
            label="Kellon nimi"
            aria-label={`${clock.title} nimi`}
            size="compact"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
          />
          <TextArea
            label="Kuvaus"
            aria-label={`${clock.title} kuvaus`}
            size="compact"
            rows={2}
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
            placeholder="Mitä kellon täyttyminen saa aikaan?"
          />
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Select
              label="Kategoria"
              aria-label={`${clock.title} kategoria`}
              size="compact"
              value={categoryDraft}
              onChange={(e) => setCategoryDraft(e.target.value as "tutkimus" | "projekti")}
              options={[
                { value: "tutkimus", label: "Tutkimus" },
                { value: "projekti", label: "Projekti" },
              ]}
            />
            <Select
              label="Laajuus"
              aria-label={`${clock.title} laajuus`}
              size="compact"
              value={scopeDraft}
              onChange={(e) => {
                const next = e.target.value as "ship" | "character";
                setScopeDraft(next);
                if (next === "ship") setCharacterIdDraft("");
              }}
              options={[
                { value: "ship", label: "Koko miehistön yhteinen" },
                { value: "character", label: "Hahmon oma" },
              ]}
            />
          </div>
          {scopeDraft === "character" && (
            <Select
              label="Hahmo"
              aria-label={`${clock.title} hahmo`}
              size="compact"
              value={characterIdDraft}
              onChange={(e) => setCharacterIdDraft(e.target.value)}
              options={[
                { value: "", label: "Valitse hahmo..." },
                ...crewCharacters.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                })),
              ]}
            />
          )}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Select
              label="Liitetty osasto"
              aria-label={`${clock.title} osasto`}
              size="compact"
              value={roomKeyDraft}
              onChange={(e) => setRoomKeyDraft(e.target.value)}
              options={[
                { value: "", label: "Ei rajattu osastoon" },
                ...rooms
                  .filter((r) => r.kind !== "cabin")
                  .map((r) => ({
                    value: r.key,
                    label: `K0${r.deckNumber}: ${r.name}`,
                  })),
              ]}
            />
            <Select
              label="Osioiden määrä"
              aria-label={`${clock.title} koko`}
              size="compact"
              value={segmentsTotalDraft}
              onChange={(e) => setSegmentsTotalDraft(e.target.value)}
              options={[
                ...(clock.segmentsTotal === null
                  ? [{ value: "", label: "Odottaa mitoitusta" }]
                  : []),
                ...SEGMENT_CHOICES.map((seg) => ({
                  value: String(seg),
                  label: `${seg} osaa`,
                })),
              ]}
            />
          </div>
          <TextArea
            label="Valmistumisen huomio / palkinto (PJ)"
            aria-label={`${clock.title} palkinto`}
            size="compact"
            rows={2}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Mitä kellon täyttyminen tuo peliin?"
          />
          <div className="flex justify-end">
            <ConsoleButton
              variant="primary"
              size="compact"
              loading={updateClockMutation.isPending}
              disabled={!titleDraft.trim()}
              onClick={() =>
                updateClockMutation.mutate({
                  id: clock.id,
                  title: titleDraft.trim(),
                  description: descDraft.trim(),
                  category: categoryDraft,
                  scope: scopeDraft,
                  characterId:
                    scopeDraft === "character" && characterIdDraft
                      ? Number(characterIdDraft)
                      : null,
                  roomKey: roomKeyDraft || null,
                  ...(segmentsTotalDraft
                    ? { segmentsTotal: Number(segmentsTotalDraft) as ProgressClockSegments }
                    : {}),
                  completionNotes: notesDraft.trim() || null,
                })
              }
            >
              Tallenna kello
            </ConsoleButton>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Poista kello?"
        description={`Poistetaanko "${clock.title}" pysyvästi?`}
        confirmLabel="Poista"
        cancelLabel="Peruuta"
        variant="danger"
        onConfirm={() => deleteClockMutation.mutate(clock.id)}
      />
    </div>
  );
}

function RoomAdminItem({
  room,
  crewCharacters,
}: {
  room: ShipRoom;
  crewCharacters: ShipOverviewResponse["crewCharacters"];
}) {
  const updateRoomMutation = useUpdateShipRoom();
  const [name, setName] = useState(room.name);
  const [subtitle, setSubtitle] = useState(room.subtitle ?? "");
  const [description, setDescription] = useState(room.description);
  const [statusLabel, setStatusLabel] = useState(room.statusLabel);
  const [gmNotes, setGmNotes] = useState(room.gmRoomNotes ?? "");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setName(room.name);
    setSubtitle(room.subtitle ?? "");
    setDescription(room.description);
    setStatusLabel(room.statusLabel);
    setGmNotes(room.gmRoomNotes ?? "");
  }, [room.description, room.gmRoomNotes, room.name, room.statusLabel, room.subtitle]);

  return (
    <ConsoleRow
      code={room.kind === "cabin" ? formatCabinCode(room.key) : undefined}
      title={room.name}
      subtitle={`Kansi ${room.deckNumber}${room.subtitle ? ` · ${room.subtitle}` : ""}${room.occupant ? ` · Asukas: ${room.occupant.name}` : ""}`}
      statusTone={getRoomStatusRowTone(room)}
      badge={
        <ConsolePill tone={getRoomStatusPillTone(room)} icon={room.isLocked ? "lock" : undefined}>
          {room.statusLabel}
        </ConsolePill>
      }
      actions={
        <div className="flex flex-wrap items-center gap-1.5">
          <ConsoleButton
            variant={room.isLocked ? "primary" : "outline"}
            size="compact"
            onClick={() =>
              updateRoomMutation.mutate({
                key: room.key,
                isLocked: !room.isLocked,
              })
            }
          >
            {room.isLocked ? "Avaa" : "Lukitse"}
          </ConsoleButton>
          <ConsoleButton
            variant="ghost"
            size="compact"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Piilota" : "Muokkaa"}
          </ConsoleButton>
        </div>
      }
    >
      {expanded && (
        <div className="space-y-2 pt-2 border-t border-[var(--theme-border-soft)]">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Input
              label="Osaston nimi"
              aria-label={`${room.name} osaston nimi`}
              size="compact"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Alaotsikko"
              aria-label={`${room.name} alaotsikko`}
              size="compact"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Select
              size="compact"
              label="Tilaväri"
              aria-label={`${room.name} tilaväri`}
              value={room.statusTone}
              onChange={(e) =>
                updateRoomMutation.mutate({
                  key: room.key,
                  statusTone: e.target.value as ShipRoomStatusTone,
                })
              }
              options={[
                { value: "normal", label: "Normaali (petroli)" },
                { value: "warning", label: "Varoitus (meripihka)" },
                { value: "critical", label: "Kriittinen (punainen)" },
                { value: "locked", label: "Lukittu (sininen)" },
              ]}
            />
            {room.kind === "cabin" && (
              <Select
                size="compact"
                label="Majoitettava"
                aria-label={`${room.name} majoitettava`}
                value={room.claimedByCharacterId ? String(room.claimedByCharacterId) : ""}
                onChange={(e) =>
                  updateRoomMutation.mutate({
                    key: room.key,
                    claimedByCharacterId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                options={[
                  { value: "", label: "Vapaa hytti" },
                  ...crewCharacters.map((c) => ({
                    value: String(c.id),
                    label: c.name,
                  })),
                ]}
              />
            )}
          </div>
          <Input
            label="Tilateksti"
            aria-label={`${room.name} tilateksti`}
            size="compact"
            value={statusLabel}
            onChange={(e) => setStatusLabel(e.target.value)}
          />
          <TextArea
            label="Kuvaus"
            aria-label={`${room.name} kuvaus`}
            size="compact"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextArea
            label="Pelinjohtajan salaiset huonehuomiot"
            aria-label={`${room.name} salaiset huomiot`}
            size="compact"
            rows={2}
            value={gmNotes}
            onChange={(e) => setGmNotes(e.target.value)}
          />
          <div className="flex justify-end">
            <ConsoleButton
              variant="primary"
              size="compact"
              loading={updateRoomMutation.isPending}
              disabled={!name.trim() || !statusLabel.trim()}
              onClick={() =>
                updateRoomMutation.mutate({
                  key: room.key,
                  name: name.trim() || room.name,
                  subtitle: subtitle.trim() || null,
                  description: description.trim() || room.description,
                  statusLabel: statusLabel.trim() || room.statusLabel,
                  gmRoomNotes: gmNotes.trim() || null,
                })
              }
            >
              Tallenna osasto
            </ConsoleButton>
          </div>
        </div>
      )}
    </ConsoleRow>
  );
}

/**
 * Compact 3-tab GM command console rendered inside `ConsoleSheet`.
 */
export function GmCommandSheetContent({
  overview,
  basePath,
  isGm,
  onClose,
}: GmCommandSheetContentProps) {
  const updateConfigMutation = useUpdateShipConfig();
  const createRoomMutation = useCreateShipRoom();
  const createClockMutation = useCreateShipClock();

  const [activeTab, setActiveTab] = useState<CommandTab>("config");
  const [statusBanner, setStatusBanner] = useState(overview.config.statusBanner);
  const [hullNotes, setHullNotes] = useState(overview.config.hullNotes ?? "");

  // Room filtering & grouping
  const [roomSearch, setRoomSearch] = useState("");
  const [deckFilter, setDeckFilter] = useState("all");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    facilities: true,
  });

  // New Room Dialog
  const [newRoomOpen, setNewRoomOpen] = useState(false);
  const [roomDeck, setRoomDeck] = useState("2");
  const [roomKind, setRoomKind] = useState<ShipRoomKind>("facility");
  const [roomName, setRoomName] = useState("");
  const [roomSubtitle, setRoomSubtitle] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [roomLocked, setRoomLocked] = useState(false);

  // New Clock Dialog
  const [newClockOpen, setNewClockOpen] = useState(false);
  const [clockCategory, setClockCategory] = useState<"tutkimus" | "projekti">("tutkimus");
  const [clockScope, setClockScope] = useState<"ship" | "character">("ship");
  const [clockCharId, setClockCharId] = useState("");
  const [clockRoomKey, setClockRoomKey] = useState("");
  const [clockTitle, setClockTitle] = useState("");
  const [clockDesc, setClockDesc] = useState("");
  const [clockSegments, setClockSegments] = useState("6");

  useEffect(() => {
    setStatusBanner(overview.config.statusBanner);
    setHullNotes(overview.config.hullNotes ?? "");
  }, [overview.config.hullNotes, overview.config.statusBanner]);

  const sortedClocks = useMemo(() => {
    const rank = (c: ShipClock) => {
      if (c.status === "active" && c.segmentsTotal === null) return 0;
      if (c.status === "active") return 1;
      if (c.status === "completed") return 2;
      return 3;
    };
    return [...overview.clocks].sort((a, b) => rank(a) - rank(b) || a.id - b.id);
  }, [overview.clocks]);

  const roomGroups = useMemo(() => {
    const query = roomSearch.trim().toLowerCase();
    const deckNum = deckFilter === "all" ? null : Number(deckFilter);

    const matching = overview.rooms.filter((room) => {
      if (deckNum !== null && room.deckNumber !== deckNum) return false;
      if (!query) return true;
      return (
        room.name.toLowerCase().includes(query) ||
        formatCabinCode(room.key).toLowerCase().includes(query) ||
        Boolean(room.occupant?.name.toLowerCase().includes(query))
      );
    });

    const groups: Array<{ id: string; title: string; rooms: ShipRoom[] }> = [];
    const facilities = matching.filter((r) => r.kind !== "cabin");
    if (facilities.length > 0) {
      groups.push({
        id: "facilities",
        title: `Osastot ja suljetut tilat (${facilities.length})`,
        rooms: facilities,
      });
    }

    for (const wing of CABIN_WINGS) {
      const wingCabins = matching.filter((r) => r.kind === "cabin" && r.svgZoneId === wing.wingId);
      if (wingCabins.length > 0) {
        groups.push({
          id: wing.wingId,
          title: `${wing.title} (${wingCabins.length})`,
          rooms: wingCabins,
        });
      }
    }

    const otherCabins = matching.filter(
      (r) => r.kind === "cabin" && !CABIN_WINGS.some((w) => w.wingId === r.svgZoneId),
    );
    if (otherCabins.length > 0) {
      groups.push({
        id: "other-cabins",
        title: `Muut hytit (${otherCabins.length})`,
        rooms: otherCabins,
      });
    }

    return groups;
  }, [deckFilter, overview.rooms, roomSearch]);

  if (!isGm) {
    return <Navigate to={basePath || "/"} replace />;
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfigMutation.mutate({
      statusBanner: statusBanner.trim(),
      hullNotes: hullNotes.trim() || null,
    });
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !roomDesc.trim()) return;
    const derivedKey = slugifyRoomKey(
      roomName.trim(),
      overview.rooms.map((r) => r.key),
    );
    createRoomMutation.mutate(
      {
        key: derivedKey,
        deckNumber: Number(roomDeck),
        kind: roomKind,
        name: roomName.trim(),
        subtitle: roomSubtitle.trim() || null,
        description: roomDesc.trim(),
        isLocked: roomLocked,
      },
      {
        onSuccess: () => {
          setNewRoomOpen(false);
          setRoomName("");
          setRoomSubtitle("");
          setRoomDesc("");
          setRoomLocked(false);
        },
      },
    );
  };

  const handleCreateClock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clockTitle.trim()) return;
    createClockMutation.mutate(
      {
        category: clockCategory,
        scope: clockScope,
        characterId: clockScope === "character" && clockCharId ? Number(clockCharId) : null,
        roomKey: clockRoomKey || null,
        title: clockTitle.trim(),
        description: clockDesc.trim(),
        segmentsTotal: clockSegments ? (Number(clockSegments) as ProgressClockSegments) : null,
      },
      {
        onSuccess: () => {
          setNewClockOpen(false);
          setClockTitle("");
          setClockDesc("");
          setClockRoomKey("");
        },
      },
    );
  };

  return (
    <ConsoleSheet
      title="Pelinjohtajan konsoli"
      subtitle="Aluksen teema, kellot ja 4 kannen osastot"
      defaultSnap="full"
      onClose={onClose}
    >
      {/* 3-tab selector */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-[var(--theme-border-soft)]">
        <ConsolePill active={activeTab === "config"} onClick={() => setActiveTab("config")}>
          Alus ja teema
        </ConsolePill>
        <ConsolePill active={activeTab === "clocks"} onClick={() => setActiveTab("clocks")}>
          {`Kellot (${sortedClocks.length})`}
        </ConsolePill>
        <ConsolePill active={activeTab === "rooms"} onClick={() => setActiveTab("rooms")}>
          {`Osastot (${overview.rooms.length})`}
        </ConsolePill>
      </div>

      {/* Tab 1: Config & Preps */}
      {activeTab === "config" && (
        <div className="space-y-4">
          <form onSubmit={handleSaveConfig} className="space-y-3">
            <Select
              label="Aluksen väriteema"
              size="compact"
              value={overview.config.theme}
              onChange={(e) =>
                updateConfigMutation.mutate({
                  theme: e.target.value as ShipOverviewResponse["config"]["theme"],
                })
              }
              options={SHIP_THEME_OPTIONS}
            />
            <Input
              label="Tilapalkin viesti"
              size="compact"
              value={statusBanner}
              onChange={(e) => setStatusBanner(e.target.value)}
            />
            <TextArea
              label="Aluksen rungon yleiskuvaus ja huomiot"
              size="compact"
              rows={3}
              value={hullNotes}
              onChange={(e) => setHullNotes(e.target.value)}
            />
            <div className="flex justify-end">
              <ConsoleButton
                type="submit"
                variant="primary"
                loading={updateConfigMutation.isPending}
              >
                Tallenna alustiedot
              </ConsoleButton>
            </div>
          </form>

          {overview.upcomingPreps.length > 0 && (
            <div className="border-t border-[var(--theme-border-soft)] pt-3 space-y-2">
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Tulevan jakson keikkavalmistautumiset
              </span>
              {overview.upcomingPreps.map((prep) => (
                <ConsoleRow
                  key={prep.turnId}
                  title={`${prep.characterName} (${prep.episodeTitle})`}
                  subtitle={prep.description || "Ei lisäkuvausta"}
                  badge={
                    <Badge variant="highlight">
                      {`${prep.hits} osumaa · ${prep.diceCount}n20`}
                    </Badge>
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Clocks */}
      {activeTab === "clocks" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
              Mitoita pelaajien kellot tai säädä edistymistä
            </span>
            <ConsoleButton
              variant="primary"
              size="compact"
              iconLeft="plus"
              onClick={() => setNewClockOpen(true)}
            >
              Luo uusi kello
            </ConsoleButton>
          </div>

          {sortedClocks.length === 0 ? (
            <Text variant="muted" className="text-sm">
              Ei kelloja luotuna.
            </Text>
          ) : (
            <div className="space-y-2">
              {sortedClocks.map((clock) => (
                <ClockAdminItem
                  key={clock.id}
                  clock={clock}
                  rooms={overview.rooms}
                  crewCharacters={overview.crewCharacters}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Compartments & Cabins */}
      {activeTab === "rooms" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Input
              label="Haku"
              size="compact"
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              placeholder="Hae osastoa, koodia tai asukasta"
            />
            <Select
              label="Kansi"
              size="compact"
              value={deckFilter}
              onChange={(e) => setDeckFilter(e.target.value)}
              options={[
                { value: "all", label: "Kaikki 4 kantta" },
                ...DECK_SPECS.map((deck) => ({
                  value: String(deck.deckNumber),
                  label: deck.label,
                })),
              ]}
            />
          </div>

          <div className="flex justify-end">
            <ConsoleButton
              variant="primary"
              size="compact"
              iconLeft="plus"
              onClick={() => setNewRoomOpen(true)}
            >
              Uusi osasto
            </ConsoleButton>
          </div>

          <div className="space-y-2">
            {roomGroups.map((group) => {
              const isSearching = Boolean(roomSearch.trim()) || deckFilter !== "all";
              const isOpen = isSearching || Boolean(openGroups[group.id]);

              return (
                <div
                  key={group.id}
                  className="border border-[var(--theme-border-soft)] rounded-[4px] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [group.id]: !isOpen,
                      }))
                    }
                    className="w-full px-3 py-2 flex items-center justify-between gap-2 bg-[color-mix(in_srgb,var(--theme-bg)_90%,var(--theme-surface-tint))] hover:bg-[color-mix(in_srgb,var(--theme-secondary)_10%,var(--theme-bg))] cursor-pointer text-left"
                  >
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--theme-text)]">
                      {group.title}
                    </span>
                    <span className="font-heading text-xs font-semibold text-[var(--theme-secondary)]">
                      {isOpen ? "Piilota" : "Avaa"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-2 space-y-1.5">
                      {group.rooms.map((room) => (
                        <RoomAdminItem
                          key={room.key}
                          room={room}
                          crewCharacters={overview.crewCharacters}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Room Dialog */}
      <Dialog
        open={newRoomOpen}
        onClose={() => setNewRoomOpen(false)}
        title="Lisää uusi osasto alukseen"
        description="Uusi osasto tai hytti ilmestyy valitulle kannelle."
      >
        <form onSubmit={handleCreateRoom} className="space-y-3">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Select
              label="Kansi"
              size="compact"
              value={roomDeck}
              onChange={(e) => setRoomDeck(e.target.value)}
              options={DECK_SPECS.map((deck) => ({
                value: String(deck.deckNumber),
                label: deck.label,
              }))}
            />
            <Select
              label="Osaston tyyppi"
              size="compact"
              value={roomKind}
              onChange={(e) => setRoomKind(e.target.value as ShipRoomKind)}
              options={[
                { value: "facility", label: "Yleinen osasto" },
                { value: "cabin", label: "Miehistöhytti" },
                { value: "sealed", label: "Sinetöity osasto" },
              ]}
            />
          </div>
          <Input
            label="Nimi"
            size="compact"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
          <Input
            label="Alaotsikko"
            size="compact"
            value={roomSubtitle}
            onChange={(e) => setRoomSubtitle(e.target.value)}
          />
          <TextArea
            label="Kuvaus"
            size="compact"
            rows={3}
            value={roomDesc}
            onChange={(e) => setRoomDesc(e.target.value)}
            required
          />
          <Checkbox
            label="Lukittu pelaajilta oletuksena"
            checked={roomLocked}
            onChange={(e) => setRoomLocked(e.target.checked)}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--theme-border-soft)]">
            <ConsoleButton
              type="button"
              variant="ghost"
              size="compact"
              onClick={() => setNewRoomOpen(false)}
            >
              Peruuta
            </ConsoleButton>
            <ConsoleButton
              type="submit"
              variant="primary"
              size="compact"
              loading={createRoomMutation.isPending}
            >
              Luo osasto
            </ConsoleButton>
          </div>
        </form>
      </Dialog>

      {/* New Clock Dialog */}
      <Dialog
        open={newClockOpen}
        onClose={() => setNewClockOpen(false)}
        title="Luo uusi alus- tai hahmokello"
      >
        <form onSubmit={handleCreateClock} className="space-y-3">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-2">
            <Select
              label="Luokka"
              size="compact"
              value={clockCategory}
              onChange={(e) => setClockCategory(e.target.value as "tutkimus" | "projekti")}
              options={[
                { value: "tutkimus", label: "Tutkimuskello" },
                { value: "projekti", label: "Projektikello" },
              ]}
            />
            <Select
              label="Laajuus"
              size="compact"
              value={clockScope}
              onChange={(e) => setClockScope(e.target.value as "ship" | "character")}
              options={[
                { value: "ship", label: "Koko alus / miehistö" },
                { value: "character", label: "Hahmon oma" },
              ]}
            />
          </div>

          {clockScope === "character" && (
            <Select
              label="Hahmo"
              size="compact"
              value={clockCharId}
              onChange={(e) => setClockCharId(e.target.value)}
              options={[
                { value: "", label: "Valitse hahmo" },
                ...overview.crewCharacters.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                })),
              ]}
            />
          )}

          <Select
            label="Liitetty osasto (valinnainen)"
            size="compact"
            value={clockRoomKey}
            onChange={(e) => setClockRoomKey(e.target.value)}
            options={[
              { value: "", label: "Ei osastoliitosta" },
              ...overview.rooms
                .filter((r) => r.kind !== "cabin")
                .map((r) => ({
                  value: r.key,
                  label: `Kansi ${r.deckNumber}: ${r.name}`,
                })),
            ]}
          />

          <Input
            label="Nimi"
            size="compact"
            value={clockTitle}
            onChange={(e) => setClockTitle(e.target.value)}
            required
          />
          <TextArea
            label="Kuvaus"
            size="compact"
            rows={2}
            value={clockDesc}
            onChange={(e) => setClockDesc(e.target.value)}
          />
          <Select
            label="Osioiden määrä"
            size="compact"
            value={clockSegments}
            onChange={(e) => setClockSegments(e.target.value)}
            options={[
              { value: "", label: "Odottaa mitoitusta" },
              { value: "4", label: "4 osaa" },
              { value: "6", label: "6 osaa" },
              { value: "8", label: "8 osaa" },
              { value: "10", label: "10 osaa" },
              { value: "12", label: "12 osaa" },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--theme-border-soft)]">
            <ConsoleButton
              type="button"
              variant="ghost"
              size="compact"
              onClick={() => setNewClockOpen(false)}
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
