import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import {
  missionComments,
  missionOptions,
  missionVotes,
  users,
  votingRounds,
} from "../db/schema";
import type { CastVoteDto } from "./dto/cast-vote.dto";
import type { CreateCommentDto } from "./dto/create-comment.dto";
import type { CreateOptionDto } from "./dto/create-option.dto";
import type { CreateRoundDto } from "./dto/create-round.dto";
import type { UpdateOptionDto } from "./dto/update-option.dto";
import type { UpdateRoundDto } from "./dto/update-round.dto";

@Injectable()
export class MissionVotesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  // ─── Rounds ────────────────────────────────────────────────────────────────

  async getActiveRound(userId: number) {
    const rounds = await this.db
      .select()
      .from(votingRounds)
      .where(eq(votingRounds.status, "open"))
      .orderBy(desc(votingRounds.createdAt))
      .limit(1);

    const round = rounds[0];
    if (!round) return { round: null, options: [], myVote: null };

    const options = await this.db
      .select()
      .from(missionOptions)
      .where(eq(missionOptions.roundId, round.id))
      .orderBy(missionOptions.orderIndex);

    const myVotes = await this.db
      .select()
      .from(missionVotes)
      .where(and(eq(missionVotes.roundId, round.id), eq(missionVotes.userId, userId)));

    return {
      round,
      options,
      myVote: myVotes[0] ?? null,
    };
  }

  async createRound(dto: CreateRoundDto, gmId: number) {
    // Ensure no other open round exists
    const existing = await this.db
      .select({ id: votingRounds.id })
      .from(votingRounds)
      .where(eq(votingRounds.status, "open"))
      .limit(1);

    if (existing.length > 0) {
      throw new BadRequestException(
        "An open voting round already exists. Close it before creating a new one.",
      );
    }

    const [round] = await this.db
      .insert(votingRounds)
      .values({
        title: dto.title,
        status: "open",
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        createdBy: gmId,
      })
      .returning();

    return round;
  }

  async updateRound(roundId: number, dto: UpdateRoundDto) {
    const round = await this.requireRound(roundId);

    const updates: Partial<typeof votingRounds.$inferInsert> = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.deadline !== undefined)
      updates.deadline = dto.deadline ? new Date(dto.deadline) : null;
    if (dto.status !== undefined) {
      updates.status = dto.status;
      if (dto.status === "closed") updates.closedAt = new Date();
    }

    const [updated] = await this.db
      .update(votingRounds)
      .set(updates)
      .where(eq(votingRounds.id, roundId))
      .returning();

    return updated;
  }

  async deleteRound(roundId: number) {
    await this.requireRound(roundId);
    await this.db.delete(votingRounds).where(eq(votingRounds.id, roundId));
    return { deleted: true };
  }

  // ─── Options ───────────────────────────────────────────────────────────────

  async addOption(roundId: number, dto: CreateOptionDto) {
    await this.requireRound(roundId);

    const [option] = await this.db
      .insert(missionOptions)
      .values({
        roundId,
        title: dto.title,
        description: dto.description ?? null,
        image: dto.image ?? null,
        urgency: dto.urgency ?? "normaali",
        orderIndex: dto.orderIndex ?? 0,
      })
      .returning();

    return option;
  }

  async updateOption(roundId: number, optionId: number, dto: UpdateOptionDto) {
    await this.requireOption(roundId, optionId);

    const updates: Partial<typeof missionOptions.$inferInsert> = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.image !== undefined) updates.image = dto.image;
    if (dto.urgency !== undefined) updates.urgency = dto.urgency;
    if (dto.orderIndex !== undefined) updates.orderIndex = dto.orderIndex;

    const [updated] = await this.db
      .update(missionOptions)
      .set(updates)
      .where(eq(missionOptions.id, optionId))
      .returning();

    return updated;
  }

  async deleteOption(roundId: number, optionId: number) {
    await this.requireOption(roundId, optionId);
    await this.db.delete(missionOptions).where(eq(missionOptions.id, optionId));
    return { deleted: true };
  }

  // ─── Voting ────────────────────────────────────────────────────────────────

  async castVote(roundId: number, userId: number, dto: CastVoteDto) {
    const round = await this.requireRound(roundId);
    if (round.status === "closed") {
      throw new ForbiddenException("This voting round is closed.");
    }

    // Validate options belong to this round
    await this.requireOption(roundId, dto.primaryOptionId);
    if (dto.secondaryOptionId !== undefined) {
      if (dto.secondaryOptionId === dto.primaryOptionId) {
        throw new BadRequestException(
          "Primary and secondary choices must be different options.",
        );
      }
      await this.requireOption(roundId, dto.secondaryOptionId);
    }

    // Upsert — if player already voted, replace their vote
    const existing = await this.db
      .select({ id: missionVotes.id })
      .from(missionVotes)
      .where(and(eq(missionVotes.roundId, roundId), eq(missionVotes.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await this.db
        .update(missionVotes)
        .set({
          primaryOptionId: dto.primaryOptionId,
          secondaryOptionId: dto.secondaryOptionId ?? null,
          votedAt: new Date(),
        })
        .where(and(eq(missionVotes.roundId, roundId), eq(missionVotes.userId, userId)))
        .returning();
      return updated;
    }

    const [vote] = await this.db
      .insert(missionVotes)
      .values({
        roundId,
        userId,
        primaryOptionId: dto.primaryOptionId,
        secondaryOptionId: dto.secondaryOptionId ?? null,
      })
      .returning();

    return vote;
  }

  async deleteVote(roundId: number, userId: number) {
    const round = await this.requireRound(roundId);
    if (round.status === "closed") {
      throw new ForbiddenException("This voting round is closed.");
    }
    await this.db
      .delete(missionVotes)
      .where(and(eq(missionVotes.roundId, roundId), eq(missionVotes.userId, userId)));
    return { deleted: true };
  }

  /**
   * Returns the top-two options by weighted score.
   * Score = (primaryVotes × 3) + (secondaryVotes × 1).
   * Does NOT return raw tallies — only titles and IDs (anonymous to players).
   */
  async getResults(roundId: number) {
    await this.requireRound(roundId);
    const scored = await this.computeScores(roundId);
    return scored.slice(0, 2).map(({ optionId, title }) => ({ optionId, title }));
  }

  /**
   * Full results with tallies — GM only.
   */
  async getFullResults(roundId: number) {
    await this.requireRound(roundId);
    return this.computeScores(roundId);
  }

  private async computeScores(roundId: number) {
    const options = await this.db
      .select()
      .from(missionOptions)
      .where(eq(missionOptions.roundId, roundId));

    const votes = await this.db
      .select()
      .from(missionVotes)
      .where(eq(missionVotes.roundId, roundId));

    return options
      .map((opt) => {
        const primaryCount = votes.filter((v) => v.primaryOptionId === opt.id).length;
        const secondaryCount = votes.filter((v) => v.secondaryOptionId === opt.id).length;
        const score = primaryCount * 3 + secondaryCount;
        return { optionId: opt.id, title: opt.title, score, primaryCount, secondaryCount };
      })
      .sort((a, b) => b.score - a.score);
  }

  // ─── Comments ──────────────────────────────────────────────────────────────

  async getComments(optionId: number) {
    const rows = await this.db
      .select({
        id: missionComments.id,
        content: missionComments.content,
        anonymous: missionComments.anonymous,
        createdAt: missionComments.createdAt,
        author: users.username,
      })
      .from(missionComments)
      .innerJoin(users, eq(missionComments.userId, users.id))
      .where(eq(missionComments.optionId, optionId))
      .orderBy(missionComments.createdAt);

    // Mask author name for anonymous comments
    return rows.map((row) => ({
      ...row,
      author: row.anonymous ? null : row.author,
    }));
  }

  async addComment(optionId: number, userId: number, dto: CreateCommentDto) {
    const [comment] = await this.db
      .insert(missionComments)
      .values({
        optionId,
        userId,
        content: dto.content,
        anonymous: dto.anonymous ?? false,
      })
      .returning();
    return comment;
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async requireRound(roundId: number) {
    const rows = await this.db
      .select()
      .from(votingRounds)
      .where(eq(votingRounds.id, roundId))
      .limit(1);
    if (!rows[0]) throw new NotFoundException(`Voting round ${roundId} not found`);
    return rows[0];
  }

  private async requireOption(roundId: number, optionId: number) {
    const rows = await this.db
      .select()
      .from(missionOptions)
      .where(and(eq(missionOptions.id, optionId), eq(missionOptions.roundId, roundId)))
      .limit(1);
    if (!rows[0])
      throw new NotFoundException(`Option ${optionId} not found in round ${roundId}`);
    return rows[0];
  }
}
