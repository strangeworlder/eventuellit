import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { episodes, sessions } from "../db/schema";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";

@Injectable()
export class SessionsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findByEpisode(episodeId: number) {
    return this.db
      .select()
      .from(sessions)
      .where(eq(sessions.episodeId, episodeId))
      .orderBy(sessions.sessionNumber);
  }

  async create(data: CreateSessionDto) {
    const episodeRow = await this.db
      .select()
      .from(episodes)
      .where(eq(episodes.id, data.episodeId));
    if (!episodeRow[0]) {
      throw new NotFoundException("Episode not found");
    }

    const date = data.date ? new Date(data.date) : null;

    const result = await this.db
      .insert(sessions)
      .values({
        episodeId: data.episodeId,
        sessionNumber: data.sessionNumber,
        date: date ?? undefined,
        label: data.label,
        status: "planned",
      })
      .returning();
    return result[0];
  }

  async update(id: number, data: UpdateSessionDto) {
    const existing = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    if (!existing[0]) {
      throw new NotFoundException("Session not found");
    }

    const updateData: Partial<typeof sessions.$inferInsert> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.label !== undefined) updateData.label = data.label;
    if (data.date !== undefined) {
      updateData.date = data.date ? new Date(data.date) : null;
    }

    const result = await this.db
      .update(sessions)
      .set(updateData)
      .where(eq(sessions.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    const existing = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    if (!existing[0]) {
      throw new NotFoundException("Session not found");
    }
    await this.db.delete(sessions).where(eq(sessions.id, id));
  }

  async migrateFromEpisodeDates(episodeId: number) {
    const episodeRow = await this.db
      .select()
      .from(episodes)
      .where(eq(episodes.id, episodeId));
    if (!episodeRow[0]) {
      throw new NotFoundException("Episode not found");
    }

    const existing = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.episodeId, episodeId));
    if (existing.length > 0) {
      throw new ConflictException("Sessions already exist for this episode");
    }

    const sessionDates = episodeRow[0].sessionDates;
    if (!sessionDates || !sessionDates.trim()) {
      return [];
    }

    const dates = sessionDates
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const rows = await Promise.all(
      dates.map(async (dateStr, index) => {
        const date = new Date(dateStr);
        const result = await this.db
          .insert(sessions)
          .values({
            episodeId,
            sessionNumber: index + 1,
            date: Number.isNaN(date.getTime()) ? undefined : date,
            status: "planned",
          })
          .returning();
        return result[0];
      }),
    );

    return rows;
  }
}
