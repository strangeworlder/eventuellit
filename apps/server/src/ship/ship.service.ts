import { randomInt } from "node:crypto";
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  type OnModuleInit,
} from "@nestjs/common";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { AuthUser } from "../auth/current-user.decorator";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import {
  cabinPossessions,
  characterArcSnapshots,
  characterEpisodes,
  characters,
  episodes,
  shipClocks,
  shipConfig,
  shipDowntimeTurns,
  shipRooms,
  users,
} from "../db/schema";
import type { ClaimCabinDto } from "./dto/claim-cabin.dto";
import type { CreatePossessionDto } from "./dto/create-possession.dto";
import type { CreateShipClockDto } from "./dto/create-ship-clock.dto";
import type { CreateShipRoomDto } from "./dto/create-ship-room.dto";
import type { DowntimeAllocationDto } from "./dto/downtime-allocation.dto";
import type { UpdateCabinInteriorDto } from "./dto/update-cabin-interior.dto";
import type { UpdatePossessionDto } from "./dto/update-possession.dto";
import type { UpdateShipClockDto } from "./dto/update-ship-clock.dto";
import type { UpdateShipConfigDto } from "./dto/update-ship-config.dto";
import type { UpdateShipRoomDto } from "./dto/update-ship-room.dto";
import { DEFAULT_SHIP_CONFIG, DEFAULT_SHIP_ROOMS } from "./ship-seed";

export interface HarmiEntry {
  text: string;
  healed: boolean;
}

export interface DowntimeDraftPayload {
  healedHarmiIndices: number[];
  clockDice: Record<number, number>;
  prepDice: number;
  prepDescription: string;
}

export interface DowntimeRollOutcome {
  rolls: number[];
  hits: number;
  hasDoubles: boolean;
  isCritical: boolean;
  totalTicks: number;
}

export interface DowntimeResolutionPayload {
  availableDice: number;
  healedHarmit: Array<{ index: number; text: string }>;
  clockResults: Array<{
    clockId: number;
    title: string;
    category: "tutkimus" | "projekti";
    diceCount: number;
    rolls: number[];
    hits: number;
    hasDoubles: boolean;
    isCritical: boolean;
    ticksAdded: number;
    segmentsFilledAfter: number;
    segmentsTotal: number | null;
    completedNow: boolean;
  }>;
  prepResult: {
    diceCount: number;
    description: string;
    rolls: number[];
    hits: number;
    hasDoubles: boolean;
    isCritical: boolean;
  } | null;
}

const VALID_CLOCK_SEGMENTS = new Set<number>([4, 6, 8, 10, 12]);

export function evaluateDowntimeRolls(rolls: number[]): DowntimeRollOutcome {
  const hits = rolls.filter((value) => value >= 13).length;
  const hasDoubles = rolls.length >= 2 && new Set(rolls).size < rolls.length;
  const isCritical = hits >= 1 && hasDoubles;
  const totalTicks = hits + (isCritical ? 1 : 0);
  return { rolls, hits, hasDoubles, isCritical, totalTicks };
}

export function rollDowntimePool(
  count: number,
  rng: () => number = () => randomInt(1, 21),
): DowntimeRollOutcome {
  if (count <= 0) {
    return { rolls: [], hits: 0, hasDoubles: false, isCritical: false, totalTicks: 0 };
  }
  const rolls = Array.from({ length: count }, () => rng());
  return evaluateDowntimeRolls(rolls);
}

export function parseHarmitEntries(raw: unknown): HarmiEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is { text?: unknown; healed?: unknown } =>
        typeof item === "object" && item !== null,
    )
    .map((item) => ({
      text: typeof item.text === "string" ? item.text : "",
      healed: Boolean(item.healed),
    }));
}

export function getActiveHarmiItems(raw: unknown): Array<{ index: number; text: string }> {
  const entries = parseHarmitEntries(raw);
  const active: Array<{ index: number; text: string }> = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry.healed && entry.text.trim().length > 0) {
      active.push({ index: i, text: entry.text });
    }
  }
  return active;
}

export function isPossessionLocked(gmMechanicalNotes: string | null | undefined): boolean {
  return Boolean(gmMechanicalNotes && gmMechanicalNotes.trim().length > 0);
}

function emptyDraft(): DowntimeDraftPayload {
  return {
    healedHarmiIndices: [],
    clockDice: {},
    prepDice: 0,
    prepDescription: "",
  };
}

function normalizeDraft(raw: unknown): DowntimeDraftPayload {
  if (typeof raw !== "object" || raw === null) return emptyDraft();
  const obj = raw as Record<string, unknown>;
  const healedHarmiIndices = Array.isArray(obj.healedHarmiIndices)
    ? Array.from(
        new Set(
          obj.healedHarmiIndices.filter(
            (idx): idx is number => typeof idx === "number" && Number.isInteger(idx) && idx >= 0,
          ),
        ),
      )
    : [];

  const clockDice: Record<number, number> = {};
  if (typeof obj.clockDice === "object" && obj.clockDice !== null) {
    for (const [k, v] of Object.entries(obj.clockDice as Record<string, unknown>)) {
      const clockId = Number(k);
      if (
        Number.isInteger(clockId) &&
        clockId > 0 &&
        typeof v === "number" &&
        Number.isInteger(v) &&
        v > 0
      ) {
        clockDice[clockId] = v;
      }
    }
  }

  const prepDice =
    typeof obj.prepDice === "number" && Number.isInteger(obj.prepDice) && obj.prepDice >= 0
      ? obj.prepDice
      : 0;
  const prepDescription = typeof obj.prepDescription === "string" ? obj.prepDescription : "";

  return {
    healedHarmiIndices,
    clockDice,
    prepDice,
    prepDescription,
  };
}

@Injectable()
export class ShipService implements OnModuleInit {
  private readonly logger = new Logger(ShipService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureSchemaTables();
      await this.ensureSeedData();
    } catch (error) {
      this.logger.warn(
        `Could not auto-initialize ship tables/seed data: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  private async ensureSchemaTables() {
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS ship_config (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL DEFAULT 'Aamunkoi',
        callsign TEXT NOT NULL DEFAULT 'Runko 150 m',
        theme TEXT NOT NULL DEFAULT 'base',
        status_banner TEXT NOT NULL DEFAULT 'Asemien välisessä varjossa, häivejärjestelmät valmiustilassa',
        hull_notes TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS ship_rooms (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        deck_number INTEGER NOT NULL,
        kind TEXT NOT NULL,
        svg_zone_id TEXT NOT NULL,
        name TEXT NOT NULL,
        subtitle TEXT,
        description TEXT NOT NULL,
        status_label TEXT NOT NULL DEFAULT 'Toiminnassa',
        status_tone TEXT NOT NULL DEFAULT 'normal',
        is_locked BOOLEAN NOT NULL DEFAULT FALSE,
        claimed_by_character_id INTEGER UNIQUE REFERENCES characters(id) ON DELETE SET NULL,
        cabin_custom_title TEXT,
        cabin_decoration TEXT,
        gm_room_notes TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS cabin_possessions (
        id SERIAL PRIMARY KEY,
        character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        gm_mechanical_notes TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS ship_clocks (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL,
        scope TEXT NOT NULL,
        character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
        room_key TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        segments_total INTEGER,
        segments_filled INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        completion_notes TEXT,
        created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS ship_downtime_turns (
        id SERIAL PRIMARY KEY,
        character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
        source_completed_episode_id INTEGER NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
        locked_episode_id INTEGER REFERENCES episodes(id) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        draft_allocation_json JSONB NOT NULL DEFAULT '{}'::jsonb,
        resolution_json JSONB,
        resolved_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this.db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS ship_downtime_turns_char_source_ep_uniq
        ON ship_downtime_turns (character_id, source_completed_episode_id)
    `);
  }

