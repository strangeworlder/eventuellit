import { randomUUID } from "node:crypto";
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import {
  characterArcSnapshots,
  characterEpisodes,
  characters,
  episodePlayers,
  episodes,
  sessions,
  users,
} from "../db/schema";
import { NotificationsService } from "../notifications/notifications.service";
import { addN4, kestoBonusFromPackedAttribute } from "./attribute-dice";
import type { AdvanceCharacterDto } from "./dto/advance-character.dto";
import type { CreateCharacterDto } from "./dto/create-character.dto";
import type { RefreshCharacterDto } from "./dto/refresh-character.dto";
import type { UpdateCharacterDto } from "./dto/update-character.dto";

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
        and(
          eq(sessions.episodeId, characterEpisodes.episodeId),
          eq(sessions.status, "played"),
        ),
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

  return rows.map((r) => ({
    ...r,
    episodes: byChar.get(r.id as number) ?? [],
    hasPlayedSessions: withPlayedSessions.has(r.id as number),
  })) as Array<
    (typeof rows)[number] & { episodes: CharacterEpisodeRow[]; hasPlayedSessions: boolean }
  >;
}

@Injectable()
export class CharactersService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly notificationsService: NotificationsService,
  ) {}

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
    return attachEpisodesForCharacters(this.db, rows);
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
    return withEpisodes[0] ?? null;
  }

  async create(data: CreateCharacterDto, userId: number) {
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
      skills: data.skills ?? [],
      inventory: [],
      fysiikka: data.fysiikka ?? 0,
      nopeus: data.nopeus ?? 0,
      ymmarrys: data.ymmarrys ?? 0,
      persoona: data.persoona ?? 0,
      nakemys: data.nakemys ?? 0,
      napparyys: data.napparyys ?? 0,
      userId,
    };

    return this.db.transaction(async (tx) => {
      const result = await tx.insert(characters).values(insertData).returning();
      const character = result[0];

      // Also insert into characterEpisodes junction table
      if (data.episodeId) {
        await tx.insert(characterEpisodes).values({
          characterId: character.id,
          episodeId: data.episodeId,
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
      skills: data.skills,
      inventory: data.inventory,
      nicknames: data.nicknames,
      fysiikka: data.fysiikka,
      nopeus: data.nopeus,
      ymmarrys: data.ymmarrys,
      persoona: data.persoona,
      nakemys: data.nakemys,
      napparyys: data.napparyys,
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
    const { character, link } = await this.assertOwnedLinkedCharacter(characterId, data.episodeId, userId);
    if (link.refreshedAt) {
      return { refreshed: true, alreadyRefreshed: true };
    }

    const healedIndexes = new Set(data.healedHarmitIndexes ?? []);
    const currentHarmit = Array.isArray(character.harmit) ? character.harmit : [];
    const updatedHarmit = currentHarmit.map((harmi, index) => {
      if (
        typeof harmi === "object" &&
        harmi !== null &&
        "text" in harmi &&
        "healed" in harmi &&
        healedIndexes.has(index)
      ) {
        return {
          ...(harmi as { text: string; healed: boolean }),
          healed: true,
        };
      }
      return harmi;
    });

    const shouldMarkRemoved = this.hasFiveHarmit(updatedHarmit);
    await this.db
      .update(characters)
      .set({
        currentKeho: character.keho,
        currentMieli: character.mieli,
        currentTera: character.tera,
        removedSisuIds: [],
        harmit: updatedHarmit,
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
    const { character, link } = await this.assertOwnedLinkedCharacter(characterId, data.episodeId, userId);
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

    const nextKeho = 8 + kestoBonusFromPackedAttribute(nextFysiikka) + kestoBonusFromPackedAttribute(nextNopeus);
    const nextMieli =
      8 + kestoBonusFromPackedAttribute(nextYmmarrys) + kestoBonusFromPackedAttribute(nextPersoona);
    const nextTera =
      8 + kestoBonusFromPackedAttribute(nextNakemys) + kestoBonusFromPackedAttribute(nextNapparyys);

    const sisuDice = Array.isArray(character.sisuDice)
      ? [...(character.sisuDice as Array<{ id: string; faces: number }>)]
      : [];
    if (data.reward === "skills_plus_n6") {
      sisuDice.push({ id: `sisu-${randomUUID()}`, faces: 6 });
    } else {
      sisuDice.push({ id: `sisu-${randomUUID()}`, faces: 8 });
    }

    const skillCap = data.reward === "skills_plus_n6" ? 2 : 1;
    const appendedSkills = (data.newSkills ?? []).slice(0, skillCap);
    const skills = Array.isArray(character.skills) ? [...character.skills] : [];
    for (const skill of appendedSkills) {
      skills.push({ name: skill, isCustom: true });
    }

    return this.db.transaction(async (tx) => {
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
          updatedAt: new Date(),
        })
        .where(eq(characters.id, characterId))
        .returning();
      const updated = updatedRows[0];

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
}
