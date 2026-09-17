import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { episodes, sessions } from "../db/schema";
import { EpisodePlayersService } from "../episode-players/episode-players.service";
import type { CreateSessionDto } from "./dto/create-session.dto";
import type { UpdateSessionDto } from "./dto/update-session.dto";

@Injectable()
export class SessionsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    @Inject(EpisodePlayersService) private readonly episodePlayersService: EpisodePlayersService,
  ) {}

  async findByEpisode(episodeId: number, viewer: { id: number; role: string } | null) {
    const rows = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.episodeId, episodeId))
      .orderBy(sessions.sessionNumber);

    const isGm = viewer?.role === "gm";
    let isEnrolled = false;
    let canEditRecap = false;

    if (viewer) {
      if (isGm) {
        isEnrolled = true;
      } else {
        const anyEnrolled = await this.episodePlayersService.hasAnyEnrollments(episodeId);
        if (!anyEnrolled) {
          isEnrolled = true;
          canEditRecap = true;
        } else {
          isEnrolled = await this.episodePlayersService.isEnrolled(episodeId, viewer.id);
          canEditRecap = isEnrolled;
        }
      }
    }

    return rows.map((row) => {
      const sessionData = {
        ...row,
        isEnrolled,
        canEditRecap,
      };
      if (!isGm && !row.recapPublished) {
        return { ...sessionData, gmRecap: null as string | null };
      }
      return sessionData;
    });
  }

  async create(data: CreateSessionDto) {
    const episodeRow = await this.db.select().from(episodes).where(eq(episodes.id, data.episodeId));
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
    const existing = await this.db.select().from(sessions).where(eq(sessions.id, id));
    if (!existing[0]) {
      throw new NotFoundException("Session not found");
    }

    const updateData: Partial<typeof sessions.$inferInsert> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.label !== undefined) updateData.label = data.label;
    if (data.date !== undefined) {
      updateData.date = data.date ? new Date(data.date) : null;
    }
    if (data.gmRecap !== undefined) updateData.gmRecap = data.gmRecap;
    if (data.recapPublished !== undefined) {
      updateData.recapPublished = data.recapPublished;
      if (data.recapPublished === true && existing[0].status !== "played") {
        updateData.status = "played";
      }
    }

    const result = await this.db
      .update(sessions)
      .set(updateData)
      .where(eq(sessions.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    const existing = await this.db.select().from(sessions).where(eq(sessions.id, id));
    if (!existing[0]) {
      throw new NotFoundException("Session not found");
    }
    await this.db.delete(sessions).where(eq(sessions.id, id));
  }
}
