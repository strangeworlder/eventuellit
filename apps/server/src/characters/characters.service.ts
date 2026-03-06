import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { characters } from "../db/schema";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";

@Injectable()
export class CharactersService {
  constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    ) { }

  async findAll() {
    return this.db.query.characters.findMany();
  }

  async findOne(id: number) {
    return this.db.query.characters.findFirst({
      where: eq(characters.id, id),
    });
  }

  async create(data: CreateCharacterDto) {
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
    };
    const result = await this.db.insert(characters).values(insertData).returning();
    return result[0];
  }

  async update(id: number, data: UpdateCharacterDto) {
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

  async remove(id: number) {
    await this.db.delete(characters).where(eq(characters.id, id));
  }
}
