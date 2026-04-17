import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, inArray } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { episodeReadingItems, playerReadingProgress, users } from "../db/schema";
import type { CreateReadingProgressDto } from "./dto/create-reading-progress.dto";

@Injectable()
export class ReadingProgressService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async markRead(data: CreateReadingProgressDto, userId: number) {
    const item = await this.db
      .select()
      .from(episodeReadingItems)
      .where(eq(episodeReadingItems.id, data.readingItemId));
    if (!item[0]) {
      throw new NotFoundException("Reading item not found");
    }

    const existing = await this.db
      .select()
      .from(playerReadingProgress)
      .where(
        and(
          eq(playerReadingProgress.userId, userId),
          eq(playerReadingProgress.readingItemId, data.readingItemId),
        ),
      );

    if (existing[0]) {
      return existing[0];
    }

    const result = await this.db
      .insert(playerReadingProgress)
      .values({ userId, readingItemId: data.readingItemId })
      .returning();
    return result[0];
  }

  async unmarkRead(readingItemId: number, userId: number) {
    await this.db
      .delete(playerReadingProgress)
      .where(
        and(
          eq(playerReadingProgress.userId, userId),
          eq(playerReadingProgress.readingItemId, readingItemId),
        ),
      );
  }

  async getEpisodeProgress(episodeId: number) {
    const items = await this.db
      .select()
      .from(episodeReadingItems)
      .where(eq(episodeReadingItems.episodeId, episodeId));

    if (items.length === 0) {
      return [];
    }

    const itemIds = items.map((i) => i.id);

    const progressRows = await this.db
      .select({
        readingItemId: playerReadingProgress.readingItemId,
        userId: playerReadingProgress.userId,
        completedAt: playerReadingProgress.completedAt,
        username: users.username,
      })
      .from(playerReadingProgress)
      .leftJoin(users, eq(playerReadingProgress.userId, users.id))
      .where(inArray(playerReadingProgress.readingItemId, itemIds));

    const relevantProgress = progressRows;

    const byUser = new Map<
      number,
      { userId: number; username: string | null; completedItemIds: number[]; completedAt: Date[] }
    >();

    for (const row of relevantProgress) {
      if (!byUser.has(row.userId)) {
        byUser.set(row.userId, {
          userId: row.userId,
          username: row.username,
          completedItemIds: [],
          completedAt: [],
        });
      }
      const entry = byUser.get(row.userId)!;
      entry.completedItemIds.push(row.readingItemId);
      entry.completedAt.push(row.completedAt);
    }

    return Array.from(byUser.values()).map((entry) => ({
      userId: entry.userId,
      username: entry.username,
      completedCount: entry.completedItemIds.length,
      totalCount: items.length,
      completedItemIds: entry.completedItemIds,
    }));
  }
}
