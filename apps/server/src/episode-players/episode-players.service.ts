import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { episodePlayers, episodes, users } from "../db/schema";
import { CreateEpisodePlayerDto } from "./dto/create-episode-player.dto";

@Injectable()
export class EpisodePlayersService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findByEpisode(episodeId: number, requestingUser: { id: number; role: string }) {
    const rows = await this.db
      .select({
        id: episodePlayers.id,
        episodeId: episodePlayers.episodeId,
        userId: episodePlayers.userId,
        username: users.username,
        createdAt: episodePlayers.createdAt,
      })
      .from(episodePlayers)
      .leftJoin(users, eq(episodePlayers.userId, users.id))
      .where(eq(episodePlayers.episodeId, episodeId));

    if (requestingUser.role === "gm") {
      return rows;
    }

    return rows.filter((r) => r.userId === requestingUser.id);
  }

  async enroll(data: CreateEpisodePlayerDto) {
    const episodeRow = await this.db
      .select()
      .from(episodes)
      .where(eq(episodes.id, data.episodeId));
    if (!episodeRow[0]) {
      throw new NotFoundException("Episode not found");
    }

    const userRow = await this.db
      .select()
      .from(users)
      .where(eq(users.id, data.userId));
    if (!userRow[0]) {
      throw new NotFoundException("User not found");
    }

    const existing = await this.db
      .select()
      .from(episodePlayers)
      .where(
        and(
          eq(episodePlayers.episodeId, data.episodeId),
          eq(episodePlayers.userId, data.userId),
        ),
      );
    if (existing[0]) {
      throw new ConflictException("Player is already enrolled in this episode");
    }

    const result = await this.db
      .insert(episodePlayers)
      .values({ episodeId: data.episodeId, userId: data.userId })
      .returning();
    return result[0];
  }

  async disenroll(id: number) {
    const existing = await this.db
      .select()
      .from(episodePlayers)
      .where(eq(episodePlayers.id, id));
    if (!existing[0]) {
      throw new NotFoundException("Enrollment not found");
    }
    await this.db.delete(episodePlayers).where(eq(episodePlayers.id, id));
  }

  async isEnrolled(episodeId: number, userId: number): Promise<boolean> {
    const rows = await this.db
      .select()
      .from(episodePlayers)
      .where(
        and(
          eq(episodePlayers.episodeId, episodeId),
          eq(episodePlayers.userId, userId),
        ),
      );
    return rows.length > 0;
  }

  async hasAnyEnrollments(episodeId: number): Promise<boolean> {
    const rows = await this.db
      .select()
      .from(episodePlayers)
      .where(eq(episodePlayers.episodeId, episodeId));
    return rows.length > 0;
  }

  async assertEnrolled(episodeId: number, userId: number, userRole: string): Promise<void> {
    if (userRole === "gm") return;
    const anyEnrolled = await this.hasAnyEnrollments(episodeId);
    if (!anyEnrolled) return;
    const enrolled = await this.isEnrolled(episodeId, userId);
    if (!enrolled) {
      throw new ForbiddenException("You are not enrolled in this episode");
    }
  }
}
