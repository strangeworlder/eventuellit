import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { asc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { monkPowers } from "../db/schema";
import type { CreateMonkPowerDto } from "./dto/create-monk-power.dto";
import type { UpdateMonkPowerDto } from "./dto/update-monk-power.dto";

@Injectable()
export class MonkPowersService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async findAll(tier?: number) {
    if (tier !== undefined) {
      return this.db
        .select()
        .from(monkPowers)
        .where(eq(monkPowers.tier, tier))
        .orderBy(asc(monkPowers.tier), asc(monkPowers.name));
    }
    return this.db
      .select()
      .from(monkPowers)
      .orderBy(asc(monkPowers.tier), asc(monkPowers.name));
  }

  async findOne(id: number) {
    const rows = await this.db.select().from(monkPowers).where(eq(monkPowers.id, id));
    if (!rows[0]) {
      throw new NotFoundException("Monk power not found");
    }
    return rows[0];
  }

  async create(data: CreateMonkPowerDto) {
    const insertData: typeof monkPowers.$inferInsert = {
      name: data.name,
      tier: data.tier,
      description: data.description,
      properties: data.properties ?? {},
    };
    const result = await this.db.insert(monkPowers).values(insertData).returning();
    return result[0];
  }

  async update(id: number, data: UpdateMonkPowerDto) {
    await this.findOne(id);

    const updateData: Partial<typeof monkPowers.$inferInsert> = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.tier !== undefined && { tier: data.tier }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.properties !== undefined && { properties: data.properties }),
      updatedAt: new Date(),
    };

    const result = await this.db
      .update(monkPowers)
      .set(updateData)
      .where(eq(monkPowers.id, id))
      .returning();

    return result[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.delete(monkPowers).where(eq(monkPowers.id, id));
    return { success: true };
  }
}