  private async ensureSeedData() {
    const retiredShipRoomKeys = [
      "comms-nav",
      "fire-control",
      "observation",
      "wardroom",
      "science-lab",
      "training",
      "cargo",
      "life-support",
      "eva-station",
      "workshop",
      "reactor",
      "antimatter-stores",
      "brig",
      "sealed-bow",
      "sealed-ordnance",
      "cabin-a07",
      "cabin-a08",
      "cabin-b13",
      "cabin-b14",
      "cabin-b15",
      "cabin-b16",
      "cabin-b17",
      "cabin-b18",
      "cabin-b19",
      "cabin-b20",
      "cabin-b21",
      "cabin-b22",
      "cabin-b23",
      "cabin-b24",
      "cabin-c13",
      "cabin-c14",
      "cabin-c15",
      "cabin-c16",
      "cabin-c17",
      "cabin-c18",
      "cabin-c19",
      "cabin-c20",
      "cabin-c21",
      "cabin-c22",
      "cabin-c23",
      "cabin-c24",
      "cabin-d11",
      "cabin-d12",
      "cabin-e01",
      "cabin-e02",
      "cabin-e03",
      "cabin-e04",
      "cabin-e05",
      "cabin-e06",
      "cabin-e07",
      "cabin-e08",
      "cabin-e09",
      "cabin-e10",
      "cabin-e11",
      "cabin-e12",
    ];
    const retiredCabinKeys = retiredShipRoomKeys.filter((key) => key.startsWith("cabin-"));

    await this.db
      .insert(shipConfig)
      .values({
        id: DEFAULT_SHIP_CONFIG.id,
        name: DEFAULT_SHIP_CONFIG.name,
        callsign: DEFAULT_SHIP_CONFIG.callsign,
        theme: DEFAULT_SHIP_CONFIG.theme,
        statusBanner: DEFAULT_SHIP_CONFIG.statusBanner,
        hullNotes: DEFAULT_SHIP_CONFIG.hullNotes,
      })
      .onConflictDoNothing();

    const legacyConfigRows = await this.db
      .select({ id: shipConfig.id })
      .from(shipConfig)
      .where(
        sql`${shipConfig.id} = 1 AND (${shipConfig.callsign} = 'RUNKO-150M' OR ${shipConfig.callsign} LIKE '%EGA%' OR ${shipConfig.statusBanner} LIKE 'Kiertoradalla%')`,
      );

    if (legacyConfigRows.length > 0) {
      await this.db
        .update(shipConfig)
        .set({
          callsign: DEFAULT_SHIP_CONFIG.callsign,
          statusBanner: DEFAULT_SHIP_CONFIG.statusBanner,
          hullNotes: DEFAULT_SHIP_CONFIG.hullNotes,
          updatedAt: new Date(),
        })
        .where(eq(shipConfig.id, DEFAULT_SHIP_CONFIG.id));
    }

    const legacyRoomRows = await this.db
      .select({ key: shipRooms.key })
      .from(shipRooms)
      .where(
        sql`${shipRooms.key} IN (${sql.join(
          retiredShipRoomKeys.map((key) => sql`${key}`),
          sql`, `,
        )}) OR (${shipRooms.key} = 'bridge' AND ${shipRooms.description} LIKE '%kiertoratavektorit%') OR (${shipRooms.key} = 'mess' AND ${shipRooms.description} LIKE '%Pitkä ruokasali%') OR ${shipRooms.subtitle} LIKE '%EGA%' OR ${shipRooms.description} LIKE '%CGA%' OR ${shipRooms.name} LIKE '%Antimateria%'`,
      );

    const shouldRefreshCanonicalCopy = legacyConfigRows.length > 0 || legacyRoomRows.length > 0;

    // Preserve any existing cabin claims/decorations from the initial seed keys
    await this.db.execute(sql`
      UPDATE ship_rooms old_r
      SET key = CASE old_r.key
        WHEN 'cabin-a1' THEN 'cabin-a01'
        WHEN 'cabin-a2' THEN 'cabin-a02'
        WHEN 'cabin-b1' THEN 'cabin-b01'
        WHEN 'cabin-b2' THEN 'cabin-b02'
        WHEN 'cabin-b3' THEN 'cabin-b03'
        WHEN 'cabin-b4' THEN 'cabin-b04'
        WHEN 'cabin-b5' THEN 'cabin-b05'
        WHEN 'cabin-b6' THEN 'cabin-b06'
        WHEN 'cabin-b7' THEN 'cabin-b07'
        WHEN 'cabin-b8' THEN 'cabin-b08'
        WHEN 'antimatter-stores' THEN 'reactor-stores'
        ELSE old_r.key
      END
      WHERE old_r.key IN (
        'cabin-a1', 'cabin-a2',
        'cabin-b1', 'cabin-b2', 'cabin-b3', 'cabin-b4',
        'cabin-b5', 'cabin-b6', 'cabin-b7', 'cabin-b8',
        'antimatter-stores'
      )
      AND NOT EXISTS (
        SELECT 1 FROM ship_rooms new_r
        WHERE new_r.key = CASE old_r.key
          WHEN 'cabin-a1' THEN 'cabin-a01'
          WHEN 'cabin-a2' THEN 'cabin-a02'
          WHEN 'cabin-b1' THEN 'cabin-b01'
          WHEN 'cabin-b2' THEN 'cabin-b02'
          WHEN 'cabin-b3' THEN 'cabin-b03'
          WHEN 'cabin-b4' THEN 'cabin-b04'
          WHEN 'cabin-b5' THEN 'cabin-b05'
          WHEN 'cabin-b6' THEN 'cabin-b06'
          WHEN 'cabin-b7' THEN 'cabin-b07'
          WHEN 'cabin-b8' THEN 'cabin-b08'
          WHEN 'antimatter-stores' THEN 'reactor-stores'
          ELSE old_r.key
        END
      )
    `);

    await this.db.execute(sql`
      UPDATE ship_clocks
      SET room_key = CASE room_key
        WHEN 'cabin-a1' THEN 'cabin-a01'
        WHEN 'cabin-a2' THEN 'cabin-a02'
        WHEN 'cabin-b1' THEN 'cabin-b01'
        WHEN 'cabin-b2' THEN 'cabin-b02'
        WHEN 'cabin-b3' THEN 'cabin-b03'
        WHEN 'cabin-b4' THEN 'cabin-b04'
        WHEN 'cabin-b5' THEN 'cabin-b05'
        WHEN 'cabin-b6' THEN 'cabin-b06'
        WHEN 'cabin-b7' THEN 'cabin-b07'
        WHEN 'cabin-b8' THEN 'cabin-b08'
        WHEN 'comms-nav' THEN 'stealth-comms'
        WHEN 'fire-control' THEN 'stealth-comms'
        WHEN 'observation' THEN 'bridge'
        WHEN 'wardroom' THEN 'mess'
        WHEN 'science-lab' THEN 'log-vault'
        WHEN 'training' THEN 'armory'
        WHEN 'cargo' THEN 'hangar'
        WHEN 'life-support' THEN 'reactor-stores'
        WHEN 'eva-station' THEN 'armory'
        WHEN 'workshop' THEN 'engine-room'
        WHEN 'reactor' THEN 'reactor-stores'
        WHEN 'antimatter-stores' THEN 'reactor-stores'
        WHEN 'brig' THEN 'armory'
        WHEN 'sealed-bow' THEN 'breach-port'
        WHEN 'sealed-ordnance' THEN 'sealed-archive'
        ELSE room_key
      END
      WHERE room_key IN (
        'cabin-a1', 'cabin-a2',
        'cabin-b1', 'cabin-b2', 'cabin-b3', 'cabin-b4',
        'cabin-b5', 'cabin-b6', 'cabin-b7', 'cabin-b8',
        'comms-nav', 'fire-control', 'observation', 'wardroom', 'science-lab',
        'training', 'cargo', 'life-support', 'eva-station', 'workshop',
        'reactor', 'antimatter-stores', 'brig', 'sealed-bow', 'sealed-ordnance'
      )
    `);

    await this.db
      .insert(shipRooms)
      .values(
        DEFAULT_SHIP_ROOMS.map((room) => ({
          key: room.key,
          deckNumber: room.deckNumber,
          kind: room.kind,
          svgZoneId: room.svgZoneId,
          name: room.name,
          subtitle: room.subtitle,
          description: room.description,
          statusLabel: room.statusLabel,
          statusTone: room.statusTone,
          isLocked: room.isLocked,
          orderIndex: room.orderIndex,
        })),
      )
      .onConflictDoUpdate({
        target: shipRooms.key,
        set: shouldRefreshCanonicalCopy
          ? {
              deckNumber: sql`excluded.deck_number`,
              kind: sql`excluded.kind`,
              svgZoneId: sql`excluded.svg_zone_id`,
              name: sql`excluded.name`,
              subtitle: sql`excluded.subtitle`,
              description: sql`excluded.description`,
              statusLabel: sql`excluded.status_label`,
              statusTone: sql`excluded.status_tone`,
              orderIndex: sql`excluded.order_index`,
            }
          : {
              deckNumber: sql`excluded.deck_number`,
              svgZoneId: sql`excluded.svg_zone_id`,
              orderIndex: sql`excluded.order_index`,
            },
      });

    // Unify unedited legacy facility/sealed names to concise map names without overwriting GM customizations
    const legacySeedRenames: ReadonlyArray<{
      key: string;
      legacyNames: string[];
      nextName: string;
      nextSubtitle: string;
    }> = [
      {
        key: "stealth-comms",
        legacyNames: ["Häive- ja viestintäkeskus"],
        nextName: "Kuunteluasema",
        nextSubtitle: "Häivejärjestelmät ja Sisäinen ääni",
      },
      {
        key: "log-vault",
        legacyNames: ["Lokihyllyt ja tallennearkisto"],
        nextName: "Lokiholvi",
        nextSubtitle: "Irrotetut datalevyt ja ääninauhat",
      },
      {
        key: "captain-quarters",
        legacyNames: ["Neuvottelukajuutta"],
        nextName: "Kapteenin hytti",
        nextSubtitle: "Reittilaskelmat ja komentopöytä",
      },
      {
        key: "mess",
        legacyNames: ["Messi ja keittiö"],
        nextName: "Messi",
        nextSubtitle: "Keittiö, lautapelipöytä ja asemareliefi",
      },
      {
        key: "galley-stores",
        legacyNames: ["Muonavarasto ja biomassapuristin"],
        nextName: "Muonavarasto",
        nextSubtitle: "Säilykehyllyt ja biomassapuristin",
      },
      {
        key: "sealed-dormitory",
        legacyNames: ["Pimeä majoituslohko"],
        nextName: "Suljettu siipi",
        nextSubtitle: "Säästötilaan suljettu matkustajasiipi",
      },
      {
        key: "hangar",
        legacyNames: ["Sukkulahalli ja troolausasema"],
        nextName: "Sukkulahalli",
        nextSubtitle: "Yhteyssukkula, harppuunat ja seinämaalaus",
      },
      {
        key: "breach-port",
        legacyNames: ["Kilven kylkirepeämä"],
        nextName: "Kylkivaurio",
        nextSubtitle: "Hätälaipioitu paapuurin repeämä",
      },
      {
        key: "medbay",
        legacyNames: ["Lääkintäosasto"],
        nextName: "Sairastupa",
        nextSubtitle: "Kirurgiapöydät ja diagnostiikka",
      },
      {
        key: "armory",
        legacyNames: ["Varustamo ja harjoitustila"],
        nextName: "Varustamo",
        nextSubtitle: "Painepuvut, varustekaapit ja harjoitustila",
      },
      {
        key: "engine-room",
        legacyNames: ["Konehuone ja ohjainlevy"],
        nextName: "Konehuone",
        nextSubtitle: "Kolvattu ohjainlevy ja päätyöntö",
      },
      {
        key: "reactor-stores",
        legacyNames: ["Reaktori ja polttoainesäiliöt"],
        nextName: "Reaktori",
        nextSubtitle: "Polttoainesäiliöt, vaihemuuntimet ja vesikierto",
      },
      {
        key: "hvac-core",
        legacyNames: ["Ilmanvaihto- ja painekeskus"],
        nextName: "Ilmanvaihto",
        nextSubtitle: "Suodatinrummut ja kansipaineistus",
      },
      {
        key: "sealed-archive",
        legacyNames: ["Sinetöity muistiholvi"],
        nextName: "Laiva-arkisto",
        nextSubtitle: "Sinetöity muistiholvi ja palvelimet",
      },
      {
        key: "sealed-shafts",
        legacyNames: ["Pimeät huoltokuilut"],
        nextName: "Huoltokuilut",
        nextSubtitle: "Paineistamattomat pohjakäytävät",
      },
    ];

    for (const rename of legacySeedRenames) {
      await this.db
        .update(shipRooms)
        .set({
          name: rename.nextName,
          subtitle: rename.nextSubtitle,
          updatedAt: new Date(),
        })
        .where(and(eq(shipRooms.key, rename.key), inArray(shipRooms.name, rename.legacyNames)));
    }

    // Migrate any character claims from retired cabin keys into free canonical cabins
    const claimedRetiredCabins = await this.db
      .select()
      .from(shipRooms)
      .where(
        and(
          inArray(shipRooms.key, retiredCabinKeys),
          sql`${shipRooms.claimedByCharacterId} IS NOT NULL`,
        ),
      )
      .orderBy(asc(shipRooms.orderIndex), asc(shipRooms.key));

    for (const legacyCabin of claimedRetiredCabins) {
      if (legacyCabin.claimedByCharacterId === null) continue;

      const availableCanonical = await this.db
        .select()
        .from(shipRooms)
        .where(
          and(
            eq(shipRooms.kind, "cabin"),
            sql`${shipRooms.claimedByCharacterId} IS NULL`,
            sql`${shipRooms.key} NOT IN (${sql.join(
              retiredShipRoomKeys.map((key) => sql`${key}`),
              sql`, `,
            )})`,
          ),
        )
        .orderBy(asc(shipRooms.orderIndex), asc(shipRooms.key))
        .limit(1);

      const targetCabin = availableCanonical[0];
      if (!targetCabin) continue;

      await this.db
        .update(shipRooms)
        .set({ claimedByCharacterId: null, updatedAt: new Date() })
        .where(eq(shipRooms.key, legacyCabin.key));

      await this.db
        .update(shipRooms)
        .set({
          claimedByCharacterId: legacyCabin.claimedByCharacterId,
          cabinCustomTitle: targetCabin.cabinCustomTitle ?? legacyCabin.cabinCustomTitle,
          cabinDecoration: targetCabin.cabinDecoration ?? legacyCabin.cabinDecoration,
          updatedAt: new Date(),
        })
        .where(eq(shipRooms.key, targetCabin.key));

      await this.db
        .update(shipClocks)
        .set({ roomKey: targetCabin.key, updatedAt: new Date() })
        .where(eq(shipClocks.roomKey, legacyCabin.key));
    }

    // Delete retired non-canonical rooms when unclaimed and without GM notes
    await this.db
      .delete(shipRooms)
      .where(
        and(
          inArray(shipRooms.key, retiredShipRoomKeys),
          sql`${shipRooms.claimedByCharacterId} IS NULL`,
          sql`${shipRooms.gmRoomNotes} IS NULL`,
        ),
      );
  }

