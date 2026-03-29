import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { asc, eq, inArray } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { characters, characterEpisodes, users, episodes } from "../db/schema";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";

const characterWithOwnerColumns = {
  id: characters.id,
  userId: characters.userId,
  name: characters.name,
  archetype: characters.archetype,
  sex: characters.sex,
  motivation: characters.motivation,
  notes: characters.notes,
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
  createdAt: characters.createdAt,
  updatedAt: characters.updatedAt,
  ownerName: users.username,
};

type CharacterEpisodeRow = { id: number; title: string; status: string };

async function attachEpisodesForCharacters(
  db: NodePgDatabase<typeof schema>,
  rows: Array<Record<string, unknown>>,
): Promise<
  Array<
    Omit<(typeof rows)[number], never> & {
      episodes: CharacterEpisodeRow[];
    }
  >
> {
  if (rows.length === 0) {
    return rows as Array<(typeof rows)[number] & { episodes: CharacterEpisodeRow[] }>;
  }
  const characterIds = rows.map((r) => r.id as number);
  const linkRows = await db
    .select({
      characterId: characterEpisodes.characterId,
      id: episodes.id,
      title: episodes.title,
      status: episodes.status,
    })
    .from(characterEpisodes)
    .innerJoin(episodes, eq(characterEpisodes.episodeId, episodes.id))
    .where(inArray(characterEpisodes.characterId, characterIds))
    .orderBy(asc(characterEpisodes.characterId), asc(episodes.order));

  const byChar = new Map<number, CharacterEpisodeRow[]>();
  for (const row of linkRows) {
    const list = byChar.get(row.characterId) ?? [];
    list.push({ id: row.id, title: row.title, status: row.status });
    byChar.set(row.characterId, list);
  }
  return rows.map((r) => ({
    ...r,
    episodes: byChar.get(r.id as number) ?? [],
  })) as Array<(typeof rows)[number] & { episodes: CharacterEpisodeRow[] }>;
}

@Injectable()
export class CharactersService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

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
      episodeId: data.episodeId,
      sex: data.sex,
      motivation: data.motivation,
      notes: data.notes,
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
    const result = await this.db.insert(characters).values(insertData).returning();
    const character = result[0];

    // Also insert into characterEpisodes junction table
    if (data.episodeId) {
      await this.db.insert(characterEpisodes).values({
        characterId: character.id,
        episodeId: data.episodeId,
      });
    }

    return character;
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
      fysiikka: data.fysiikka,
      nopeus: data.nopeus,
      ymmarrys: data.ymmarrys,
      persoona: data.persoona,
      nakemys: data.nakemys,
      napparyys: data.napparyys,
      updatedAt: new Date(),
    };
    const result = await this.db
      .update(characters)
      .set(updateData)
      .where(eq(characters.id, id))
      .returning();
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
}
