import {
  Badge,
  ConsoleDock,
  ConsoleDockItem,
  ConsolePill,
  ConsoleRow,
  ConsoleSheet,
  ConsoleViewport,
} from "@repo/ui";
import type { Theme } from "@repo/ui/components/Theme";
import { useMemo, useState } from "react";
import type { ShipClock, ShipOverviewResponse, ShipRoom } from "../api/ship";
import { IsometricShipCanvas, type ShipSelectionTarget } from "./IsometricShipCanvas";
import {
  buildWingCabinLayouts,
  CABIN_WING_MAP,
  CABIN_WINGS,
  DECK_SPECS,
  formatCabinCode,
  getRoomStatusRowTone,
  SHIP_ZONES,
} from "./ship-zones";

const OCCUPANTS_BY_ROOM_KEY: Record<
  string,
  { id: number; name: string; archetype: string; ownerName: string; isOwn: boolean; title: string }
> = {
  "cabin-a02": {
    id: 11,
    name: "Senni Vaara",
    archetype: "Tiedustelija",
    ownerName: "pelaaja2",
    isOwn: false,
    title: "Kuunteluhytti",
  },
  "cabin-b01": {
    id: 10,
    name: "Kaino Kivi",
    archetype: "Teknikko",
    ownerName: "pelaaja1",
    isOwn: true,
    title: "Tähtiverstas",
  },
  "cabin-b04": {
    id: 12,
    name: "Aaro Teräs",
    archetype: "Luotsi",
    ownerName: "pelaaja3",
    isOwn: false,
    title: "Navigaattorin kajuutta",
  },
  "cabin-c03": {
    id: 13,
    name: "Varpu Laine",
    archetype: "Lääkintäupseeri",
    ownerName: "pelaaja4",
    isOwn: false,
    title: "Yrttikaappi ja kajuutta",
  },
  "cabin-d02": {
    id: 14,
    name: "Otso Meri",
    archetype: "Koneenkäyttäjä",
    ownerName: "pelaaja5",
    isOwn: false,
    title: "Työhaalarivarasto",
  },
};

const WARNING_ZONE_IDS = new Set(["d1-logs", "d2-galley-stores", "d4-engine", "d4-reactor"]);