  private assertCharacterAlive(character: { removedFromPlayAt: Date | null; harmit: unknown }) {
    const entries = parseHarmitEntries(character.harmit);
    if (character.removedFromPlayAt || entries.length >= 5) {
      throw new BadRequestException("Pelistä poistunut hahmo ei voi toimia tukikohdassa.");
    }
  }

  private assertOwnerOrGm(character: { userId: number }, user: AuthUser) {
    if (character.userId !== user.id && user.role !== "gm") {
      throw new ForbiddenException("Sinulla ei ole oikeutta muokata tätä hahmoa.");
    }
  }

  // ─── Overview ───────────────────────────────────────────────────────────────

  async getOverview(user: AuthUser) {
    const configRows = await this.db.select().from(shipConfig).limit(1);
    const config = configRows[0] ?? {
      id: DEFAULT_SHIP_CONFIG.id,
      name: DEFAULT_SHIP_CONFIG.name,
      callsign: DEFAULT_SHIP_CONFIG.callsign,
      theme: DEFAULT_SHIP_CONFIG.theme,
      statusBanner: DEFAULT_SHIP_CONFIG.statusBanner,
      hullNotes: DEFAULT_SHIP_CONFIG.hullNotes,
      updatedAt: new Date(),
    };

    const roomRows = await this.db
      .select({
        id: shipRooms.id,
        key: shipRooms.key,
        deckNumber: shipRooms.deckNumber,
        kind: shipRooms.kind,
        svgZoneId: shipRooms.svgZoneId,
        name: shipRooms.name,
        subtitle: shipRooms.subtitle,
        description: shipRooms.description,
        statusLabel: shipRooms.statusLabel,
        statusTone: shipRooms.statusTone,
        isLocked: shipRooms.isLocked,
        claimedByCharacterId: shipRooms.claimedByCharacterId,
        cabinCustomTitle: shipRooms.cabinCustomTitle,
        cabinDecoration: shipRooms.cabinDecoration,
        gmRoomNotes: shipRooms.gmRoomNotes,
        orderIndex: shipRooms.orderIndex,
        updatedAt: shipRooms.updatedAt,
        occupantName: characters.name,
        occupantArchetype: characters.archetype,
        occupantUserId: characters.userId,
        occupantOwnerName: users.username,
      })
      .from(shipRooms)
      .leftJoin(characters, eq(shipRooms.claimedByCharacterId, characters.id))
      .leftJoin(users, eq(characters.userId, users.id))
      .orderBy(asc(shipRooms.deckNumber), asc(shipRooms.orderIndex), asc(shipRooms.id));

    const rooms = roomRows.map((row) => ({
      id: row.id,
      key: row.key,
      deckNumber: row.deckNumber,
      kind: row.kind as "facility" | "cabin" | "sealed",
      svgZoneId: row.svgZoneId,
      name: row.name,
      subtitle: row.subtitle,
      description: row.description,
      statusLabel: row.statusLabel,
      statusTone: row.statusTone as "normal" | "warning" | "critical" | "locked",
      isLocked: row.isLocked,
      claimedByCharacterId: row.claimedByCharacterId,
      cabinCustomTitle: row.cabinCustomTitle,
      cabinDecoration: row.cabinDecoration,
      gmRoomNotes: user.role === "gm" ? row.gmRoomNotes : null,
      orderIndex: row.orderIndex,
      occupant:
        row.claimedByCharacterId && row.occupantName
          ? {
              characterId: row.claimedByCharacterId,
              name: row.occupantName,
              archetype: row.occupantArchetype ?? "",
              userId: row.occupantUserId ?? 0,
              ownerName: row.occupantOwnerName ?? "Miehistön jäsen",
              isOwn: row.occupantUserId === user.id,
            }
          : null,
    }));

    const userChars = await this.db
      .select({
        id: characters.id,
        userId: characters.userId,
        name: characters.name,
        archetype: characters.archetype,
        harmit: characters.harmit,
        removedFromPlayAt: characters.removedFromPlayAt,
      })
      .from(characters)
      .where(user.role === "gm" ? undefined : eq(characters.userId, user.id))
      .orderBy(asc(characters.id));

    const myChars = userChars.filter((c) => c.userId === user.id);
    const livingMyChars = myChars.filter(
      (c) => !c.removedFromPlayAt && parseHarmitEntries(c.harmit).length < 5,
    );

    const allClocks = await this.listClocks(user);
    const roomByChar = new Map<number, { key: string; name: string; deckNumber: number }>();
    for (const room of rooms) {
      if (room.claimedByCharacterId) {
        roomByChar.set(room.claimedByCharacterId, {
          key: room.key,
          name: room.name,
          deckNumber: room.deckNumber,
        });
      }
    }

    const myCharactersSummary = livingMyChars.map((c) => ({
      id: c.id,
      name: c.name,
      archetype: c.archetype,
      activeHarmitCount: getActiveHarmiItems(c.harmit).length,
      availableDice: Math.max(0, 5 - getActiveHarmiItems(c.harmit).length),
      claimedRoom: roomByChar.get(c.id) ?? null,
    }));

    const crewCharacters = userChars
      .filter((c) => !c.removedFromPlayAt && parseHarmitEntries(c.harmit).length < 5)
      .map((c) => ({
        id: c.id,
        name: c.name,
        archetype: c.archetype,
        userId: c.userId,
        claimedRoom: roomByChar.get(c.id) ?? null,
      }));

    // Upcoming mission preps visible across the crew & GM
    const upcomingPrepTurns = await this.db
      .select({
        id: shipDowntimeTurns.id,
        characterId: shipDowntimeTurns.characterId,
        characterName: characters.name,
        lockedEpisodeId: shipDowntimeTurns.lockedEpisodeId,
        episodeTitle: episodes.title,
        episodeStatus: episodes.status,
        resolutionJson: shipDowntimeTurns.resolutionJson,
        resolvedAt: shipDowntimeTurns.resolvedAt,
      })
      .from(shipDowntimeTurns)
      .innerJoin(characters, eq(shipDowntimeTurns.characterId, characters.id))
      .leftJoin(episodes, eq(shipDowntimeTurns.lockedEpisodeId, episodes.id))
      .where(eq(shipDowntimeTurns.status, "resolved"))
      .orderBy(desc(shipDowntimeTurns.resolvedAt));

    const upcomingPreps = upcomingPrepTurns
      .map((turn) => {
        const res = turn.resolutionJson as DowntimeResolutionPayload | null;
        if (!res?.prepResult || res.prepResult.diceCount <= 0) return null;
        return {
          turnId: turn.id,
          characterId: turn.characterId,
          characterName: turn.characterName,
          episodeId: turn.lockedEpisodeId,
          episodeTitle: turn.episodeTitle ?? "Tuleva jakso",
          episodeStatus: turn.episodeStatus ?? "planned",
          diceCount: res.prepResult.diceCount,
          description: res.prepResult.description,
          rolls: res.prepResult.rolls,
          hits: res.prepResult.hits,
          hasDoubles: res.prepResult.hasDoubles,
          isCritical: res.prepResult.isCritical,
          resolvedAt: turn.resolvedAt,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      config,
      rooms,
      clocks: allClocks,
      myCharacters: myCharactersSummary,
      crewCharacters,
      upcomingPreps,
    };
  }

  // ─── GM Ship Config & Rooms ─────────────────────────────────────────────────

  async updateConfig(dto: UpdateShipConfigDto) {
    await this.ensureSeedData();
    const updateValues: Partial<typeof shipConfig.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (dto.theme !== undefined) updateValues.theme = dto.theme;
    if (dto.statusBanner !== undefined) updateValues.statusBanner = dto.statusBanner;
    if (dto.hullNotes !== undefined) updateValues.hullNotes = dto.hullNotes;

    const updated = await this.db
      .update(shipConfig)
      .set(updateValues)
      .where(eq(shipConfig.id, DEFAULT_SHIP_CONFIG.id))
      .returning();

    return updated[0];
  }

  async createRoom(dto: CreateShipRoomDto) {
    const existing = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.key, dto.key),
    });
    if (existing) {
      throw new BadRequestException("Tällä tunnisteella on jo osasto.");
    }

