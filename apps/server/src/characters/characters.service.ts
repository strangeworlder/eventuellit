import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { characters, users } from "../db/schema";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";

const characterWithOwnerColumns = {
  id: characters.id,
  userId: characters.userId,
  name: characters.name,
  archetype: characters.archetype,
  keho: characters.keho,
  currentKeho: characters.currentKeho,
  mieli: characters.mieli,
  currentMieli: characters.currentMieli,
  tera: characters.tera,
  currentTera: characters.currentTera,
  sisuDie: characters.sisuDie,
  sisuCount: characters.sisuCount,
  currentSisuCount: characters.currentSisuCount,
  vaurio: characters.vaurio,
  skills: characters.skills,
  inventory: characters.inventory,
  createdAt: characters.createdAt,
  updatedAt: characters.updatedAt,
  ownerName: users.username,
};

@Injectable()
export class CharactersService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db
      .select(characterWithOwnerColumns)
      .from(characters)
      .leftJoin(users, eq(characters.userId, users.id));
  }

  async findOne(id: number) {
    const rows = await this.db
      .select(characterWithOwnerColumns)
      .from(characters)
      .leftJoin(users, eq(characters.userId, users.id))
      .where(eq(characters.id, id));
    return rows[0] ?? null;
  }

  async create(data: CreateCharacterDto, userId: number) {
    const insertData: typeof characters.$inferInsert = {
      name: data.name,
      archetype: data.archetype,
      keho: data.keho,
      currentKeho: data.keho,
      mieli: data.mieli,
      currentMieli: data.mieli,
      tera: data.tera,
      currentTera: data.tera,
      sisuDie: data.sisuDie,
      sisuCount: data.sisuCount,
      currentSisuCount: data.sisuCount,
      skills: data.skills ?? [],
      inventory: [],
      userId,
    };
    const result = await this.db.insert(characters).values(insertData).returning();
    return result[0];
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
      keho: data.keho,
      currentKeho: data.currentKeho,
      mieli: data.mieli,
      currentMieli: data.currentMieli,
      tera: data.tera,
      currentTera: data.currentTera,
      sisuDie: data.sisuDie,
      sisuCount: data.sisuCount,
      currentSisuCount: data.currentSisuCount,
      vaurio: data.vaurio,
      skills: data.skills,
      inventory: data.inventory,
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
