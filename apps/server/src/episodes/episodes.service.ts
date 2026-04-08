import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { episodeSkills, episodes } from "../db/schema";
import type { CreateEpisodeDto } from "./dto/create-episode.dto";
import type { CreateEpisodeSkillDto } from "./dto/create-episode-skill.dto";
import type { UpdateEpisodeDto } from "./dto/update-episode.dto";
import type { UpdateEpisodeSkillDto } from "./dto/update-episode-skill.dto";

@Injectable()
export class EpisodesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async findAll(status?: string) {
    if (status) {
      return this.db
        .select()
        .from(episodes)
        .where(eq(episodes.status, status))
        .orderBy(episodes.order);
    }
    return this.db.select().from(episodes).orderBy(episodes.order);
  }

  async findOne(id: number) {
    const rows = await this.db.select().from(episodes).where(eq(episodes.id, id));
    if (!rows[0]) {
      throw new NotFoundException("Episode not found");
    }
    return rows[0];
  }

  async create(data: CreateEpisodeDto, gmId: number) {
    const insertData: typeof episodes.$inferInsert = {
      slug: data.slug,
      title: data.title,
      order: data.order ?? 99,
      status: data.status ?? "planned",
      description: data.description,
      content: data.content,
      players: data.players,
      sessionDates: data.sessionDates,
      location: data.location,
      locationLink: data.locationLink,
      image: data.image,
      imageAlt: data.imageAlt,
      mechanicalAdditions: data.mechanicalAdditions,
      summary: data.summary,
      tyrannyRoll: data.tyrannyRoll,
      gmId,
    };
    const result = await this.db.insert(episodes).values(insertData).returning();
    return result[0];
  }

  async update(id: number, data: UpdateEpisodeDto) {
    await this.findOne(id); // throws if not found

    const updateData: Partial<typeof episodes.$inferInsert> = {
      ...data,
      updatedAt: new Date(),
    };
    const result = await this.db
      .update(episodes)
      .set(updateData)
      .where(eq(episodes.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    await this.findOne(id); // throws if not found
    await this.db.delete(episodes).where(eq(episodes.id, id));
  }

  // --- Skills ---

  async findSkills(episodeId: number) {
    await this.findOne(episodeId); // throws if episode not found
    return this.db.select().from(episodeSkills).where(eq(episodeSkills.episodeId, episodeId));
  }

  async addSkill(episodeId: number, data: CreateEpisodeSkillDto) {
    await this.findOne(episodeId); // throws if episode not found
    const result = await this.db
      .insert(episodeSkills)
      .values({ episodeId, name: data.name })
      .returning();
    return result[0];
  }

  async updateSkill(episodeId: number, skillId: number, data: UpdateEpisodeSkillDto) {
    await this.findOne(episodeId);
    const skill = await this.db.select().from(episodeSkills).where(eq(episodeSkills.id, skillId));
    if (!skill[0] || skill[0].episodeId !== episodeId) {
      throw new NotFoundException("Skill not found for this episode");
    }
    const result = await this.db
      .update(episodeSkills)
      .set({ name: data.name })
      .where(eq(episodeSkills.id, skillId))
      .returning();
    return result[0];
  }

  async removeSkill(episodeId: number, skillId: number) {
    await this.findOne(episodeId);
    const skill = await this.db.select().from(episodeSkills).where(eq(episodeSkills.id, skillId));
    if (!skill[0] || skill[0].episodeId !== episodeId) {
      throw new NotFoundException("Skill not found for this episode");
    }
    await this.db.delete(episodeSkills).where(eq(episodeSkills.id, skillId));
  }
}
