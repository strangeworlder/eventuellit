import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { sessionPlayerRecaps, sessions, users } from "../db/schema";
import { EpisodePlayersService } from "../episode-players/episode-players.service";
import { UpsertSessionPlayerRecapDto } from "./dto/upsert-session-player-recap.dto";

@Injectable()
export class SessionRecapsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly episodePlayersService: EpisodePlayersService,
  ) {}

  private async getSessionOrThrow(sessionId: number) {
    const rows = await this.db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (!rows[0]) {
      throw new NotFoundException("Session not found");
    }
    return rows[0];
  }

  async findBySession(
    sessionId: number,
    viewer: { id: number; role: string } | null,
  ) {
    const session = await this.getSessionOrThrow(sessionId);
    if (viewer) {
      await this.episodePlayersService.assertEnrolled(
        session.episodeId,
        viewer.id,
        viewer.role,
      );
    }

    const isGm = viewer?.role === "gm";
    const published = session.recapPublished;

    // Anonymous on unpublished session: nothing to show
    if (!isGm && !published && !viewer) return [];

    const whereClause =
      isGm || published
        ? eq(sessionPlayerRecaps.sessionId, sessionId)
        : and(
            eq(sessionPlayerRecaps.sessionId, sessionId),
            eq(sessionPlayerRecaps.userId, viewer!.id),
          );

    return this.db
      .select({
        id: sessionPlayerRecaps.id,
        sessionId: sessionPlayerRecaps.sessionId,
        userId: sessionPlayerRecaps.userId,
        username: users.username,
        journal: sessionPlayerRecaps.journal,
        highlight: sessionPlayerRecaps.highlight,
        surprise: sessionPlayerRecaps.surprise,
        mvp: sessionPlayerRecaps.mvp,
        createdAt: sessionPlayerRecaps.createdAt,
        updatedAt: sessionPlayerRecaps.updatedAt,
      })
      .from(sessionPlayerRecaps)
      .leftJoin(users, eq(sessionPlayerRecaps.userId, users.id))
      .where(whereClause);
  }

  async upsert(dto: UpsertSessionPlayerRecapDto, viewer: { id: number; role: string }) {
    const session = await this.getSessionOrThrow(dto.sessionId);
    if (session.status !== "played") {
      throw new BadRequestException("Recaps can only be written for played sessions");
    }
    await this.episodePlayersService.assertEnrolled(
      session.episodeId,
      viewer.id,
      viewer.role,
    );

    const now = new Date();
    const values = {
      journal: dto.journal ?? null,
      highlight: dto.highlight ?? null,
      surprise: dto.surprise ?? null,
      mvp: dto.mvp ?? null,
      updatedAt: now,
    };

    const existing = await this.db
      .select()
      .from(sessionPlayerRecaps)
      .where(
        and(
          eq(sessionPlayerRecaps.sessionId, dto.sessionId),
          eq(sessionPlayerRecaps.userId, viewer.id),
        ),
      );

    if (existing[0]) {
      const result = await this.db
        .update(sessionPlayerRecaps)
        .set(values)
        .where(eq(sessionPlayerRecaps.id, existing[0].id))
        .returning();
      return result[0];
    }

    const result = await this.db
      .insert(sessionPlayerRecaps)
      .values({
        sessionId: dto.sessionId,
        userId: viewer.id,
        ...values,
        createdAt: now,
      })
      .returning();
    return result[0];
  }

  async remove(id: number, viewer: { id: number; role: string }) {
    const rows = await this.db
      .select()
      .from(sessionPlayerRecaps)
      .where(eq(sessionPlayerRecaps.id, id));
    if (!rows[0]) {
      throw new NotFoundException("Recap not found");
    }
    const recap = rows[0];

    const sessionRows = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.id, recap.sessionId));
    const session = sessionRows[0];
    if (!session) {
      throw new NotFoundException("Session not found");
    }

    await this.episodePlayersService.assertEnrolled(
      session.episodeId,
      viewer.id,
      viewer.role,
    );

    if (viewer.role !== "gm" && recap.userId !== viewer.id) {
      throw new ForbiddenException("You can only delete your own recap");
    }

    await this.db.delete(sessionPlayerRecaps).where(eq(sessionPlayerRecaps.id, id));
  }
}
