import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ContentRegistryService } from "../content-registry/content-registry.service";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { episodeReadingItems, episodes, playerReadingProgress } from "../db/schema";
import type { CreateReadingItemDto } from "./dto/create-reading-item.dto";
import type { UpdateReadingItemDto } from "./dto/update-reading-item.dto";

@Injectable()
export class ReadingItemsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly contentRegistry: ContentRegistryService,
  ) {}

  async findByEpisode(episodeId: number, userId: number, sessionId?: number) {
    const whereClause =
      sessionId !== undefined
        ? and(
            eq(episodeReadingItems.episodeId, episodeId),
            eq(episodeReadingItems.sessionId, sessionId),
          )
        : eq(episodeReadingItems.episodeId, episodeId);

    const items = await this.db
      .select()
      .from(episodeReadingItems)
      .where(whereClause)
      .orderBy(episodeReadingItems.orderIndex, episodeReadingItems.createdAt);

    const completedRows = await this.db
      .select()
      .from(playerReadingProgress)
      .where(eq(playerReadingProgress.userId, userId));

    const completedSet = new Set(completedRows.map((r) => r.readingItemId));

    return items.map((item) => ({
      ...item,
      completed: completedSet.has(item.id),
    }));
  }

  async create(data: CreateReadingItemDto) {
    const episodeRow = await this.db.select().from(episodes).where(eq(episodes.id, data.episodeId));
    if (!episodeRow[0]) {
      throw new NotFoundException("Episode not found");
    }

    const scopeWhere =
      data.sessionId !== undefined
        ? and(
            eq(episodeReadingItems.episodeId, data.episodeId),
            eq(episodeReadingItems.sessionId, data.sessionId),
          )
        : and(
            eq(episodeReadingItems.episodeId, data.episodeId),
            isNull(episodeReadingItems.sessionId),
          );

    const existing = await this.db
      .select()
      .from(episodeReadingItems)
      .where(scopeWhere)
      .orderBy(episodeReadingItems.orderIndex);

    const nextOrder = existing.length > 0 ? Math.max(...existing.map((i) => i.orderIndex)) + 1 : 0;

    const result = await this.db
      .insert(episodeReadingItems)
      .values({
        episodeId: data.episodeId,
        sessionId: data.sessionId ?? null,
        contentType: data.contentType,
        contentRef: data.contentRef,
        title: data.title,
        description: data.description,
        url: data.url,
        orderIndex: data.orderIndex ?? nextOrder,
        autoSuggested: data.autoSuggested ?? false,
      })
      .returning();
    return result[0];
  }

  async update(id: number, data: UpdateReadingItemDto) {
    const existing = await this.db
      .select()
      .from(episodeReadingItems)
      .where(eq(episodeReadingItems.id, id));
    if (!existing[0]) {
      throw new NotFoundException("Reading item not found");
    }
    const result = await this.db
      .update(episodeReadingItems)
      .set({
        ...(data.sessionId !== undefined && { sessionId: data.sessionId }),
        ...(data.contentType !== undefined && { contentType: data.contentType }),
        ...(data.contentRef !== undefined && { contentRef: data.contentRef }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
      })
      .where(eq(episodeReadingItems.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    const existing = await this.db
      .select()
      .from(episodeReadingItems)
      .where(eq(episodeReadingItems.id, id));
    if (!existing[0]) {
      throw new NotFoundException("Reading item not found");
    }
    await this.db.delete(episodeReadingItems).where(eq(episodeReadingItems.id, id));
  }

  async getSuggestions(episodeId: number, sessionId?: number) {
    const episodeRow = await this.db.select().from(episodes).where(eq(episodes.id, episodeId));
    if (!episodeRow[0]) {
      throw new NotFoundException("Episode not found");
    }

    const episode = episodeRow[0];

    const scopeWhere =
      sessionId !== undefined
        ? and(
            eq(episodeReadingItems.episodeId, episodeId),
            eq(episodeReadingItems.sessionId, sessionId),
          )
        : eq(episodeReadingItems.episodeId, episodeId);

    const existing = await this.db.select().from(episodeReadingItems).where(scopeWhere);
    const existingRefs = new Set(
      existing.filter((i) => i.contentRef).map((i) => i.contentRef as string),
    );

    const suggestions = this.contentRegistry.buildSuggestions(episode, existingRefs);
    return suggestions;
  }
}
