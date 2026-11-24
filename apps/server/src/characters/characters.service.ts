import { randomUUID } from "node:crypto";
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  type OnModuleInit,
} from "@nestjs/common";
import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import {
  characterArcSnapshots,
  characterEpisodes,
  characterMonkPowers,
  characterPrivateNotes,
  characters,
  episodePlayers,
  episodes,
  monkPowers,
  sessions,
  users,
} from "../db/schema";
import { NotificationsService } from "../notifications/notifications.service";
import { addN4, decodeAttributeDice, kestoBonusFromPackedAttribute } from "./attribute-dice";
import type { AdvanceCharacterDto } from "./dto/advance-character.dto";
import type { AdvanceMonkDto } from "./dto/advance-monk.dto";
import type { CreateCharacterDto } from "./dto/create-character.dto";
import type { CreatePrivateNoteDto } from "./dto/create-private-note.dto";
import type { RefreshCharacterDto } from "./dto/refresh-character.dto";
import type { CharacterTattooDto, UpdateCharacterDto } from "./dto/update-character.dto";
import type { UpdatePrivateNoteDto } from "./dto/update-private-note.dto";

export interface CharacterTattoo {
  slot: number;
  title: string;
  description?: string;
}

function extractStoredTattoos(raw: unknown): CharacterTattoo[] {
  if (!Array.isArray(raw)) return [];
  const bySlot = new Map<number, CharacterTattoo>();
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const entry = item as { slot?: unknown; title?: unknown; description?: unknown };
    const slot = typeof entry.slot === "number" ? entry.slot : Number.NaN;
    const title = typeof entry.title === "string" ? entry.title.trim() : "";
    if (!Number.isInteger(slot) || slot < 1 || !title) continue;
    const description =
      typeof entry.description === "string" && entry.description.trim().length > 0
        ? entry.description.trim()
        : undefined;
    bySlot.set(slot, {
      slot,
      title,
      ...(description ? { description } : {}),
    });
  }
  return [...bySlot.values()].sort((a, b) => a.slot - b.slot);
}

function normalizeAndValidateTattoos(
  incoming: CharacterTattooDto[],
  effectiveMonkAllowed: number,
  existingTattoos: CharacterTattoo[],
): CharacterTattoo[] {
  const existingSlots = new Set(existingTattoos.map((t) => t.slot));
  const seenSlots = new Set<number>();
  const normalized: CharacterTattoo[] = [];

  for (const entry of incoming) {
    if (!Number.isInteger(entry.slot) || entry.slot < 1) {
      throw new BadRequestException("Virheellinen tatuointipaikka");
    }
    if (seenSlots.has(entry.slot)) {
      throw new BadRequestException("Sama tatuointipaikka ei voi esiintyä kahdesti");
    }
    seenSlots.add(entry.slot);

    const trimmedTitle = entry.title.trim();
    if (!trimmedTitle) {
      throw new BadRequestException("Tatuoinnin otsikko ei voi olla tyhjä");
    }

    if (entry.slot > effectiveMonkAllowed && !existingSlots.has(entry.slot)) {
      throw new BadRequestException("Tatuointipaikka ylittää hahmon munkki-potentiaalin");
    }

    const trimmedDescription = entry.description?.trim();
    normalized.push({
      slot: entry.slot,
      title: trimmedTitle,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    });
  }

  return normalized.sort((a, b) => a.slot - b.slot);
}

export const REBELLION_SKILL_SELECTION_NAME = "Kapinan riveissä taisteleva";
export const REBELLION_SKILL_ACQUIRED_NAME = "Kapinan riveissä taistellut";

function getSkillEntryName(entry: unknown): string {
  if (typeof entry === "string") return entry.trim();
  if (typeof entry === "object" && entry !== null && "name" in entry) {
    const raw = (entry as { name?: unknown }).name;
    return typeof raw === "string" ? raw.trim() : "";
  }
  return "";
}

function isRebellionSelectionName(name: string): boolean {
  return name.trim().toLowerCase() === REBELLION_SKILL_SELECTION_NAME.toLowerCase();
}

function isRebellionAcquiredName(name: string): boolean {
  return name.trim().toLowerCase() === REBELLION_SKILL_ACQUIRED_NAME.toLowerCase();
}

function isReservedRebellionName(name: string): boolean {
  return isRebellionSelectionName(name) || isRebellionAcquiredName(name);
}

function ensureRebellionSkillInArray(skills: unknown[]): unknown[] {
  const existing = Array.isArray(skills) ? [...skills] : [];
  const hasAcquired = existing.some((s) => isRebellionAcquiredName(getSkillEntryName(s)));
  if (hasAcquired) {
    return existing.map((s) =>
      isRebellionAcquiredName(getSkillEntryName(s))
        ? { name: REBELLION_SKILL_ACQUIRED_NAME, isCustom: false, locked: true }
        : s,
    );
  }
  return [...existing, { name: REBELLION_SKILL_ACQUIRED_NAME, isCustom: false, locked: true }];
}

const ATTRIBUTE_DICE_FACES = [4, 6, 8, 10, 12] as const;

export function formatPackedAttributeDice(packed: number): string {
  if (!Number.isInteger(packed) || packed < 0 || packed > 242) {
    return "—";
  }
  const counts = decodeAttributeDice(packed);
  const parts: string[] = [];
  for (let i = ATTRIBUTE_DICE_FACES.length - 1; i >= 0; i -= 1) {
    const count = counts[i];
    if (count > 0) {
      parts.push(`${count}n${ATTRIBUTE_DICE_FACES[i]}`);
    }
  }
  return parts.length > 0 ? parts.join(", ") : "—";
}

function formatSexFi(sex: unknown): string {
  switch (sex) {
    case "male":
      return "Mies";
    case "female":
      return "Nainen";
    case "non-binary":
      return "Ei-binäärinen";
    default:
      return "Ei määritelty";
  }
}

function formatEpisodeStatusFi(status: string): string {
  switch (status) {
    case "active":
      return "Aktiivinen";
    case "completed":
      return "Arkistoitu";
    case "planned":
      return "Tulossa";
    default:
      return status;
  }
}