function buildCanonicalOverview(opts?: { repairedBreach?: boolean }): ShipOverviewResponse {
  const repairedBreach = opts?.repairedBreach ?? false;
  const facilityAndSealedRooms: ShipRoom[] = SHIP_ZONES.filter((z) => z.kind !== "wing").map(
    (zone, index) => {
      const isSealed = zone.kind === "sealed";
      const isBreach = zone.id === "d3-breach";
      const isWarning = WARNING_ZONE_IDS.has(zone.id);
      const isBridge = zone.id === "d1-bridge";
      const name = isBreach && repairedBreach ? "Paikattu kylkilaipio" : zone.defaultLabel;
      const statusLabel = isSealed
        ? "Sinetöity"
        : isBreach
          ? repairedBreach
            ? "Hitsattu umpeen"
            : "Kylkikuori revennyt"
          : isWarning
            ? "Huoltotarve"
            : isBridge
              ? "Toiminnassa"
              : "Valmiudessa";
      const statusTone = isSealed
        ? "locked"
        : isBreach
          ? repairedBreach
            ? "normal"
            : "critical"
          : isWarning
            ? "warning"
            : "normal";
      const description = isSealed
        ? "Painelaipion taakse sinetöity osasto. Koodiavain puuttuu."
        : isBreach
          ? repairedBreach
            ? "Ulkokuori on paikattu ja tuettu runkopalkein."
            : "Hätälaipio eristää paapuurin vanhan iskemäkohdan tyhjiöstä."
          : `${name} kannella ${zone.deckNumber}.`;

      return {
        id: index + 1,
        key: zone.id,
        deckNumber: zone.deckNumber,
        kind: isSealed ? "sealed" : "facility",
        svgZoneId: zone.id,
        name,
        subtitle: `Kansi ${zone.deckNumber}`,
        description,
        statusLabel,
        statusTone,
        isLocked: isSealed,
        claimedByCharacterId: null,
        cabinCustomTitle: null,
        cabinDecoration: null,
        gmRoomNotes: null,
        orderIndex: index,
        occupant: null,
      };
    },
  );

  const cabinRooms: ShipRoom[] = [];
  let nextId = 100;

  for (const wing of CABIN_WINGS) {
    for (const layout of buildWingCabinLayouts(wing)) {
      const occupant = OCCUPANTS_BY_ROOM_KEY[layout.roomKey];
      cabinRooms.push({
        id: nextId++,
        key: layout.roomKey,
        deckNumber: wing.deckNumber,
        kind: "cabin",
        svgZoneId: wing.wingId,
        name: `Asuinhuone ${layout.code}`,
        subtitle: wing.title,
        description: occupant
          ? `${occupant.name} (${occupant.archetype}) asuu tässä hytissä.`
          : "Vapaa miehistöhytti keskusväylän varrella.",
        statusLabel: occupant ? "Varattu" : "Vapaa",
        statusTone: "normal",
        isLocked: false,
        claimedByCharacterId: occupant ? occupant.id : null,
        cabinCustomTitle: occupant ? occupant.title : null,
        cabinDecoration: null,
        gmRoomNotes: null,
        orderIndex: nextId,
        occupant: occupant
          ? {
              characterId: occupant.id,
              name: occupant.name,
              archetype: occupant.archetype,
              userId: occupant.id + 100,
              ownerName: occupant.ownerName,
              isOwn: occupant.isOwn,
            }
          : null,
      });
    }
  }

  const clocks: ShipClock[] = [
    {
      id: 1,
      category: "projekti",
      scope: "ship",
      characterId: null,
      characterName: null,
      characterUserId: null,
      roomKey: "d3-breach",
      title: "Kylkivaurion tiivistys",
      description: "Hitsataan ulkolaipio ja palautetaan paine varastoon.",
      segmentsTotal: 6,
      segmentsFilled: 3,
      status: "active",
      completionNotes: null,
      createdByUserId: 1,
      createdAt: "2026-11-10T10:00:00Z",
      updatedAt: "2026-11-10T10:00:00Z",
    },
    {
      id: 2,
      category: "tutkimus",
      scope: "character",
      characterId: 10,
      characterName: "Kaino Kivi",
      characterUserId: 110,
      roomKey: "d1-bridge",
      title: "Anturilokien tulkinta",
      description: "Puretaan taajuuslokit asemien välisestä häiriöstä.",
      segmentsTotal: 4,
      segmentsFilled: 2,
      status: "active",
      completionNotes: null,
      createdByUserId: 110,
      createdAt: "2026-11-10T10:00:00Z",
      updatedAt: "2026-11-10T10:00:00Z",
    },
  ];

  return {
    config: {
      id: 1,
      name: "Aamunkoi",
      callsign: "Runko 150 m",
      theme: "base",
      statusBanner: "Asemien välisessä varjossa",
      hullNotes: "Runkomalli 150 m",
      updatedAt: "2026-11-10T10:00:00Z",
    },
    rooms: [...facilityAndSealedRooms, ...cabinRooms],
    clocks,
    myCharacters: [
      {
        id: 10,
        name: "Kaino Kivi",
        archetype: "Teknikko",
        activeHarmitCount: 1,
        availableDice: 4,
        claimedRoom: { key: "cabin-b01", name: "Asuinhuone B-01", deckNumber: 2 },
      },
    ],
    crewCharacters: [],
    upcomingPreps: [],
  };
}

const MOCK_OVERVIEW = buildCanonicalOverview();
const REPAIRED_BREACH_OVERVIEW = buildCanonicalOverview({ repairedBreach: true });

