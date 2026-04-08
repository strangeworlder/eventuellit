import { Inject, Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { playerNotifications, users } from "../db/schema";

@Injectable()
export class NotificationsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async getActiveForUser(userId: number) {
    const rows = await this.db
      .select()
      .from(playerNotifications)
      .where(and(eq(playerNotifications.userId, userId), isNull(playerNotifications.dismissedAt)));

    return { notifications: rows, count: rows.length };
  }

  async dismiss(id: number, userId: number) {
    const result = await this.db
      .update(playerNotifications)
      .set({ dismissedAt: new Date() })
      .where(and(eq(playerNotifications.id, id), eq(playerNotifications.userId, userId)))
      .returning();
    return result[0] ?? null;
  }

  async dismissByType(userId: number, type: string, referenceId?: string) {
    const conditions = [
      eq(playerNotifications.userId, userId),
      eq(playerNotifications.type, type),
      isNull(playerNotifications.dismissedAt),
    ];
    if (referenceId) {
      conditions.push(eq(playerNotifications.referenceId, referenceId));
    }
    const result = await this.db
      .update(playerNotifications)
      .set({ dismissedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result;
  }

  async create(userId: number, type: string, referenceId?: string, message?: string) {
    const result = await this.db
      .insert(playerNotifications)
      .values({ userId, type, referenceId, message })
      .returning();
    return result[0];
  }

  async createForAllPlayers(type: string, message?: string, referenceId?: string) {
    const players = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "player"));

    const values = players.map((p) => ({
      userId: p.id,
      type,
      referenceId,
      message,
    }));

    if (values.length === 0) return [];
    const result = await this.db.insert(playerNotifications).values(values).returning();
    return result;
  }
}