function formatDiceCounts(dice: Array<{ faces: number }>): string {
  if (dice.length === 0) return "";
  const counts = new Map<number, number>();
  for (const die of dice) {
    counts.set(die.faces, (counts.get(die.faces) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([faces, count]) => `${count}×n${faces}`)
    .join(", ");
}

function extractSqlRows(result: unknown): Record<string, unknown>[] {
  if (Array.isArray(result)) {
    return result as Record<string, unknown>[];
  }
  if (
    typeof result === "object" &&
    result !== null &&
    "rows" in result &&
    Array.isArray((result as { rows?: unknown }).rows)
  ) {
    return (result as { rows: Record<string, unknown>[] }).rows;
  }
  return [];
}

interface ShipCabinInfo {
  key: string;
  deckNumber: number;
  name: string;
  cabinCustomTitle: string | null;
  cabinDecoration: string | null;
  gmRoomNotes: string | null;
}

interface ShipPossessionInfo {
  name: string;
  description: string;
  gmMechanicalNotes: string | null;
}

interface ShipClockInfo {
  category: string;
  title: string;
  description: string;
  segmentsFilled: number;
  segmentsTotal: number | null;
  status: string;
  completionNotes: string | null;
}

interface OptionalShipData {
  cabinByChar: Map<number, ShipCabinInfo>;
  possessionsByChar: Map<number, ShipPossessionInfo[]>;
  clocksByChar: Map<number, ShipClockInfo[]>;
}

interface ExportPrivateNoteInfo {
  title: string | null;
  content: string;
  isPinned: boolean;
  episodeTitle: string | null;
  createdAtLabel: string | null;
}

const characterWithOwnerColumns = {
  id: characters.id,
  userId: characters.userId,
  name: characters.name,
  archetype: characters.archetype,
  sex: characters.sex,
  motivation: characters.motivation,
  notes: characters.notes,
  nicknames: characters.nicknames,
  keho: characters.keho,
  currentKeho: characters.currentKeho,
  mieli: characters.mieli,
  currentMieli: characters.currentMieli,
  tera: characters.tera,
  currentTera: characters.currentTera,
  sisuDice: characters.sisuDice,
  removedSisuIds: characters.removedSisuIds,
  harmit: characters.harmit,
  skills: characters.skills,
  inventory: characters.inventory,
  fysiikka: characters.fysiikka,
  nopeus: characters.nopeus,
  ymmarrys: characters.ymmarrys,
  persoona: characters.persoona,
  nakemys: characters.nakemys,
  napparyys: characters.napparyys,
  anchorId: sql<string | null>`COALESCE(${characters.anchorId}, ${users.anchorId})`.as("anchorId"),
  rebellionLevel: users.rebellionLevel,
  monkAdvancementsAllowed: characters.monkAdvancementsAllowed,
  monkAdvancementsUsed: characters.monkAdvancementsUsed,
  tattoos: characters.tattoos,
  removedFromPlayAt: characters.removedFromPlayAt,
  createdAt: characters.createdAt,
  updatedAt: characters.updatedAt,
  ownerName: users.username,
};

type CharacterEpisodeRow = {
  id: number;
  title: string;
  status: string;
  refreshedAt: Date | null;
  advancedAt: Date | null;
};

async function attachEpisodesForCharacters(
  db: NodePgDatabase<typeof schema>,
  rows: Array<Record<string, unknown>>,
): Promise<
  Array<
    Omit<(typeof rows)[number], never> & {
      episodes: CharacterEpisodeRow[];
      hasPlayedSessions: boolean;
    }
  >
> {
  if (rows.length === 0) {
    return rows as Array<
      (typeof rows)[number] & { episodes: CharacterEpisodeRow[]; hasPlayedSessions: boolean }
    >;
  }
  const characterIds = rows.map((r) => r.id as number);

  const [linkRows, playedRows] = await Promise.all([
    db
      .select({
        characterId: characterEpisodes.characterId,
        id: episodes.id,
        title: episodes.title,
        status: episodes.status,
        refreshedAt: characterEpisodes.refreshedAt,
        advancedAt: characterEpisodes.advancedAt,
      })
      .from(characterEpisodes)
      .innerJoin(episodes, eq(characterEpisodes.episodeId, episodes.id))
      .where(inArray(characterEpisodes.characterId, characterIds))
      .orderBy(asc(characterEpisodes.characterId), asc(episodes.order)),

    db
      .select({ characterId: characterEpisodes.characterId })
      .from(characterEpisodes)
      .innerJoin(
        sessions,
        and(eq(sessions.episodeId, characterEpisodes.episodeId), eq(sessions.status, "played")),
      )
      .where(inArray(characterEpisodes.characterId, characterIds))
      .orderBy(asc(characterEpisodes.characterId)),
  ]);

  const byChar = new Map<number, CharacterEpisodeRow[]>();
  for (const row of linkRows) {
    const list = byChar.get(row.characterId) ?? [];
    list.push({
      id: row.id,
      title: row.title,
      status: row.status,
      refreshedAt: row.refreshedAt,
      advancedAt: row.advancedAt,
    });
    byChar.set(row.characterId, list);
  }

  const withPlayedSessions = new Set<number>(playedRows.map((r) => r.characterId));

  return rows.map((r) => {
    const hasRebellion = Number(r.rebellionLevel ?? 0) >= 1;
    return {
      ...r,
      ...(hasRebellion && {
        skills: ensureRebellionSkillInArray(Array.isArray(r.skills) ? r.skills : []),
      }),
      episodes: byChar.get(r.id as number) ?? [],
      hasPlayedSessions: withPlayedSessions.has(r.id as number),
    };
  }) as Array<
    (typeof rows)[number] & { episodes: CharacterEpisodeRow[]; hasPlayedSessions: boolean }
  >;
}

export type MonkPowerWithAcquired = {
  id: number;
  name: string;
  tier: number;
  description: string | null;
  properties: Record<string, unknown>;
  acquiredAt: Date;
};

async function attachMonkPowersForCharacters(
  db: NodePgDatabase<typeof schema>,
  rows: Array<Record<string, unknown>>,
): Promise<Array<Record<string, unknown> & { monkPowers: MonkPowerWithAcquired[] }>> {
  if (rows.length === 0) {
    return rows as Array<Record<string, unknown> & { monkPowers: MonkPowerWithAcquired[] }>;
  }
  const characterIds = rows.map((r) => r.id as number);

  const powerRows = await db
    .select({
      characterId: characterMonkPowers.characterId,
      id: monkPowers.id,
      name: monkPowers.name,
      tier: monkPowers.tier,
      description: monkPowers.description,
      properties: monkPowers.properties,
      acquiredAt: characterMonkPowers.acquiredAt,
    })
    .from(characterMonkPowers)
    .innerJoin(monkPowers, eq(characterMonkPowers.powerId, monkPowers.id))
    .where(inArray(characterMonkPowers.characterId, characterIds))
    .orderBy(asc(monkPowers.tier), asc(monkPowers.name));

  const byChar = new Map<number, MonkPowerWithAcquired[]>();
  for (const row of powerRows) {
    const list = byChar.get(row.characterId) ?? [];
    list.push({
      id: row.id,
      name: row.name,
      tier: row.tier,
      description: row.description,
      properties: (row.properties ?? {}) as Record<string, unknown>,
      acquiredAt: row.acquiredAt,
    });
    byChar.set(row.characterId, list);
  }

  return rows.map((r) => ({
    ...r,
    monkPowers: byChar.get(r.id as number) ?? [],
  })) as Array<Record<string, unknown> & { monkPowers: MonkPowerWithAcquired[] }>;
}

@Injectable()
export class CharactersService implements OnModuleInit {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    if (typeof this.db.execute !== "function") return;
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS character_private_notes (
        id SERIAL PRIMARY KEY,
        character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
        episode_id INTEGER REFERENCES episodes(id) ON DELETE SET NULL,
        title TEXT,
        content TEXT NOT NULL,
        is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this.db.execute(sql`
      CREATE INDEX IF NOT EXISTS character_private_notes_char_pinned_idx
        ON character_private_notes (character_id, is_pinned)
    `);
    await this.db.execute(sql`
      ALTER TABLE characters
      ADD COLUMN IF NOT EXISTS tattoos JSONB NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  private hasFiveHarmit(harmit: unknown): boolean {
    return Array.isArray(harmit) && harmit.length >= 5;
  }

  private async assertOwnedLinkedCharacter(characterId: number, episodeId: number, userId: number) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId) {
      throw new ForbiddenException("You do not have permission to edit this character");
    }

    const linkRows = await this.db
      .select({
        id: characterEpisodes.id,
        refreshedAt: characterEpisodes.refreshedAt,
        advancedAt: characterEpisodes.advancedAt,
      })
      .from(characterEpisodes)
      .where(
        and(
          eq(characterEpisodes.characterId, characterId),
          eq(characterEpisodes.episodeId, episodeId),
        ),
      )
      .limit(1);
    const link = linkRows[0];
    if (!link) {
      throw new BadRequestException("Character is not linked to this episode");
    }

    return { character, link };
  }

  async findAll() {
    const rows = await this.db
      .select(characterWithOwnerColumns)
      .from(characters)
      .leftJoin(users, eq(characters.userId, users.id));
    const withEpisodes = await attachEpisodesForCharacters(this.db, rows);
    return attachMonkPowersForCharacters(this.db, withEpisodes);
  }

  async findOne(id: number) {
    const rows = await this.db
      .select(characterWithOwnerColumns)
      .from(characters)
      .leftJoin(users, eq(characters.userId, users.id))
      .where(eq(characters.id, id));
    const row = rows[0];
    if (!row) return null;
    const withEpisodes = await attachEpisodesForCharacters(this.db, [row]);
    const withPowers = await attachMonkPowersForCharacters(this.db, withEpisodes);
    return withPowers[0] ?? null;
  }

  async getClaimedAnchorIds(): Promise<string[]> {
    const rows = await this.db
      .select({ anchorId: users.anchorId })
      .from(users)
      .where(isNotNull(users.anchorId));
    return rows.map((r) => r.anchorId).filter((id): id is string => Boolean(id));
  }

  async create(data: CreateCharacterDto, userId: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const incomingSkills = Array.isArray(data.skills) ? data.skills : [];
    if (incomingSkills.some((s) => isReservedRebellionName(getSkillEntryName(s)))) {
      throw new BadRequestException("Tätä erikoistaitoa ei voi valita uutta hahmoa luodessa");
    }
    const effectiveSkills =
      (user?.rebellionLevel ?? 0) >= 1
        ? ensureRebellionSkillInArray(incomingSkills)
        : incomingSkills;

    let effectiveAnchorId = user?.anchorId ?? null;
    let shouldUpdateUserAnchor = false;

    if (!effectiveAnchorId && data.anchorId) {
      // Check if another user has claimed this anchor
      const claimed = await this.db.query.users.findFirst({
        where: eq(users.anchorId, data.anchorId),
      });
      if (claimed && claimed.id !== userId) {
        throw new BadRequestException("Ankkuri on jo toisen pelaajan varaama");
      }
      effectiveAnchorId = data.anchorId;
      shouldUpdateUserAnchor = true;
    }

    const insertData: typeof characters.$inferInsert = {
      name: data.name,
      archetype: data.archetype,
      sex: data.sex,
      motivation: data.motivation,
      notes: data.notes,
      nicknames: data.nicknames ?? [],
      keho: data.keho,
      currentKeho: data.keho,
      mieli: data.mieli,
      currentMieli: data.mieli,
      tera: data.tera,
      currentTera: data.tera,
      sisuDice: data.sisuDice,
      removedSisuIds: [],
      skills: effectiveSkills,
      inventory: [],
      tattoos: [],
      fysiikka: data.fysiikka ?? 0,
      nopeus: data.nopeus ?? 0,
      ymmarrys: data.ymmarrys ?? 0,
      persoona: data.persoona ?? 0,
      nakemys: data.nakemys ?? 0,
      napparyys: data.napparyys ?? 0,
      userId,
      anchorId: effectiveAnchorId,
    };

    return this.db.transaction(async (tx) => {
      if (shouldUpdateUserAnchor && effectiveAnchorId) {
        await tx.update(users).set({ anchorId: effectiveAnchorId }).where(eq(users.id, userId));

        // Backfill all existing characters of this user with the newly claimed anchor
        await tx
          .update(characters)
          .set({ anchorId: effectiveAnchorId })
          .where(eq(characters.userId, userId));
      }

      const result = await tx.insert(characters).values(insertData).returning();
      const character = result[0];

      // Also insert into characterEpisodes junction table
      if (data.episodeId) {
        await tx.insert(characterEpisodes).values({
          characterId: character.id,
          episodeId: data.episodeId,
        });
      }

      const initialPrivateNote = data.initialPrivateNote?.trim();
      if (initialPrivateNote && character) {
        await tx.insert(characterPrivateNotes).values({
          characterId: character.id,
          episodeId: data.episodeId ?? null,
          title: null,
          content: initialPrivateNote,
          isPinned: false,
        });
      }

      return character;
    });
  }

  async update(id: number, data: UpdateCharacterDto, userId: number, role: string) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, id),
    });

    if (!character) {
      throw new NotFoundException("Character not found");
    }

    if (character.userId !== userId && role !== "gm") {
      throw new ForbiddenException("You do not have permission to edit this character");
    }

    let nextSkills = data.skills;
    if (data.skills !== undefined) {
      const incoming = Array.isArray(data.skills) ? data.skills : [];
      if (incoming.some((s) => isRebellionSelectionName(getSkillEntryName(s)))) {
        throw new BadRequestException("Virheellinen taidon nimi");
      }
      const charHadRebellionSkill =
        Array.isArray(character.skills) &&
        character.skills.some((s) => isRebellionAcquiredName(getSkillEntryName(s)));
      const owner = charHadRebellionSkill
        ? null
        : await this.db.query.users.findFirst({ where: eq(users.id, character.userId) });
      const hasRebellion = charHadRebellionSkill || (owner?.rebellionLevel ?? 0) >= 1;

      if (!hasRebellion) {
        if (incoming.some((s) => isRebellionAcquiredName(getSkillEntryName(s)))) {
          throw new BadRequestException("Tätä erikoistaitoa ei voi lisätä muokkaamalla");
        }
      } else {
        const acquiredMatches = incoming.filter((s) =>
          isRebellionAcquiredName(getSkillEntryName(s)),
        );
        if (acquiredMatches.length !== 1) {
          throw new BadRequestException("Lukittua erikoistaitoa ei voi muokata tai poistaa");
        }
        nextSkills = ensureRebellionSkillInArray(incoming);
      }
    }

    let nextTattoos: CharacterTattoo[] | undefined;
    if (data.tattoos !== undefined) {
      const effectiveMonkAllowed =
        role === "gm" && data.monkAdvancementsAllowed !== undefined
          ? data.monkAdvancementsAllowed
          : (character.monkAdvancementsAllowed ?? 0);
      const existingTattoos = extractStoredTattoos(character.tattoos);
      nextTattoos = normalizeAndValidateTattoos(
        data.tattoos,
        effectiveMonkAllowed,
        existingTattoos,
      );
    }

    const nextHarmit = data.harmit ?? character.harmit;
    const shouldMarkRemoved = this.hasFiveHarmit(nextHarmit);
    const updateData: Partial<typeof characters.$inferInsert> = {
      name: data.name,
      archetype: data.archetype,
      sex: data.sex,
      motivation: data.motivation,
      notes: data.notes,
      keho: data.keho,
      currentKeho: data.currentKeho,
      mieli: data.mieli,
      currentMieli: data.currentMieli,
      tera: data.tera,
      currentTera: data.currentTera,
      sisuDice: data.sisuDice,
      removedSisuIds: data.removedSisuIds,
      harmit: data.harmit,
      skills: nextSkills,
      inventory: data.inventory,
      nicknames: data.nicknames,
      tattoos: nextTattoos,
      fysiikka: data.fysiikka,
      nopeus: data.nopeus,
      ymmarrys: data.ymmarrys,
      persoona: data.persoona,
      nakemys: data.nakemys,
      napparyys: data.napparyys,
      ...(role === "gm" &&
        data.monkAdvancementsAllowed !== undefined && {
          monkAdvancementsAllowed: data.monkAdvancementsAllowed,
        }),
      removedFromPlayAt: shouldMarkRemoved
        ? (character.removedFromPlayAt ?? new Date())
        : data.harmit
          ? null
          : character.removedFromPlayAt,
      updatedAt: new Date(),
    };
    const result = await this.db
      .update(characters)
      .set(updateData)
      .where(eq(characters.id, id))
      .returning();

    // Auto-dismiss update_names notification when nicknames are explicitly set
    if (data.nicknames !== undefined) {
      await this.notificationsService.dismissByType(userId, "update_names", String(id));
    }

    return result[0];
  }

  async remove(id: number, userId: number, role: string) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, id),
    });

    if (!character) {
      throw new NotFoundException("Character not found");
    }

    if (character.userId !== userId && role !== "gm") {
      throw new ForbiddenException("You do not have permission to delete this character");
    }

    await this.db.delete(characters).where(eq(characters.id, id));
  }

  async listSnapshots(characterId: number, userId: number, role: string) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId && role !== "gm") {
      throw new ForbiddenException("You do not have permission to view snapshots");
    }

    return this.db
      .select({
        id: characterArcSnapshots.id,
        capturedAt: characterArcSnapshots.capturedAt,
        reason: characterArcSnapshots.reason,
        episodeId: characterArcSnapshots.episodeId,
        episodeTitle: episodes.title,
        sheetJson: characterArcSnapshots.sheetJson,
      })
      .from(characterArcSnapshots)
      .leftJoin(episodes, eq(characterArcSnapshots.episodeId, episodes.id))
      .where(eq(characterArcSnapshots.characterId, characterId))
      .orderBy(asc(characterArcSnapshots.capturedAt));
  }

  private async assertCharacterEpisodeIfProvided(
    characterId: number,
    episodeId: number | null | undefined,
  ) {
    if (episodeId === null || episodeId === undefined) return;
    const linkRows = await this.db
      .select({ id: characterEpisodes.id })
      .from(characterEpisodes)
      .where(
        and(
          eq(characterEpisodes.characterId, characterId),
          eq(characterEpisodes.episodeId, episodeId),
        ),
      )
      .limit(1);
    if (linkRows.length === 0) {
      throw new BadRequestException("Hahmoa ei ole liitetty valittuun jaksoon");
    }
  }

  async listPrivateNotes(characterId: number, userId: number, role: string) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId && role !== "gm") {
      throw new ForbiddenException(
        "Sinulla ei ole oikeutta nähdä tämän hahmon yksityisiä muistiinpanoja",
      );
    }

    return this.db
      .select({
        id: characterPrivateNotes.id,
        characterId: characterPrivateNotes.characterId,
        episodeId: characterPrivateNotes.episodeId,
        episodeTitle: episodes.title,
        title: characterPrivateNotes.title,
        content: characterPrivateNotes.content,
        isPinned: characterPrivateNotes.isPinned,
        createdAt: characterPrivateNotes.createdAt,
        updatedAt: characterPrivateNotes.updatedAt,
      })
      .from(characterPrivateNotes)
      .leftJoin(episodes, eq(characterPrivateNotes.episodeId, episodes.id))
      .where(eq(characterPrivateNotes.characterId, characterId))
      .orderBy(
        desc(characterPrivateNotes.isPinned),
        desc(characterPrivateNotes.createdAt),
        desc(characterPrivateNotes.id),
      );
  }

  async createPrivateNote(characterId: number, data: CreatePrivateNoteDto, userId: number) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId) {
      throw new ForbiddenException("Vain hahmon omistaja voi muokata yksityisiä muistiinpanoja");
    }

    const trimmedContent = data.content.trim();
    if (!trimmedContent) {
      throw new BadRequestException("Muistiinpanon sisältö ei voi olla tyhjä");
    }

    await this.assertCharacterEpisodeIfProvided(characterId, data.episodeId);

    const normalizedTitle = data.title?.trim() ? data.title.trim() : null;
    const result = await this.db
      .insert(characterPrivateNotes)
      .values({
        characterId,
        episodeId: data.episodeId ?? null,
        title: normalizedTitle,
        content: trimmedContent,
        isPinned: Boolean(data.isPinned),
      })
      .returning();

    return result[0];
  }

  async updatePrivateNote(
    characterId: number,
    noteId: number,
    data: UpdatePrivateNoteDto,
    userId: number,
  ) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId) {
      throw new ForbiddenException("Vain hahmon omistaja voi muokata yksityisiä muistiinpanoja");
    }

    const existing = await this.db.query.characterPrivateNotes.findFirst({
      where: and(
        eq(characterPrivateNotes.id, noteId),
        eq(characterPrivateNotes.characterId, characterId),
      ),
    });
    if (!existing) {
      throw new NotFoundException("Muistiinpanoa ei löytynyt");
    }

    let nextContent: string | undefined;
    if (data.content !== undefined) {
      nextContent = data.content.trim();
      if (!nextContent) {
        throw new BadRequestException("Muistiinpanon sisältö ei voi olla tyhjä");
      }
    }

    if (data.episodeId !== undefined) {
      await this.assertCharacterEpisodeIfProvided(characterId, data.episodeId);
    }

    const updateFields: Partial<typeof characterPrivateNotes.$inferInsert> = {
      ...(data.title !== undefined && {
        title: data.title?.trim() ? data.title.trim() : null,
      }),
      ...(nextContent !== undefined && { content: nextContent }),
      ...(data.episodeId !== undefined && { episodeId: data.episodeId }),
      ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
      updatedAt: new Date(),
    };

    const result = await this.db
      .update(characterPrivateNotes)
      .set(updateFields)
      .where(
        and(
          eq(characterPrivateNotes.id, noteId),
          eq(characterPrivateNotes.characterId, characterId),
        ),
      )
      .returning();

    return result[0];
  }

  async removePrivateNote(characterId: number, noteId: number, userId: number) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId) {
      throw new ForbiddenException("Vain hahmon omistaja voi poistaa yksityisiä muistiinpanoja");
    }

    const existing = await this.db.query.characterPrivateNotes.findFirst({
      where: and(
        eq(characterPrivateNotes.id, noteId),
        eq(characterPrivateNotes.characterId, characterId),
      ),
    });
    if (!existing) {
      throw new NotFoundException("Muistiinpanoa ei löytynyt");
    }

    await this.db
      .delete(characterPrivateNotes)
      .where(
        and(
          eq(characterPrivateNotes.id, noteId),
          eq(characterPrivateNotes.characterId, characterId),
        ),
      );

    return { deleted: true };
  }

  async migratePublicNotesToPrivate(characterId: number, userId: number) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId) {
      throw new ForbiddenException(
        "Vain hahmon omistaja voi siirtää julkisen kuvauksen yksityiseksi muistiinpanoksi",
      );
    }

    const trimmedNotes = character.notes?.trim() ?? "";
    if (!trimmedNotes) {
      throw new BadRequestException("Julkinen kuvaus on tyhjä");
    }

    return this.db.transaction(async (tx) => {
      const inserted = await tx
        .insert(characterPrivateNotes)
        .values({
          characterId,
          episodeId: null,
          title: null,
          content: trimmedNotes,
          isPinned: false,
        })
        .returning();

      await tx
        .update(characters)
        .set({ notes: null, updatedAt: new Date() })
        .where(eq(characters.id, characterId));

      return { migrated: true, note: inserted[0] };
    });
  }

  async linkEpisode(characterId: number, episodeId: number, userId: number) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId) {
      throw new ForbiddenException("You do not have permission to link this character");
    }
    if (character.removedFromPlayAt || this.hasFiveHarmit(character.harmit)) {
      throw new BadRequestException("Removed characters cannot be linked to a new episode");
    }

    const episode = await this.db.query.episodes.findFirst({
      where: eq(episodes.id, episodeId),
    });
    if (!episode) {
      throw new NotFoundException("Episode not found");
    }

    const enrollment = await this.db
      .select({ id: episodePlayers.id })
      .from(episodePlayers)
      .where(and(eq(episodePlayers.episodeId, episodeId), eq(episodePlayers.userId, userId)))
      .limit(1);
    if (enrollment.length === 0) {
      throw new ForbiddenException("You are not enrolled in this episode");
    }

    const existingLink = await this.db
      .select({ id: characterEpisodes.id })
      .from(characterEpisodes)
      .where(
        and(
          eq(characterEpisodes.characterId, characterId),
          eq(characterEpisodes.episodeId, episodeId),
        ),
      )
      .limit(1);
    if (existingLink.length > 0) {
      return { linked: true, alreadyLinked: true };
    }

    await this.db.insert(characterEpisodes).values({ characterId, episodeId });
    return { linked: true, alreadyLinked: false };
  }

  async refreshForEpisode(characterId: number, data: RefreshCharacterDto, userId: number) {
    const { character, link } = await this.assertOwnedLinkedCharacter(
      characterId,
      data.episodeId,
      userId,
    );
    if (link.refreshedAt) {
      return { refreshed: true, alreadyRefreshed: true };
    }

    const shouldMarkRemoved = this.hasFiveHarmit(character.harmit);
    await this.db
      .update(characters)
      .set({
        currentKeho: character.keho,
        currentMieli: character.mieli,
        currentTera: character.tera,
        removedSisuIds: [],
        removedFromPlayAt: shouldMarkRemoved ? (character.removedFromPlayAt ?? new Date()) : null,
        updatedAt: new Date(),
      })
      .where(eq(characters.id, characterId));

    await this.db
      .update(characterEpisodes)
      .set({ refreshedAt: new Date() })
      .where(eq(characterEpisodes.id, link.id));

    return { refreshed: true, alreadyRefreshed: false };
  }

  async advanceForEpisode(characterId: number, data: AdvanceCharacterDto, userId: number) {
    const { character, link } = await this.assertOwnedLinkedCharacter(
      characterId,
      data.episodeId,
      userId,
    );
    if (link.advancedAt) {
      return { advanced: true, alreadyAdvanced: true };
    }

    const currentValue = character[data.attribute];
    if (typeof currentValue !== "number") {
      throw new BadRequestException("Invalid attribute value");
    }

    const nextPacked = addN4(currentValue);
    const nextFysiikka = data.attribute === "fysiikka" ? nextPacked : character.fysiikka;
    const nextNopeus = data.attribute === "nopeus" ? nextPacked : character.nopeus;
    const nextYmmarrys = data.attribute === "ymmarrys" ? nextPacked : character.ymmarrys;
    const nextPersoona = data.attribute === "persoona" ? nextPacked : character.persoona;
    const nextNakemys = data.attribute === "nakemys" ? nextPacked : character.nakemys;
    const nextNapparyys = data.attribute === "napparyys" ? nextPacked : character.napparyys;

    const nextKeho =
      8 + kestoBonusFromPackedAttribute(nextFysiikka) + kestoBonusFromPackedAttribute(nextNopeus);
    const nextMieli =
      8 + kestoBonusFromPackedAttribute(nextYmmarrys) + kestoBonusFromPackedAttribute(nextPersoona);
    const nextTera =
      8 + kestoBonusFromPackedAttribute(nextNakemys) + kestoBonusFromPackedAttribute(nextNapparyys);

    const sisuDice = Array.isArray(character.sisuDice)
      ? [...(character.sisuDice as Array<{ id: string; faces: number }>)]
      : [];

    let monkPowerToLink: typeof monkPowers.$inferSelect | null = null;
    let nextMonkAdvancementsUsed = character.monkAdvancementsUsed ?? 0;

    if (data.reward === "munkki") {
      if (!data.powerId) {
        throw new BadRequestException("Monk advancement requires a powerId");
      }

      // Check monk powers count vs allowed
      const currentPowers = await this.db
        .select({
          powerId: characterMonkPowers.powerId,
          tier: monkPowers.tier,
        })
        .from(characterMonkPowers)
        .innerJoin(monkPowers, eq(characterMonkPowers.powerId, monkPowers.id))
        .where(eq(characterMonkPowers.characterId, characterId));

      if (currentPowers.length >= (character.monkAdvancementsAllowed ?? 0)) {
        throw new BadRequestException("No monk advancements available");
      }

      const power = await this.db.query.monkPowers.findFirst({
        where: eq(monkPowers.id, data.powerId),
      });
      if (!power) {
        throw new NotFoundException("Monk power not found");
      }

      if (currentPowers.some((p) => p.powerId === data.powerId)) {
        throw new BadRequestException("Character already has this power");
      }

      const tierCounts = new Map<number, number>();
      for (const p of currentPowers) {
        tierCounts.set(p.tier, (tierCounts.get(p.tier) ?? 0) + 1);
      }

      if (power.tier > 1) {
        const lowerTier = power.tier - 1;
        const lowerCount = tierCounts.get(lowerTier) ?? 0;
        const currentTargetCount = tierCounts.get(power.tier) ?? 0;
        const requiredLowerCount = currentTargetCount + 2;
        if (lowerCount < requiredLowerCount) {
          throw new BadRequestException(
            `Pyramid requirement not met for tier ${power.tier}. Need at least ${requiredLowerCount} powers of tier ${lowerTier}, but currently have ${lowerCount}.`,
          );
        }
      }

      monkPowerToLink = power;
      nextMonkAdvancementsUsed += 1;
      sisuDice.push({ id: `sisu-${randomUUID()}`, faces: 4 });
    } else if (data.reward === "skills_plus_n6") {
      sisuDice.push({ id: `sisu-${randomUUID()}`, faces: 6 });
    } else {
      sisuDice.push({ id: `sisu-${randomUUID()}`, faces: 8 });
    }

    const skillCap = data.reward === "munkki" ? 0 : data.reward === "skills_plus_n6" ? 2 : 1;
    const appendedSkills = (data.newSkills ?? []).slice(0, skillCap);

    if (appendedSkills.some((s) => isRebellionAcquiredName(s))) {
      throw new BadRequestException("Tätä erikoistaitoa ei voi syöttää omana taitona");
    }

    const rebellionSelectionCount = appendedSkills.filter((s) =>
      isRebellionSelectionName(s),
    ).length;
    if (rebellionSelectionCount > 1) {
      throw new BadRequestException("Taidon voi valita vain kerran");
    }

    const shouldAcquireRebellionSkill = rebellionSelectionCount === 1;
    if (shouldAcquireRebellionSkill) {
      const charAlreadyHas =
        Array.isArray(character.skills) &&
        character.skills.some((s) => isRebellionAcquiredName(getSkillEntryName(s)));
      const user = await this.db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (charAlreadyHas || (user?.rebellionLevel ?? 0) >= 1) {
        throw new BadRequestException("Pelaajalla on jo tämä taito");
      }
    }

    const skills = Array.isArray(character.skills) ? [...character.skills] : [];
    for (const skill of appendedSkills) {
      if (isRebellionSelectionName(skill)) {
        skills.push({ name: REBELLION_SKILL_ACQUIRED_NAME, isCustom: false, locked: true });
      } else {
        skills.push({ name: skill, isCustom: true });
      }
    }

    return this.db.transaction(async (tx) => {
      if (shouldAcquireRebellionSkill) {
        await tx.update(users).set({ rebellionLevel: 1 }).where(eq(users.id, userId));

        const otherChars =
          (await tx.query.characters.findMany({
            where: eq(characters.userId, userId),
          })) ?? [];
        for (const otherChar of otherChars) {
          if (otherChar.id !== characterId) {
            const nextOtherSkills = ensureRebellionSkillInArray(
              Array.isArray(otherChar.skills) ? otherChar.skills : [],
            );
            await tx
              .update(characters)
              .set({ skills: nextOtherSkills, updatedAt: new Date() })
              .where(eq(characters.id, otherChar.id));
          }
        }
      }

      const updatedRows = await tx
        .update(characters)
        .set({
          fysiikka: nextFysiikka,
          nopeus: nextNopeus,
          ymmarrys: nextYmmarrys,
          persoona: nextPersoona,
          nakemys: nextNakemys,
          napparyys: nextNapparyys,
          keho: nextKeho,
          mieli: nextMieli,
          tera: nextTera,
          currentKeho: Math.max(character.currentKeho, nextKeho),
          currentMieli: Math.max(character.currentMieli, nextMieli),
          currentTera: Math.max(character.currentTera, nextTera),
          sisuDice,
          skills,
          monkAdvancementsUsed: nextMonkAdvancementsUsed,
          updatedAt: new Date(),
        })
        .where(eq(characters.id, characterId))
        .returning();
      const updated = updatedRows[0];

      if (monkPowerToLink) {
        await tx.insert(characterMonkPowers).values({
          characterId,
          powerId: monkPowerToLink.id,
        });
      }

      await tx
        .update(characterEpisodes)
        .set({ advancedAt: new Date() })
        .where(eq(characterEpisodes.id, link.id));

      await tx.insert(characterArcSnapshots).values({
        characterId,
        episodeId: data.episodeId,
        reason: "advancement",
        sheetJson: updated,
      });

      return { advanced: true, alreadyAdvanced: false, character: updated };
    });
  }

  async advanceAsMonk(characterId: number, data: AdvanceMonkDto, userId: number) {
    const character = await this.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });
    if (!character) {
      throw new NotFoundException("Character not found");
    }
    if (character.userId !== userId) {
      throw new ForbiddenException("You do not have permission to advance this character");
    }

    if (character.monkAdvancementsUsed >= character.monkAdvancementsAllowed) {
      throw new BadRequestException("No monk advancements available");
    }

    const power = await this.db.query.monkPowers.findFirst({
      where: eq(monkPowers.id, data.powerId),
    });
    if (!power) {
      throw new NotFoundException("Monk power not found");
    }

    const existingLink = await this.db.query.characterMonkPowers.findFirst({
      where: and(
        eq(characterMonkPowers.characterId, characterId),
        eq(characterMonkPowers.powerId, data.powerId),
      ),
    });
    if (existingLink) {
      throw new BadRequestException("Character already has this power");
    }

    const currentPowers = await this.db
      .select({
        tier: monkPowers.tier,
      })
      .from(characterMonkPowers)
      .innerJoin(monkPowers, eq(characterMonkPowers.powerId, monkPowers.id))
      .where(eq(characterMonkPowers.characterId, characterId));

    const tierCounts = new Map<number, number>();
    for (const p of currentPowers) {
      tierCounts.set(p.tier, (tierCounts.get(p.tier) ?? 0) + 1);
    }

    if (power.tier > 1) {
      const lowerTier = power.tier - 1;
      const lowerCount = tierCounts.get(lowerTier) ?? 0;
      const currentTargetCount = tierCounts.get(power.tier) ?? 0;
      const requiredLowerCount = currentTargetCount + 2;
      if (lowerCount < requiredLowerCount) {
        throw new BadRequestException(
          `Pyramid requirement not met for tier ${power.tier}. Need at least ${requiredLowerCount} powers of tier ${lowerTier}, but currently have ${lowerCount}.`,
        );
      }
    }

    const sisuDice = Array.isArray(character.sisuDice)
      ? [...(character.sisuDice as Array<{ id: string; faces: number }>)]
      : [];
    sisuDice.push({ id: `sisu-${randomUUID()}`, faces: 4 });

    return this.db.transaction(async (tx) => {
      const updatedRows = await tx
        .update(characters)
        .set({
          sisuDice,
          monkAdvancementsUsed: character.monkAdvancementsUsed + 1,
          updatedAt: new Date(),
        })
        .where(eq(characters.id, characterId))
        .returning();
      const updated = updatedRows[0];

      await tx.insert(characterMonkPowers).values({
        characterId,
        powerId: data.powerId,
      });

      await tx.insert(characterArcSnapshots).values({
        characterId,
        episodeId: character.episodeId ?? null,
        reason: "monk_advancement",
        sheetJson: updated,
      });

      return { advanced: true, character: updated, power };
    });
  }

  /**
   * Fetch optional Aamunkoi (ship) data using fault-tolerant raw SQL so this branch compiles
   * and runs cleanly even when ship tables do not exist in the current database schema.
   */
  private async fetchOptionalShipData(): Promise<OptionalShipData> {
    const cabinByChar = new Map<number, ShipCabinInfo>();
    const possessionsByChar = new Map<number, ShipPossessionInfo[]>();
    const clocksByChar = new Map<number, ShipClockInfo[]>();

    if (typeof this.db.execute !== "function") {
      return { cabinByChar, possessionsByChar, clocksByChar };
    }

    try {
      const roomsRes = await this.db.execute(
        sql`SELECT claimed_by_character_id, key, deck_number, name, cabin_custom_title, cabin_decoration, gm_room_notes FROM ship_rooms WHERE claimed_by_character_id IS NOT NULL`,
      );
      for (const row of extractSqlRows(roomsRes)) {
        const charId = Number(row.claimed_by_character_id);
        if (!Number.isInteger(charId) || charId <= 0) continue;
        cabinByChar.set(charId, {
          key: String(row.key ?? ""),
          deckNumber: Number(row.deck_number ?? 0),
          name: String(row.name ?? ""),
          cabinCustomTitle:
            typeof row.cabin_custom_title === "string" ? row.cabin_custom_title : null,
          cabinDecoration: typeof row.cabin_decoration === "string" ? row.cabin_decoration : null,
          gmRoomNotes: typeof row.gm_room_notes === "string" ? row.gm_room_notes : null,
        });
      }
    } catch {
      // Ship rooms table is not present on branches/databases without Aamunkoi.
    }

    try {
      const possessionsRes = await this.db.execute(
        sql`SELECT character_id, name, description, gm_mechanical_notes FROM cabin_possessions ORDER BY order_index ASC, id ASC`,
      );
      for (const row of extractSqlRows(possessionsRes)) {
        const charId = Number(row.character_id);
        if (!Number.isInteger(charId) || charId <= 0) continue;
        const list = possessionsByChar.get(charId) ?? [];
        list.push({
          name: String(row.name ?? ""),
          description: typeof row.description === "string" ? row.description : "",
          gmMechanicalNotes:
            typeof row.gm_mechanical_notes === "string" ? row.gm_mechanical_notes : null,
        });
        possessionsByChar.set(charId, list);
      }
    } catch {
      // Cabin possessions table is optional.
    }

    try {
      const clocksRes = await this.db.execute(
        sql`SELECT character_id, category, title, description, segments_filled, segments_total, status, completion_notes FROM ship_clocks WHERE character_id IS NOT NULL ORDER BY id ASC`,
      );
      for (const row of extractSqlRows(clocksRes)) {
        const charId = Number(row.character_id);
        if (!Number.isInteger(charId) || charId <= 0) continue;
        const list = clocksByChar.get(charId) ?? [];
        list.push({
          category: String(row.category ?? "projekti"),
          title: String(row.title ?? ""),
          description: typeof row.description === "string" ? row.description : "",
          segmentsFilled: Number(row.segments_filled ?? 0),
          segmentsTotal:
            row.segments_total !== null && row.segments_total !== undefined
              ? Number(row.segments_total)
              : null,
          status: String(row.status ?? "active"),
          completionNotes: typeof row.completion_notes === "string" ? row.completion_notes : null,
        });
        clocksByChar.set(charId, list);
      }
    } catch {
      // Ship clocks table is optional.
    }

    return { cabinByChar, possessionsByChar, clocksByChar };
  }

  private async fetchOptionalPrivateNotes(): Promise<Map<number, ExportPrivateNoteInfo[]>> {
    const notesByChar = new Map<number, ExportPrivateNoteInfo[]>();
    if (typeof this.db.execute !== "function") {
      return notesByChar;
    }

    try {
      const notesRes = await this.db.execute(
        sql`SELECT n.character_id, n.title, n.content, n.is_pinned, n.created_at, e.title AS episode_title FROM character_private_notes n LEFT JOIN episodes e ON n.episode_id = e.id ORDER BY n.is_pinned DESC, n.created_at DESC, n.id DESC`,
      );
      for (const row of extractSqlRows(notesRes)) {
        const charId = Number(row.character_id);
        if (!Number.isInteger(charId) || charId <= 0) continue;
        const content = typeof row.content === "string" ? row.content.trim() : "";
        if (!content) continue;
        const rawDate =
          row.created_at instanceof Date
            ? row.created_at
            : typeof row.created_at === "string"
              ? new Date(row.created_at)
              : null;
        const createdAtLabel =
          rawDate && !Number.isNaN(rawDate.getTime()) ? rawDate.toLocaleDateString("fi-FI") : null;
        const list = notesByChar.get(charId) ?? [];
        list.push({
          title: typeof row.title === "string" && row.title.trim() ? row.title.trim() : null,
          content,
          isPinned: Boolean(row.is_pinned),
          episodeTitle:
            typeof row.episode_title === "string" && row.episode_title.trim()
              ? row.episode_title.trim()
              : null,
          createdAtLabel,
        });
        notesByChar.set(charId, list);
      }
    } catch {
      // Private notes table may be absent on older schema snapshots.
    }

    return notesByChar;
  }

  /** Export all characters grouped by player as clean Finnish Markdown. */
  async exportMarkdown(): Promise<{ filename: string; markdown: string }> {
    const [allChars, shipData] = await Promise.all([this.findAll(), this.fetchOptionalShipData()]);
    const privateNotesByChar = await this.fetchOptionalPrivateNotes();

    if (allChars.length === 0) {
      return {
        filename: "Hahmot.md",
        markdown: "# Hahmot\n\nEi hahmoja tietokannassa.\n",
      };
    }

    type CharacterExportRow = (typeof allChars)[number] & {
      id: number;
      userId: number;
      name: string;
      archetype: string;
      ownerName?: string | null;
      sex?: string | null;
      motivation?: string | null;
      notes?: string | null;
      nicknames?: unknown;
      keho?: number;
      currentKeho?: number;
      mieli?: number;
      currentMieli?: number;
      tera?: number;
      currentTera?: number;
      sisuDice?: unknown;
      removedSisuIds?: unknown;
      harmit?: unknown;
      skills?: unknown;
      inventory?: unknown;
      fysiikka?: number;
      nopeus?: number;
      ymmarrys?: number;
      persoona?: number;
      nakemys?: number;
      napparyys?: number;
      anchorId?: string | null;
      monkAdvancementsAllowed?: number;
      monkAdvancementsUsed?: number;
      tattoos?: unknown;
      removedFromPlayAt?: Date | string | null;
      episodes?: CharacterEpisodeRow[];
      monkPowers?: MonkPowerWithAcquired[];
    };

    const grouped = new Map<string, CharacterExportRow[]>();
    const sortedChars = [...(allChars as CharacterExportRow[])].sort((a, b) => {
      const ownerA = a.ownerName ?? `Pelaaja #${a.userId}`;
      const ownerB = b.ownerName ?? `Pelaaja #${b.userId}`;
      const ownerCmp = ownerA.localeCompare(ownerB, "fi");
      if (ownerCmp !== 0) return ownerCmp;
      return a.id - b.id;
    });

    for (const char of sortedChars) {
      const playerLabel = char.ownerName?.trim() || `Pelaaja #${char.userId}`;
      const list = grouped.get(playerLabel) ?? [];
      list.push(char);
      grouped.set(playerLabel, list);
    }

    const playerSections: string[] = ["# Hahmot"];

    for (const [playerLabel, playerChars] of grouped.entries()) {
      const lines: string[] = [`## Pelaaja: ${playerLabel}`];

      for (const char of playerChars) {
        const harmitRaw = Array.isArray(char.harmit) ? char.harmit : [];
        const harmitEntries = harmitRaw.map((h) => {
          if (typeof h === "string") return { text: h, healed: false };
          if (typeof h === "object" && h !== null) {
            const entry = h as { text?: unknown; healed?: unknown };
            return {
              text: typeof entry.text === "string" ? entry.text : "",
              healed: Boolean(entry.healed),
            };
          }
          return { text: "", healed: false };
        });
        const activeHarmit = harmitEntries.filter((h) => !h.healed).length;
        const totalHarmit = harmitEntries.length;
        const isRemoved = Boolean(char.removedFromPlayAt) || totalHarmit >= 5;

        lines.push("");
        lines.push(`### ${char.name}`);
        lines.push("");
        lines.push(`- **Arkkityyppi:** ${char.archetype}`);
        lines.push(`- **Sukupuoli:** ${formatSexFi(char.sex)}`);
        lines.push(`- **Tila:** ${isRemoved ? "Poistettu pelistä" : "Aktiivinen"}`);

        const nicknames = Array.isArray(char.nicknames)
          ? char.nicknames.filter((n): n is string => typeof n === "string" && n.trim().length > 0)
          : [];
        if (nicknames.length > 0) {
          lines.push(`- **Lempinimet:** ${nicknames.join(", ")}`);
        }

        if (Array.isArray(char.episodes) && char.episodes.length > 0) {
          const epFormatted = char.episodes
            .map((ep) => {
              const marks: string[] = [];
              if (ep.refreshedAt) marks.push("levätty");
              if (ep.advancedAt) marks.push("kehitetty");
              const markText = marks.length > 0 ? `, ${marks.join(", ")}` : "";
              return `${ep.title} (${formatEpisodeStatusFi(ep.status)}${markText})`;
            })
            .join(", ");
          lines.push(`- **Jaksot:** ${epFormatted}`);
        }

        if (char.anchorId) {
          lines.push(`- **Pelaajan Ankkuri:** \`${char.anchorId}\``);
        }

        lines.push("");
        lines.push("#### Kestot ja ominaisuudet");
        lines.push("");
        lines.push(
          `- **Keho:** ${char.currentKeho ?? 8} / ${char.keho ?? 8} *(Fysiikka: ${formatPackedAttributeDice(char.fysiikka ?? 0)}, Nopeus: ${formatPackedAttributeDice(char.nopeus ?? 0)})*`,
        );
        lines.push(
          `- **Mieli:** ${char.currentMieli ?? 8} / ${char.mieli ?? 8} *(Ymmärrys: ${formatPackedAttributeDice(char.ymmarrys ?? 0)}, Persoona: ${formatPackedAttributeDice(char.persoona ?? 0)})*`,
        );
        lines.push(
          `- **Terä:** ${char.currentTera ?? 8} / ${char.tera ?? 8} *(Näkemys: ${formatPackedAttributeDice(char.nakemys ?? 0)}, Näppäryys: ${formatPackedAttributeDice(char.napparyys ?? 0)})*`,
        );

        lines.push("");
        lines.push("#### Resurssit");
        lines.push("");

        const rawSisu = Array.isArray(char.sisuDice)
          ? (char.sisuDice as Array<{ id?: unknown; faces?: unknown }>).filter(
              (d): d is { id: string; faces: number } =>
                typeof d === "object" &&
                d !== null &&
                typeof d.id === "string" &&
                typeof d.faces === "number",
            )
          : [];
        const removedSisuSet = new Set<string>(
          Array.isArray(char.removedSisuIds)
            ? char.removedSisuIds.filter((id): id is string => typeof id === "string")
            : [],
        );
        const activeSisu = rawSisu.filter((d) => !removedSisuSet.has(d.id));
        const spentSisu = rawSisu.filter((d) => removedSisuSet.has(d.id));
        const activeSisuText = formatDiceCounts(activeSisu);
        const spentSisuText = formatDiceCounts(spentSisu);
        const sisuSummary =
          rawSisu.length === 0
            ? "—"
            : `${activeSisuText || "0"}${spentSisuText ? ` *(käytetty: ${spentSisuText})*` : ""}`;
        lines.push(`- **Sisu:** ${sisuSummary}`);

        lines.push(`- **Harmit (${activeHarmit}/5 aktiivista, yhteensä ${totalHarmit}/5):**`);
        if (harmitEntries.length === 0) {
          lines.push("  - Ei harmeja.");
        } else {
          for (const h of harmitEntries) {
            if (!h.text.trim()) continue;
            lines.push(`  - ${h.text.trim()} *(${h.healed ? "parannettu" : "aktiivinen"})*`);
          }
        }

        lines.push("");
        lines.push("#### Taidot");
        lines.push("");
        const rawSkills = Array.isArray(char.skills) ? char.skills : [];
        const normalizedSkills = rawSkills
          .map((s) => {
            if (typeof s === "string") {
              return { name: s.trim(), isCustom: false, locked: false };
            }
            if (typeof s === "object" && s !== null && "name" in s) {
              const obj = s as { name?: unknown; isCustom?: unknown; locked?: unknown };
              return {
                name: typeof obj.name === "string" ? obj.name.trim() : "",
                isCustom: Boolean(obj.isCustom),
                locked: Boolean(obj.locked),
              };
            }
            return { name: "", isCustom: false, locked: false };
          })
          .filter((s) => s.name.length > 0);

        if (normalizedSkills.length === 0) {
          lines.push("Ei taitoja.");
        } else {
          for (const skill of normalizedSkills) {
            const tag = skill.locked ? " *(erikoistaito)*" : skill.isCustom ? " *(oma taito)*" : "";
            lines.push(`- ${skill.name}${tag}`);
          }
        }

        const powers = char.monkPowers ?? [];
        const allowedMonk = char.monkAdvancementsAllowed ?? 0;
        const usedMonk = powers.length > 0 ? powers.length : (char.monkAdvancementsUsed ?? 0);

        const normalizedTattoos = extractStoredTattoos(char.tattoos);
        const maxTattooSlot = normalizedTattoos.reduce((max, t) => Math.max(max, t.slot), 0);
        const tattooSlotCount = Math.max(allowedMonk, maxTattooSlot);
        if (tattooSlotCount > 0) {
          const tattooBySlot = new Map(normalizedTattoos.map((t) => [t.slot, t]));
          lines.push("");
          lines.push("#### Tatuoinnit");
          lines.push("");
          lines.push(`- **Tatuoinnit:** ${normalizedTattoos.length} / ${allowedMonk} kuvattu`);
          for (let slot = 1; slot <= tattooSlotCount; slot += 1) {
            const tattoo = tattooBySlot.get(slot);
            if (tattoo) {
              lines.push(`- **Tatuointi ${slot} — ${tattoo.title}**`);
              if (tattoo.description) {
                const descLines = tattoo.description.split(/\r?\n/);
                lines.push(`  - ${descLines[0]}`);
                for (const extraLine of descLines.slice(1)) {
                  lines.push(extraLine.trim() ? `    ${extraLine}` : "");
                }
              }
            } else {
              lines.push(`- **Tatuointi ${slot}:** *Ei vielä kuvailtu.*`);
            }
          }
        }

        if (powers.length > 0 || allowedMonk > 0 || char.archetype === "Munkki") {
          lines.push("");
          lines.push("#### Munkin voimat");
          lines.push("");
          lines.push(`- **Munkki-kehitykset:** ${usedMonk} / ${allowedMonk} valittu`);
          if (powers.length === 0) {
            lines.push("- Ei vielä valittuja voimia.");
          } else {
            for (const power of powers) {
              lines.push(`- **${power.name}** (${power.tier}. piiri)`);
              if (power.description?.trim()) {
                lines.push(`  - ${power.description.trim()}`);
              }
              const props = power.properties ?? {};
              const propEntries = Object.entries(props);
              if (propEntries.length > 0) {
                const propSummary = propEntries.map(([k, v]) => `${k}: ${String(v)}`).join(", ");
                lines.push(`  - *Ominaisuudet:* ${propSummary}`);
              }
            }
          }
        }

        const rawInventory = Array.isArray(char.inventory) ? char.inventory : [];
        const inventoryItems = rawInventory.filter(
          (item): item is { name: string; description?: string; quantity?: number } =>
            typeof item === "object" &&
            item !== null &&
            "name" in item &&
            typeof (item as { name?: unknown }).name === "string" &&
            (item as { name: string }).name.trim().length > 0,
        );
        if (inventoryItems.length > 0) {
          lines.push("");
          lines.push("#### Varusteet");
          lines.push("");
          for (const item of inventoryItems) {
            const qty =
              typeof item.quantity === "number" && item.quantity > 1 ? ` (${item.quantity}×)` : "";
            const desc = item.description?.trim() ? ` — ${item.description.trim()}` : "";
            lines.push(`- ${item.name.trim()}${qty}${desc}`);
          }
        }

        if (char.motivation?.trim()) {
          lines.push("");
          lines.push("#### Motivaatio");
          lines.push("");
          lines.push(char.motivation.trim());
        }

        if (char.notes?.trim()) {
          lines.push("");
          lines.push("#### Julkinen kuvaus");
          lines.push("");
          lines.push(char.notes.trim());
        }

        const privateNotes = privateNotesByChar.get(char.id) ?? [];
        if (privateNotes.length > 0) {
          lines.push("");
          lines.push("#### Yksityiset muistiinpanot");
          for (const note of privateNotes) {
            const metaParts: string[] = [];
            if (note.isPinned) metaParts.push("kiinnitetty");
            if (note.episodeTitle) metaParts.push(`Jakso: ${note.episodeTitle}`);
            if (note.createdAtLabel) metaParts.push(note.createdAtLabel);
            const headingLabel = note.title ?? "Muistiinpano";
            const metaSuffix = metaParts.length > 0 ? ` *(${metaParts.join(", ")})*` : "";
            lines.push("");
            lines.push(`##### ${headingLabel}${metaSuffix}`);
            lines.push("");
            lines.push(note.content);
          }
        }

        const cabin = shipData.cabinByChar.get(char.id);
        const possessions = shipData.possessionsByChar.get(char.id) ?? [];
        const clocks = shipData.clocksByChar.get(char.id) ?? [];
        if (cabin || possessions.length > 0 || clocks.length > 0) {
          lines.push("");
          lines.push("#### Aamunkoi (Hytti ja omaisuus)");
          lines.push("");
          if (cabin) {
            const cabinTitle = cabin.cabinCustomTitle?.trim() || cabin.name;
            lines.push(`- **Hytti:** ${cabinTitle} (Kansi ${cabin.deckNumber}, \`${cabin.key}\`)`);
            if (cabin.cabinDecoration?.trim()) {
              lines.push(`- **Hytin sisustus:** ${cabin.cabinDecoration.trim()}`);
            }
            if (cabin.gmRoomNotes?.trim()) {
              lines.push(`- **PJ-muistiinpanot hytistä:** ${cabin.gmRoomNotes.trim()}`);
            }
          }
          if (possessions.length > 0) {
            lines.push("- **Hytin omaisuus:**");
            for (const item of possessions) {
              const desc = item.description.trim() ? ` — ${item.description.trim()}` : "";
              const gmNotes = item.gmMechanicalNotes?.trim()
                ? ` *(Mekaniikka: ${item.gmMechanicalNotes.trim()})*`
                : "";
              lines.push(`  - **${item.name}**${desc}${gmNotes}`);
            }
          }
          if (clocks.length > 0) {
            lines.push("- **Hahmokohtaiset kellot:**");
            for (const clock of clocks) {
              const categoryLabel = clock.category === "tutkimus" ? "Tutkimus" : "Projekti";
              const progress =
                clock.segmentsTotal != null
                  ? `${clock.segmentsFilled}/${clock.segmentsTotal}`
                  : `${clock.segmentsFilled} segmenttiä`;
              const statusLabel =
                clock.status === "completed"
                  ? "valmis"
                  : clock.status === "archived"
                    ? "arkistoitu"
                    : "aktiivinen";
              const desc = clock.description.trim() ? ` — ${clock.description.trim()}` : "";
              const compNotes = clock.completionNotes?.trim()
                ? ` *(Tulos: ${clock.completionNotes.trim()})*`
                : "";
              lines.push(
                `  - **${clock.title}** (${categoryLabel}, ${progress}, ${statusLabel})${desc}${compNotes}`,
              );
            }
          }
        }
      }

      playerSections.push(lines.join("\n"));
    }

    return {
      filename: "Hahmot.md",
      markdown: `${playerSections.join("\n\n---\n\n")}\n`,
    };
  }
}