function ShipCutawayStoryHarness({
  initialDeck,
  initialRoomKey,
  initialWingId,
  theme = "base",
  arrivalProgressOverride = 1,
  overviewOverride,
}: {
  initialDeck: number | null;
  initialRoomKey?: string;
  initialWingId?: string;
  theme?: Theme;
  arrivalProgressOverride?: number;
  overviewOverride?: ShipOverviewResponse;
}) {
  const activeOverview = overviewOverride ?? MOCK_OVERVIEW;
  const [focusedDeck, setFocusedDeck] = useState<number | null>(initialDeck);
  const [selectedTarget, setSelectedTarget] = useState<ShipSelectionTarget | null>(() => {
    if (initialWingId) return { type: "wing", wingId: initialWingId };
    if (initialRoomKey) {
      const room = activeOverview.rooms.find((r) => r.key === initialRoomKey);
      if (room) return { type: "room", room };
    }
    return null;
  });

  const selectedWing =
    selectedTarget?.type === "wing" ? (CABIN_WING_MAP[selectedTarget.wingId] ?? null) : null;
  const selectedRoom = selectedTarget?.type === "room" ? selectedTarget.room : null;

  const highlightedWingId = useMemo(() => {
    if (selectedWing) return selectedWing.wingId;
    if (selectedRoom?.kind === "cabin") return selectedRoom.svgZoneId;
    return null;
  }, [selectedWing, selectedRoom]);

  const sheetOverlay = selectedWing ? (
    <ConsoleSheet
      headerCode={`Kansi ${selectedWing.deckNumber}`}
      title={`Asuinsiipi ${selectedWing.code}`}
      subtitle={selectedWing.subtitle}
      statusSlot={<Badge variant="outline">{`${selectedWing.cabinCount} hyttiä`}</Badge>}
      defaultSnap="half"
      onClose={() => setSelectedTarget(null)}
    >
      {activeOverview.rooms
        .filter((room) => room.svgZoneId === selectedWing.wingId)
        .slice(0, 6)
        .map((room) => (
          <ConsoleRow
            key={room.key}
            code={formatCabinCode(room.key)}
            title={room.cabinCustomTitle || room.name}
            subtitle={room.occupant ? room.occupant.name : "Vapaa hytti"}
            statusTone={room.occupant?.isOwn ? "active" : "normal"}
            onClick={() => setSelectedTarget({ type: "room", room })}
          />
        ))}
    </ConsoleSheet>
  ) : selectedRoom ? (
    <ConsoleSheet
      headerCode={
        selectedRoom.kind === "cabin"
          ? `Kansi ${selectedRoom.deckNumber} · Hytti ${formatCabinCode(selectedRoom.key)}`
          : `Kansi ${selectedRoom.deckNumber}`
      }
      title={selectedRoom.cabinCustomTitle || selectedRoom.name}
      subtitle={selectedRoom.subtitle ?? undefined}
      statusSlot={<Badge variant="outline">{selectedRoom.statusLabel}</Badge>}
      defaultSnap="half"
      onClose={() => setSelectedTarget(null)}
    >
      <ConsoleRow
        code="Kuvaus"
        title={selectedRoom.name}
        subtitle={selectedRoom.description}
        statusTone={getRoomStatusRowTone(selectedRoom)}
      />
    </ConsoleSheet>
  ) : null;

  return (
    <div className="h-screen w-full" data-theme={theme}>
      <ConsoleViewport
        className="h-full"
        theme={theme}
        stageMode="canvas"
        igniteOnMount
        arrivalProgressOverride={arrivalProgressOverride}
        topBar={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="ds-console-pod">
              <div className="px-2 py-1 flex flex-wrap items-center gap-2 min-w-0">
                <ConsolePill tone="dawn" icon="anchor">
                  Aamunkoi
                </ConsolePill>
                <span className="hidden tablet:block font-sans text-xs tablet:text-sm text-text-muted truncate max-w-md">
                  {activeOverview.config.statusBanner}
                </span>
              </div>
            </div>
          </div>
        }
        stage={
          <IsometricShipCanvas
            overview={activeOverview}
            focusedDeck={focusedDeck}
            selectedTarget={selectedTarget}
            highlightedWingId={highlightedWingId}
            onSelectTarget={setSelectedTarget}
            onFocusDeck={setFocusedDeck}
          />
        }
        overlay={sheetOverlay}
        dock={
          <ConsoleDock
            utilityBar={
              <div className="flex flex-wrap items-center justify-center desktop:justify-start gap-1.5">
                <ConsolePill active={focusedDeck === null} onClick={() => setFocusedDeck(null)}>
                  Kaikki
                </ConsolePill>
                {DECK_SPECS.map((deck) => (
                  <ConsolePill
                    key={deck.deckNumber}
                    active={focusedDeck === deck.deckNumber}
                    onClick={() => setFocusedDeck(deck.deckNumber)}
                  >
                    {deck.shortTab}
                  </ConsolePill>
                ))}
              </div>
            }
          >
            <ConsoleDockItem
              icon="compass"
              label="Alus"
              active
              onClick={() => setSelectedTarget(null)}
            />
            <ConsoleDockItem
              icon="home"
              label="Hytti"
              onClick={() => {
                const ownRoom = activeOverview.rooms.find((r) => r.key === "cabin-b01");
                if (ownRoom) setSelectedTarget({ type: "room", room: ownRoom });
              }}
            />
            <ConsoleDockItem icon="dice5" label="Väliaika" badge={4} />
          </ConsoleDock>
        }
      />
    </div>
  );
}