    const inserted = await this.db
      .insert(shipRooms)
      .values({
        key: dto.key,
        deckNumber: dto.deckNumber,
        kind: dto.kind,
        svgZoneId: dto.svgZoneId ?? dto.key,
        name: dto.name,
        subtitle: dto.subtitle ?? null,
        description: dto.description,
        statusLabel: dto.statusLabel ?? (dto.isLocked ? "Lukittu" : "Toiminnassa"),
        statusTone: dto.statusTone ?? (dto.isLocked ? "locked" : "normal"),
        isLocked: dto.isLocked ?? false,
        gmRoomNotes: dto.gmRoomNotes ?? null,
        orderIndex: dto.orderIndex ?? 500,
      })
      .returning();

    return inserted[0];
  }

  async updateRoom(key: string, dto: UpdateShipRoomDto) {
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.key, key),
    });
    if (!room) {
      throw new NotFoundException("Osastoa ei löytynyt.");
    }

    return this.db.transaction(async (tx) => {
      if (dto.claimedByCharacterId !== undefined && dto.claimedByCharacterId !== null) {
        const targetChar = await tx.query.characters.findFirst({
          where: eq(characters.id, dto.claimedByCharacterId),
        });
        if (!targetChar) {
          throw new NotFoundException("Hahmoa ei löytynyt.");
        }
        await tx
          .update(shipRooms)
          .set({
            claimedByCharacterId: null,
            updatedAt: new Date(),
          })
          .where(eq(shipRooms.claimedByCharacterId, dto.claimedByCharacterId));
      }

      const updateValues: Partial<typeof shipRooms.$inferInsert> = {
        updatedAt: new Date(),
      };
      if (dto.name !== undefined) {
        const trimmedName = dto.name.trim();
        if (trimmedName.length === 0) {
          throw new BadRequestException("Osaston nimi ei voi olla tyhjä.");
        }
        updateValues.name = trimmedName;
      }
      if (dto.subtitle !== undefined) {
        updateValues.subtitle = dto.subtitle ? dto.subtitle.trim() || null : null;
      }
      if (dto.description !== undefined) {
        updateValues.description = dto.description.trim();
      }
      if (dto.statusLabel !== undefined) {
        const trimmedLabel = dto.statusLabel.trim();
        if (trimmedLabel.length === 0) {
          throw new BadRequestException("Tilateksti ei voi olla tyhjä.");
        }
        updateValues.statusLabel = trimmedLabel;
      }
      if (dto.statusTone !== undefined) updateValues.statusTone = dto.statusTone;
      if (dto.isLocked !== undefined) updateValues.isLocked = dto.isLocked;
      if (dto.gmRoomNotes !== undefined) updateValues.gmRoomNotes = dto.gmRoomNotes;
      if (dto.claimedByCharacterId !== undefined) {
        updateValues.claimedByCharacterId = dto.claimedByCharacterId;
      }
      if (dto.orderIndex !== undefined) updateValues.orderIndex = dto.orderIndex;

      const updated = await tx
        .update(shipRooms)
        .set(updateValues)
        .where(eq(shipRooms.key, key))
        .returning();

      return updated[0];
    });
  }

  // ─── Cabins & Claiming ──────────────────────────────────────────────────────

  async claimCabin(key: string, dto: ClaimCabinDto, user: AuthUser) {
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.key, key),
    });
    if (!room) {
      throw new NotFoundException("Hyttiä ei löytynyt.");
    }
    if (room.kind !== "cabin") {
      throw new BadRequestException("Vain miehistö- tai upseerihytin voi varata.");
    }
    if (room.isLocked) {
      throw new BadRequestException("Lukittua hyttiä ei voi varata.");
    }
    if (room.claimedByCharacterId !== null && room.claimedByCharacterId !== dto.characterId) {
      throw new BadRequestException("Hytti on jo varattu toiselle hahmolle.");
    }

    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, dto.characterId),
    });
    if (!character) {
      throw new NotFoundException("Hahmoa ei löytynyt.");
    }
    this.assertOwnerOrGm(character, user);
    this.assertCharacterAlive(character);

    return this.db.transaction(async (tx) => {
      await tx
        .update(shipRooms)
        .set({
          claimedByCharacterId: null,
          updatedAt: new Date(),
        })
        .where(eq(shipRooms.claimedByCharacterId, dto.characterId));

      const updated = await tx
        .update(shipRooms)
        .set({
          claimedByCharacterId: dto.characterId,
          updatedAt: new Date(),
        })
        .where(eq(shipRooms.key, key))
        .returning();

      return updated[0];
    });
  }

  async vacateCabin(key: string, user: AuthUser) {
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.key, key),
    });
    if (!room) {
      throw new NotFoundException("Hyttiä ei löytynyt.");
    }
    if (!room.claimedByCharacterId) {
      return room;
    }

    if (user.role !== "gm") {
      const occupant = await this.db.query.characters.findFirst({
        where: eq(characters.id, room.claimedByCharacterId),
      });
      if (!occupant || occupant.userId !== user.id) {
        throw new ForbiddenException("Voit vapauttaa vain oman hahmosi hytin.");
      }
    }

    const updated = await this.db
      .update(shipRooms)
      .set({
        claimedByCharacterId: null,
        cabinCustomTitle: null,
        cabinDecoration: null,
        updatedAt: new Date(),
      })
      .where(eq(shipRooms.key, key))
      .returning();

    return updated[0];
  }

  async getCabinDetails(characterId: number, user: AuthUser) {
    const charRows = await this.db
      .select({
        id: characters.id,
        userId: characters.userId,
        name: characters.name,
        archetype: characters.archetype,
        removedFromPlayAt: characters.removedFromPlayAt,
        harmit: characters.harmit,
        ownerName: users.username,
      })
      .from(characters)
      .leftJoin(users, eq(characters.userId, users.id))
      .where(eq(characters.id, characterId))
      .limit(1);

    const character = charRows[0];
    if (!character) {
      throw new NotFoundException("Hahmoa ei löytynyt.");
    }

    const claimedRoom = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.claimedByCharacterId, characterId),
    });

    const possessions = await this.db
      .select()
      .from(cabinPossessions)
      .where(eq(cabinPossessions.characterId, characterId))
      .orderBy(asc(cabinPossessions.orderIndex), asc(cabinPossessions.id));

    return {
      character: {
        id: character.id,
        userId: character.userId,
        name: character.name,
        archetype: character.archetype,
        ownerName: character.ownerName ?? "Miehistön jäsen",
        isOwn: character.userId === user.id,
      },
      claimedRoom: claimedRoom ?? null,
      possessions: possessions.map((item) => ({
        ...item,
        isLockedByGm: isPossessionLocked(item.gmMechanicalNotes),
      })),
      canEditInterior: character.userId === user.id || user.role === "gm",
      isGm: user.role === "gm",
    };
  }

  async updateCabinInterior(characterId: number, dto: UpdateCabinInteriorDto, user: AuthUser) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Hahmoa ei löytynyt.");
    }
    this.assertOwnerOrGm(character, user);

    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.claimedByCharacterId, characterId),
    });
    if (!room) {
      throw new BadRequestException("Varaa ensin hytti kansikartalta ennen sisustamista.");
    }

    const updateValues: Partial<typeof shipRooms.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (dto.cabinCustomTitle !== undefined) {
      updateValues.cabinCustomTitle = dto.cabinCustomTitle?.trim() || null;
    }
    if (dto.cabinDecoration !== undefined) {
      updateValues.cabinDecoration = dto.cabinDecoration;
    }

    const updated = await this.db
      .update(shipRooms)
      .set(updateValues)
      .where(eq(shipRooms.id, room.id))
      .returning();

    return updated[0];
  }

  // ─── Special Cabin Possessions ──────────────────────────────────────────────

  async createPossession(characterId: number, dto: CreatePossessionDto, user: AuthUser) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Hahmoa ei löytynyt.");
    }
    this.assertOwnerOrGm(character, user);

    if (user.role !== "gm" && dto.gmMechanicalNotes !== undefined) {
      throw new ForbiddenException("Vain pelinjohtaja voi lisätä pelimekaanisia huomioita.");
    }

    const normalizedGmNotes =
      user.role === "gm" && typeof dto.gmMechanicalNotes === "string"
        ? dto.gmMechanicalNotes.trim() || null
        : null;

    const inserted = await this.db
      .insert(cabinPossessions)
      .values({
        characterId,
        name: dto.name.trim(),
        description: dto.description?.trim() ?? "",
        gmMechanicalNotes: normalizedGmNotes,
        orderIndex: dto.orderIndex ?? 0,
      })
      .returning();

    const item = inserted[0];
    return {
      ...item,
      isLockedByGm: isPossessionLocked(item.gmMechanicalNotes),
    };
  }

  async updatePossession(id: number, dto: UpdatePossessionDto, user: AuthUser) {
    const existing = await this.db.query.cabinPossessions.findFirst({
      where: eq(cabinPossessions.id, id),
    });
    if (!existing) {
      throw new NotFoundException("Omistusta ei löytynyt.");
    }

    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, existing.characterId),
    });
    if (!character) {
      throw new NotFoundException("Hahmoa ei löytynyt.");
    }
    this.assertOwnerOrGm(character, user);

    if (user.role !== "gm") {
      if (isPossessionLocked(existing.gmMechanicalNotes)) {
        throw new ForbiddenException(
          "Pelinjohtajan pelimekaanisella huomiolla merkitsemää omistusta ei voi muokata.",
        );
      }
      if (dto.gmMechanicalNotes !== undefined) {
        throw new ForbiddenException("Vain pelinjohtaja voi muokata pelimekaanisia huomioita.");
      }
    }

    const updateValues: Partial<typeof cabinPossessions.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (dto.name !== undefined) updateValues.name = dto.name.trim();
    if (dto.description !== undefined) updateValues.description = dto.description.trim();
    if (dto.orderIndex !== undefined) updateValues.orderIndex = dto.orderIndex;
    if (user.role === "gm" && dto.gmMechanicalNotes !== undefined) {
      updateValues.gmMechanicalNotes =
        typeof dto.gmMechanicalNotes === "string" ? dto.gmMechanicalNotes.trim() || null : null;
    }

    const updated = await this.db
      .update(cabinPossessions)
      .set(updateValues)
      .where(eq(cabinPossessions.id, id))
      .returning();

    const item = updated[0];
    return {
      ...item,
      isLockedByGm: isPossessionLocked(item.gmMechanicalNotes),
    };
  }

  async deletePossession(id: number, user: AuthUser) {
    const existing = await this.db.query.cabinPossessions.findFirst({
      where: eq(cabinPossessions.id, id),
    });
    if (!existing) {
      throw new NotFoundException("Omistusta ei löytynyt.");
    }

    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, existing.characterId),
    });
    if (!character) {
      throw new NotFoundException("Hahmoa ei löytynyt.");
    }
    this.assertOwnerOrGm(character, user);

    if (user.role !== "gm" && isPossessionLocked(existing.gmMechanicalNotes)) {
      throw new ForbiddenException(
        "Pelinjohtajan pelimekaanisella huomiolla merkitsemää omistusta ei voi poistaa.",
      );
    }

    await this.db.delete(cabinPossessions).where(eq(cabinPossessions.id, id));
    return { deleted: true };
  }

  // ─── Progress Clocks (Tutkimus & Projekti) ──────────────────────────────────

  async listClocks(user: AuthUser) {
    const rows = await this.db
      .select({
        id: shipClocks.id,
        category: shipClocks.category,
        scope: shipClocks.scope,
        characterId: shipClocks.characterId,
        characterName: characters.name,
        characterUserId: characters.userId,
        roomKey: shipClocks.roomKey,
        title: shipClocks.title,
        description: shipClocks.description,
        segmentsTotal: shipClocks.segmentsTotal,
        segmentsFilled: shipClocks.segmentsFilled,
        status: shipClocks.status,
        completionNotes: shipClocks.completionNotes,
        createdByUserId: shipClocks.createdByUserId,
        createdAt: shipClocks.createdAt,
        updatedAt: shipClocks.updatedAt,
      })
      .from(shipClocks)
      .leftJoin(characters, eq(shipClocks.characterId, characters.id))
      .orderBy(asc(shipClocks.status), desc(shipClocks.updatedAt), asc(shipClocks.id));

    return rows.filter(
      (clock) =>
        user.role === "gm" ||
        (clock.status !== "archived" &&
          (clock.scope === "ship" || clock.characterUserId === user.id)),
    );
  }

  async createClock(dto: CreateShipClockDto, user: AuthUser) {
    if (user.role !== "gm" && dto.segmentsTotal !== undefined && dto.segmentsTotal !== null) {
      throw new ForbiddenException("Vain pelinjohtaja asettaa kellon segmenttimäärän.");
    }

    let resolvedCharId: number | null = null;
    if (dto.scope === "character") {
      if (!dto.characterId) {
        throw new BadRequestException("Hahmokohtainen kello vaatii hahmon.");
      }
      const character = await this.db.query.characters.findFirst({
        where: eq(characters.id, dto.characterId),
      });
      if (!character) {
        throw new NotFoundException("Hahmoa ei löytynyt.");
      }
      this.assertOwnerOrGm(character, user);
      resolvedCharId = character.id;
    }

    if (dto.roomKey) {
      const room = await this.db.query.shipRooms.findFirst({
        where: eq(shipRooms.key, dto.roomKey),
      });
      if (!room) {
        throw new NotFoundException("Kytkettyä aluksen osastoa ei löytynyt.");
      }
    }

    const segmentsTotal = user.role === "gm" ? (dto.segmentsTotal ?? null) : null;
    const inserted = await this.db
      .insert(shipClocks)
      .values({
        category: dto.category,
        scope: dto.scope,
        characterId: resolvedCharId,
        roomKey: dto.roomKey ?? null,
        title: dto.title.trim(),
        description: dto.description?.trim() ?? "",
        segmentsTotal,
        segmentsFilled: 0,
        status: "active",
        createdByUserId: user.id,
      })
      .returning();

    return inserted[0];
  }

  async updateClock(id: number, dto: UpdateShipClockDto) {
    const existing = await this.db.query.shipClocks.findFirst({
      where: eq(shipClocks.id, id),
    });
    if (!existing) {
      throw new NotFoundException("Kelloa ei löytynyt.");
    }

    if (
      dto.segmentsTotal !== undefined &&
      dto.segmentsTotal !== null &&
      !VALID_CLOCK_SEGMENTS.has(dto.segmentsTotal)
    ) {
      throw new BadRequestException("Kellon koon on oltava 4, 6, 8, 10 tai 12.");
    }

    const nextSegmentsTotal =
      dto.segmentsTotal !== undefined ? dto.segmentsTotal : existing.segmentsTotal;
    const nextSegmentsFilled =
      dto.segmentsFilled !== undefined ? dto.segmentsFilled : existing.segmentsFilled;

    let nextStatus = dto.status ?? existing.status;
    if (
      dto.status === undefined &&
      nextSegmentsTotal !== null &&
      nextSegmentsFilled >= nextSegmentsTotal &&
      existing.status === "active"
    ) {
      nextStatus = "completed";
    }

    const updateValues: Partial<typeof shipClocks.$inferInsert> = {
      updatedAt: new Date(),
      status: nextStatus,
    };
    if (dto.title !== undefined) updateValues.title = dto.title.trim();
    if (dto.description !== undefined) updateValues.description = dto.description.trim();
    if (dto.category !== undefined) updateValues.category = dto.category;
    if (dto.scope !== undefined) {
      updateValues.scope = dto.scope;
      if (dto.scope === "ship") updateValues.characterId = null;
    }
    if (dto.characterId !== undefined) updateValues.characterId = dto.characterId;
    if (dto.roomKey !== undefined) updateValues.roomKey = dto.roomKey;
    if (dto.segmentsTotal !== undefined) updateValues.segmentsTotal = dto.segmentsTotal;
    if (dto.segmentsFilled !== undefined) updateValues.segmentsFilled = dto.segmentsFilled;
    if (dto.completionNotes !== undefined) {
      updateValues.completionNotes = dto.completionNotes?.trim() || null;
    }

    const updated = await this.db
      .update(shipClocks)
      .set(updateValues)
      .where(eq(shipClocks.id, id))
      .returning();

    return updated[0];
  }

  async deleteClock(id: number) {
    const existing = await this.db.query.shipClocks.findFirst({
      where: eq(shipClocks.id, id),
    });
    if (!existing) {
      throw new NotFoundException("Kelloa ei löytynyt.");
    }
    await this.db.delete(shipClocks).where(eq(shipClocks.id, id));
    return { deleted: true };
  }

  // ─── Downtime 5n20 Lifecycle & Resolution ───────────────────────────────────

  private async computeCharacterDowntimeContext(characterId: number, user: AuthUser) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Hahmoa ei löytynyt.");
    }
    this.assertOwnerOrGm(character, user);

    const activeHarmit = getActiveHarmiItems(character.harmit);
    const totalHarmitCount = parseHarmitEntries(character.harmit).length;
    const isLiving = !character.removedFromPlayAt && totalHarmitCount < 5;
    const availableDice = isLiving ? Math.max(0, 5 - activeHarmit.length) : 0;

    // Fetch all linked episodes via junction table
    const linkedRows = await this.db
      .select({
        episodeId: episodes.id,
        title: episodes.title,
        slug: episodes.slug,
        status: episodes.status,
        order: episodes.order,
      })
      .from(characterEpisodes)
      .innerJoin(episodes, eq(characterEpisodes.episodeId, episodes.id))
      .where(eq(characterEpisodes.characterId, characterId))
      .orderBy(asc(episodes.order), asc(episodes.id));

    const turns = await this.db
      .select()
      .from(shipDowntimeTurns)
      .where(eq(shipDowntimeTurns.characterId, characterId))
      .orderBy(desc(shipDowntimeTurns.resolvedAt), asc(shipDowntimeTurns.id));

    const resolvedEpisodeIds = new Set(
      turns.filter((t) => t.status === "resolved").map((t) => t.sourceCompletedEpisodeId),
    );

    const completedEpisodes = linkedRows.filter((ep) => ep.status === "completed");
    const latestCompletedEpisode = completedEpisodes[completedEpisodes.length - 1] ?? null;
    const pendingSourceEpisode =
      latestCompletedEpisode && !resolvedEpisodeIds.has(latestCompletedEpisode.episodeId)
        ? latestCompletedEpisode
        : null;

    const existingDraftTurn = pendingSourceEpisode
      ? (turns.find(
          (t) =>
            t.sourceCompletedEpisodeId === pendingSourceEpisode.episodeId && t.status === "draft",
        ) ?? null)
      : null;

    // Locked episode is any subsequent or active/planned episode the character has joined
    let lockedEpisode: (typeof linkedRows)[number] | null = null;
    if (pendingSourceEpisode) {
      const candidates = linkedRows.filter(
        (ep) =>
          ep.episodeId !== pendingSourceEpisode.episodeId &&
          (ep.status === "active" ||
            ep.status === "planned" ||
            ep.order > pendingSourceEpisode.order ||
            (ep.order === pendingSourceEpisode.order &&
              ep.episodeId > pendingSourceEpisode.episodeId)),
      );
      lockedEpisode =
        candidates.find((ep) => ep.status === "active" || ep.status === "planned") ??
        candidates[0] ??
        null;
    }

    const canDraft = Boolean(isLiving && pendingSourceEpisode);
    const canRoll = Boolean(isLiving && pendingSourceEpisode && lockedEpisode && availableDice > 0);

    let blockReason: string | null = null;
    if (!isLiving) {
      blockReason = "Pelistä poistuneella hahmolla ei ole väliaikavuoroa.";
    } else if (!pendingSourceEpisode) {
      blockReason =
        "Väliaikanopat avautuvat heti, kun hahmon pelaama jakso merkitään päättyneeksi.";
    } else if (availableDice === 0) {
      blockReason = "Kaikki 5n20 ovat käytöstä pois aktiivisten harmien vuoksi.";
    } else if (!lockedEpisode) {
      blockReason =
        "Luonnos ja uudet kellot voi tallentaa heti, mutta heitto avautuu kun hahmo liitetään seuraavaan jaksoon.";
    }

    const allClocks = await this.listClocks(user);
    const eligibleClocks = allClocks.filter(
      (clock) =>
        clock.status === "active" && (clock.scope === "ship" || clock.characterId === characterId),
    );

    const resolvedEpisodeMap = new Map(linkedRows.map((ep) => [ep.episodeId, ep.title]));
    const resolvedTurns = turns
      .filter((t) => t.status === "resolved")
      .map((t) => ({
        id: t.id,
        sourceEpisodeId: t.sourceCompletedEpisodeId,
        sourceEpisodeTitle:
          resolvedEpisodeMap.get(t.sourceCompletedEpisodeId) ??
          `Jakso #${t.sourceCompletedEpisodeId}`,
        lockedEpisodeId: t.lockedEpisodeId,
        lockedEpisodeTitle: t.lockedEpisodeId
          ? (resolvedEpisodeMap.get(t.lockedEpisodeId) ?? `Jakso #${t.lockedEpisodeId}`)
          : null,
        resolvedAt: t.resolvedAt,
        resolution: t.resolutionJson as DowntimeResolutionPayload | null,
      }));

    return {
      character: {
        id: character.id,
        name: character.name,
        archetype: character.archetype,
        isLiving,
        harmit: parseHarmitEntries(character.harmit),
      },
      availableDice,
      activeHarmit,
      pendingSourceEpisode,
      lockedEpisode,
      canDraft,
      canRoll,
      blockReason,
      draft: existingDraftTurn
        ? normalizeDraft(existingDraftTurn.draftAllocationJson)
        : emptyDraft(),
      eligibleClocks,
      resolvedTurns,
    };
  }

  async getCharacterDowntime(characterId: number, user: AuthUser) {
    return this.computeCharacterDowntimeContext(characterId, user);
  }

  private validateAllocation(
    dto: DowntimeAllocationDto,
    ctx: Awaited<ReturnType<ShipService["computeCharacterDowntimeContext"]>>,
  ): DowntimeDraftPayload {
    const healedHarmiIndices = Array.from(new Set(dto.healedHarmiIndices));
    const activeIndexSet = new Set(ctx.activeHarmit.map((h) => h.index));
    for (const idx of healedHarmiIndices) {
      if (!activeIndexSet.has(idx)) {
        throw new BadRequestException("Valittu harmi ei ole aktiivinen parannettava harmi.");
      }
    }

    const eligibleClockIds = new Set(ctx.eligibleClocks.map((c) => c.id));
    const clockDice: Record<number, number> = {};
    let clockTotal = 0;

    for (const [rawKey, rawCount] of Object.entries(dto.clockDice ?? {})) {
      const clockId = Number(rawKey);
      if (!Number.isInteger(clockId) || clockId <= 0) {
        throw new BadRequestException("Virheellinen kellon tunniste.");
      }
      if (!Number.isInteger(rawCount) || rawCount < 0 || rawCount > 5) {
        throw new BadRequestException("Virheellinen noppamäärä kellossa.");
      }
      if (rawCount === 0) continue;
      if (!eligibleClockIds.has(clockId)) {
        throw new BadRequestException("Valittuun kelloon ei voi sijoittaa tämän hahmon noppia.");
      }
      clockDice[clockId] = rawCount;
      clockTotal += rawCount;
    }

    const totalAllocated = healedHarmiIndices.length + clockTotal + dto.prepDice;
    if (totalAllocated > ctx.availableDice) {
      throw new BadRequestException(
        `Sijoitettuja noppia (${totalAllocated}) on enemmän kuin käytettävissä (${ctx.availableDice}).`,
      );
    }

    return {
      healedHarmiIndices,
      clockDice,
      prepDice: dto.prepDice,
      prepDescription: dto.prepDescription.trim(),
    };
  }

  async saveDowntimeDraft(characterId: number, dto: DowntimeAllocationDto, user: AuthUser) {
    const ctx = await this.computeCharacterDowntimeContext(characterId, user);
    if (!ctx.canDraft || !ctx.pendingSourceEpisode) {
      throw new BadRequestException(
        ctx.blockReason ?? "Tällä hahmolla ei ole luonnosteltavaa väliaikavuoroa.",
      );
    }

    const normalized = this.validateAllocation(dto, ctx);
    const existing = await this.db.query.shipDowntimeTurns.findFirst({
      where: and(
        eq(shipDowntimeTurns.characterId, characterId),
        eq(shipDowntimeTurns.sourceCompletedEpisodeId, ctx.pendingSourceEpisode.episodeId),
      ),
    });

    if (existing?.status === "resolved") {
      throw new BadRequestException("Tämä väliaikavuoro on jo ratkaistu.");
    }

    if (existing) {
      const updated = await this.db
        .update(shipDowntimeTurns)
        .set({
          lockedEpisodeId: ctx.lockedEpisode?.episodeId ?? null,
          draftAllocationJson: normalized,
          updatedAt: new Date(),
        })
        .where(eq(shipDowntimeTurns.id, existing.id))
        .returning();
      return updated[0];
    }

    const inserted = await this.db
      .insert(shipDowntimeTurns)
      .values({
        characterId,
        sourceCompletedEpisodeId: ctx.pendingSourceEpisode.episodeId,
        lockedEpisodeId: ctx.lockedEpisode?.episodeId ?? null,
        status: "draft",
        draftAllocationJson: normalized,
      })
      .returning();

    return inserted[0];
  }

  async resolveDowntime(characterId: number, dto: DowntimeAllocationDto, user: AuthUser) {
    const ctx = await this.computeCharacterDowntimeContext(characterId, user);
    if (!ctx.canRoll || !ctx.pendingSourceEpisode || !ctx.lockedEpisode) {
      throw new BadRequestException(
        ctx.blockReason ??
          "Väliaikaa ei voi vielä heittää ennen hahmon lukitsemista seuraavaan jaksoon.",
      );
    }

    const allocation = this.validateAllocation(dto, ctx);
    const totalAllocated =
      allocation.healedHarmiIndices.length +
      Object.values(allocation.clockDice).reduce((sum, count) => sum + count, 0) +
      allocation.prepDice;

    if (totalAllocated !== ctx.availableDice) {
      throw new BadRequestException(
        `Sijoita kaikki käytettävissä olevat nopat (${ctx.availableDice}) ennen vahvistusta.`,
      );
    }

    if (allocation.prepDice > 0 && allocation.prepDescription.length === 0) {
      throw new BadRequestException(
        "Kirjoita lyhyt kuvaus keikkavalmistautumiselle ennen heittoa.",
      );
    }

    const sourceEpisodeId = ctx.pendingSourceEpisode.episodeId;
    const lockedEpisodeId = ctx.lockedEpisode.episodeId;

    return this.db.transaction(async (tx) => {
      const existingTurn = await tx.query.shipDowntimeTurns.findFirst({
        where: and(
          eq(shipDowntimeTurns.characterId, characterId),
          eq(shipDowntimeTurns.sourceCompletedEpisodeId, sourceEpisodeId),
        ),
      });
      if (existingTurn?.status === "resolved") {
        throw new BadRequestException("Tämä väliaikavuoro on jo ratkaistu.");
      }

      // 1. Apply 1:1 Hahmon lepo healing to characters.harmit
      const healIndexSet = new Set(allocation.healedHarmiIndices);
      const healedHarmit: Array<{ index: number; text: string }> = [];
      const updatedHarmit = ctx.character.harmit.map((entry, idx) => {
        if (healIndexSet.has(idx) && !entry.healed) {
          healedHarmit.push({ index: idx, text: entry.text });
          return { ...entry, healed: true };
        }
        return entry;
      });

      const updatedCharRows = await tx
        .update(characters)
        .set({
          harmit: updatedHarmit,
          updatedAt: new Date(),
        })
        .where(eq(characters.id, characterId))
        .returning();

      const updatedChar = updatedCharRows[0];
      if (updatedChar) {
        await tx.insert(characterArcSnapshots).values({
          characterId,
          episodeId: lockedEpisodeId,
          reason: "downtime",
          sheetJson: updatedChar,
        });
      }

      // 2. Roll & update Tutkimus / Projekti clocks
      const clockResults: DowntimeResolutionPayload["clockResults"] = [];
      const targetClockIds = Object.keys(allocation.clockDice).map(Number);

      if (targetClockIds.length > 0) {
        const targetClockRows = await tx
          .select()
          .from(shipClocks)
          .where(inArray(shipClocks.id, targetClockIds));
        const clockMap = new Map(targetClockRows.map((c) => [c.id, c]));

        for (const clockId of targetClockIds) {
          const diceCount = allocation.clockDice[clockId] ?? 0;
          if (diceCount <= 0) continue;

          const clock = clockMap.get(clockId);
          if (!clock) {
            throw new NotFoundException(`Kelloa #${clockId} ei löytynyt.`);
          }

          const outcome = rollDowntimePool(diceCount);
          const nextFilled = clock.segmentsFilled + outcome.totalTicks;
          const completedNow =
            clock.segmentsTotal !== null &&
            clock.segmentsFilled < clock.segmentsTotal &&
            nextFilled >= clock.segmentsTotal;

          await tx
            .update(shipClocks)
            .set({
              segmentsFilled: nextFilled,
              status:
                clock.segmentsTotal !== null && nextFilled >= clock.segmentsTotal
                  ? "completed"
                  : clock.status,
              updatedAt: new Date(),
            })
            .where(eq(shipClocks.id, clock.id));

          clockResults.push({
            clockId: clock.id,
            title: clock.title,
            category: clock.category as "tutkimus" | "projekti",
            diceCount,
            rolls: outcome.rolls,
            hits: outcome.hits,
            hasDoubles: outcome.hasDoubles,
            isCritical: outcome.isCritical,
            ticksAdded: outcome.totalTicks,
            segmentsFilledAfter: nextFilled,
            segmentsTotal: clock.segmentsTotal,
            completedNow,
          });
        }
      }

      // 3. Roll Keikkavalmistautuminen
      let prepResult: DowntimeResolutionPayload["prepResult"] = null;
      if (allocation.prepDice > 0) {
        const outcome = rollDowntimePool(allocation.prepDice);
        prepResult = {
          diceCount: allocation.prepDice,
          description: allocation.prepDescription,
          rolls: outcome.rolls,
          hits: outcome.hits,
          hasDoubles: outcome.hasDoubles,
          isCritical: outcome.isCritical,
        };
      }

      const resolution: DowntimeResolutionPayload = {
        availableDice: ctx.availableDice,
        healedHarmit,
        clockResults,
        prepResult,
      };

      const now = new Date();
      if (existingTurn) {
        const updatedTurn = await tx
          .update(shipDowntimeTurns)
          .set({
            lockedEpisodeId,
            status: "resolved",
            draftAllocationJson: allocation,
            resolutionJson: resolution,
            resolvedAt: now,
            updatedAt: now,
          })
          .where(eq(shipDowntimeTurns.id, existingTurn.id))
          .returning();

        return {
          turn: updatedTurn[0],
          resolution,
        };
      }

      const insertedTurn = await tx
        .insert(shipDowntimeTurns)
        .values({
          characterId,
          sourceCompletedEpisodeId: sourceEpisodeId,
          lockedEpisodeId,
          status: "resolved",
          draftAllocationJson: allocation,
          resolutionJson: resolution,
          resolvedAt: now,
        })
        .returning();

      return {
        turn: insertedTurn[0],
        resolution,
      };
    });
  }
}
