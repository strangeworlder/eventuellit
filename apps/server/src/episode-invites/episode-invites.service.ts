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
import { episodeInvites, episodePlayers, episodes, users } from "../db/schema";
import { CreateEpisodeInviteDto } from "./dto/create-episode-invite.dto";
import { RespondEpisodeInviteDto } from "./dto/respond-episode-invite.dto";

@Injectable()
export class EpisodeInvitesService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateEpisodeInviteDto, invitedBy: number) {
    const episodeRow = await this.db
      .select()
      .from(episodes)
      .where(eq(episodes.id, dto.episodeId));
    if (!episodeRow[0]) {
      throw new NotFoundException("Episode not found");
    }

    const userRow = await this.db.select().from(users).where(eq(users.id, dto.userId));
    if (!userRow[0]) {
      throw new NotFoundException("User not found");
    }

    const existing = await this.db
      .select()
      .from(episodeInvites)
      .where(
        and(
          eq(episodeInvites.episodeId, dto.episodeId),
          eq(episodeInvites.userId, dto.userId),
          eq(episodeInvites.status, "pending"),
        ),
      );
    if (existing[0]) {
      throw new ConflictException("A pending invite already exists for this player");
    }

    const alreadyEnrolled = await this.db
      .select()
      .from(episodePlayers)
      .where(
        and(
          eq(episodePlayers.episodeId, dto.episodeId),
          eq(episodePlayers.userId, dto.userId),
        ),
      );
    if (alreadyEnrolled[0]) {
      throw new ConflictException("Player is already enrolled in this episode");
    }

    const result = await this.db
      .insert(episodeInvites)
      .values({
        episodeId: dto.episodeId,
        userId: dto.userId,
        invitedBy,
        message: dto.message ?? null,
        status: "pending",
      })
      .returning();
    return result[0];
  }

  async findByEpisode(episodeId: number) {
    return this.db
      .select({
        id: episodeInvites.id,
        episodeId: episodeInvites.episodeId,
        userId: episodeInvites.userId,
        username: users.username,
        status: episodeInvites.status,
        message: episodeInvites.message,
        invitedBy: episodeInvites.invitedBy,
        createdAt: episodeInvites.createdAt,
        respondedAt: episodeInvites.respondedAt,
      })
      .from(episodeInvites)
      .leftJoin(users, eq(episodeInvites.userId, users.id))
      .where(eq(episodeInvites.episodeId, episodeId));
  }

  async findMine(userId: number) {
    return this.db
      .select({
        id: episodeInvites.id,
        episodeId: episodeInvites.episodeId,
        episodeTitle: episodes.title,
        episodeStatus: episodes.status,
        status: episodeInvites.status,
        message: episodeInvites.message,
        invitedByUsername: users.username,
        createdAt: episodeInvites.createdAt,
      })
      .from(episodeInvites)
      .leftJoin(episodes, eq(episodeInvites.episodeId, episodes.id))
      .leftJoin(users, eq(episodeInvites.invitedBy, users.id))
      .where(and(eq(episodeInvites.userId, userId), eq(episodeInvites.status, "pending")));
  }

  async respond(id: number, dto: RespondEpisodeInviteDto, userId: number) {
    const rows = await this.db
      .select()
      .from(episodeInvites)
      .where(eq(episodeInvites.id, id));
    if (!rows[0]) {
      throw new NotFoundException("Invite not found");
    }
    const invite = rows[0];

    if (invite.userId !== userId) {
      throw new ForbiddenException("You can only respond to your own invites");
    }

    if (invite.status !== "pending") {
      throw new ConflictException("This invite has already been responded to");
    }

    const now = new Date();

    await this.db
      .update(episodeInvites)
      .set({ status: dto.status, respondedAt: now })
      .where(eq(episodeInvites.id, id));

    if (dto.status === "accepted") {
      const alreadyEnrolled = await this.db
        .select()
        .from(episodePlayers)
        .where(
          and(
            eq(episodePlayers.episodeId, invite.episodeId),
            eq(episodePlayers.userId, invite.userId),
          ),
        );
      if (!alreadyEnrolled[0]) {
        await this.db
          .insert(episodePlayers)
          .values({ episodeId: invite.episodeId, userId: invite.userId });
      }
    }

    return { id, status: dto.status };
  }
}