const meta = {
  title: "Suunnittelujarjestelma/Konsoli/AlusAamunkoi",
  component: IsometricShipCanvas,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Runkoleikkaus = {
  name: "4 kannen 2.5D-runkoleikkaus",
  render: () => (
    <ShipCutawayStoryHarness
      initialDeck={null}
      initialRoomKey="d1-bridge"
      arrivalProgressOverride={1}
    />
  ),
};

export const SaapumisvirtausPuolivali = {
  name: "Saapumisvirtaus puolivälissä (keulasta perään)",
  render: () => (
    <ShipCutawayStoryHarness
      initialDeck={null}
      initialRoomKey="d1-bridge"
      arrivalProgressOverride={0.44}
    />
  ),
};

export const Kansi01Ylakansi = {
  name: "Kansi 1: Yläkansi (komento ja kuuntelu)",
  render: () => <ShipCutawayStoryHarness initialDeck={1} arrivalProgressOverride={1} />,
};

export const Kansi02Leikkaus = {
  name: "Kansi 2: Asuinkannet (24 hyttiä ja messi)",
  render: () => <ShipCutawayStoryHarness initialDeck={2} arrivalProgressOverride={1} />,
};

export const Kansi03Sukkulahalli = {
  name: "Kansi 3: Sukkulahalli ja sairastupa",
  render: () => <ShipCutawayStoryHarness initialDeck={3} arrivalProgressOverride={1} />,
};

export const Kansi04Konehuone = {
  name: "Kansi 4: Konehuone ja reaktori",
  render: () => <ShipCutawayStoryHarness initialDeck={4} arrivalProgressOverride={1} />,
};

export const VaaleaKansi04Leikkaus = {
  name: "Vaalea teema (Kansi 4: Konehuone)",
  render: () => (
    <ShipCutawayStoryHarness initialDeck={4} theme="inverted" arrivalProgressOverride={1} />
  ),
};

export const VaaleaRunkoleikkaus = {
  name: "Vaalea teema (koko runko)",
  render: () => (
    <ShipCutawayStoryHarness initialDeck={null} theme="inverted" arrivalProgressOverride={1} />
  ),
};

export const KorjattuKylkivaurio = {
  name: "Kansi 3: Korjattu ja uudelleennimetty kylkilaipio",
  render: () => (
    <ShipCutawayStoryHarness
      initialDeck={3}
      initialRoomKey="d3-breach"
      overviewOverride={REPAIRED_BREACH_OVERVIEW}
      arrivalProgressOverride={1}
    />
  ),
};

export const TummaPetroliTeema = {
  name: "Tumma petroliteema",
  render: () => (
    <ShipCutawayStoryHarness
      initialDeck={null}
      theme="secondary-dark"
      arrivalProgressOverride={1}
    />
  ),
};
