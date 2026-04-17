import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { and, asc, eq, inArray, or } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import {
  characterEpisodes,
  characters,
  episodeInvites,
  episodePlayers,
  episodeReadingItems,
  episodes,
  playerReadingProgress,
  sessionPlayerRecaps,
  sessions,
  users,
} from "../db/schema";
import { NotificationsService } from "../notifications/notifications.service";

export interface DashboardAction {
  type:
    | "create_character"
    | "link_character"
    | "update_character"
    | "update_names"
    | "reading"
    | "task"
    | "write_recap";
  label: string;
  description: string;
  priority: number;
  url: string;
  meta?: Record<string, unknown>;
}

export interface DashboardEpisode {
  episodeId: number;
  episodeTitle: string;
  episodeSlug: string;
  episodeStatus: string;
  actions: DashboardAction[];
}

export interface DashboardResponse {
  pendingInvites: Array<{
    id: number;
    episodeId: number;
    episodeTitle: string | null;
    episodeStatus: string | null;
    message: string | null;
    invitedByUsername: string | null;
    createdAt: Date;
  }>;
  episodes: DashboardEpisode[];
  notificationCount: number;
}

export interface GmOverviewPlayer {
  userId: number;
  username: string | null;
  hasCharacterLinked: boolean;
  characterName: string | null;
  readingProgress: { completed: number; total: number };
  pendingRecaps: number;
  inviteStatus: "enrolled" | "pending" | "declined" | null;
}

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getDashboard(userId: number): Promise<DashboardResponse> {
    // ── 1. Pending invites ────────────────────────────────────────────────────
    const pendingInvites = await this.db
      .select({
        id: episodeInvites.id,
        episodeId: episodeInvites.episodeId,
        episodeTitle: episodes.title,
        episodeStatus: episodes.status,
        message: episodeInvites.message,
        invitedByUsername: users.username,
        createdAt: episodeInvites.createdAt,
      })
      .from(episodeInvites)
      .leftJoin(episodes, eq(episodeInvites.episodeId, episodes.id))
      .leftJoin(users, eq(episodeInvites.invitedBy, users.id))
      .where(and(eq(episodeInvites.userId, userId), eq(episodeInvites.status, "pending")));

    // ── 2. Enrolled episodes ──────────────────────────────────────────────────
    const enrolledEpisodes = await this.db
      .select({
        episodeId: episodes.id,
        episodeTitle: episodes.title,
        episodeSlug: episodes.slug,
        episodeStatus: episodes.status,
      })
      .from(episodePlayers)
      .innerJoin(episodes, eq(episodePlayers.episodeId, episodes.id))
      .where(eq(episodePlayers.userId, userId))
      .orderBy(asc(episodes.order));

    if (enrolledEpisodes.length === 0) {
      const { count: notificationCount } = await this.notificationsService.getActiveForUser(userId);
      return { pendingInvites, episodes: [], notificationCount };
    }

    const enrolledEpisodeIds = enrolledEpisodes.map((e) => e.episodeId);

    // ── 3. Batch: user characters and episode links ───────────────────────────
    const userCharacters = await this.db
      .select({ id: characters.id })
      .from(characters)
      .where(eq(characters.userId, userId));

    const hasAnyCharacter = userCharacters.length > 0;

    // Characters linked via junction table
    const junctionLinks = await this.db
      .select({
        characterId: characterEpisodes.characterId,
        episodeId: characterEpisodes.episodeId,
        name: characters.name,
      })
      .from(characterEpisodes)
      .innerJoin(characters, eq(characterEpisodes.characterId, characters.id))
      .where(
        and(
          inArray(characterEpisodes.episodeId, enrolledEpisodeIds),
          eq(characters.userId, userId),
        ),
      );

    // Fallback: characters linked only via characters.episodeId (legacy)
    const legacyLinks = await this.db
      .select({ id: characters.id, episodeId: characters.episodeId, name: characters.name })
      .from(characters)
      .where(
        and(eq(characters.userId, userId), inArray(characters.episodeId, enrolledEpisodeIds)),
      );

    // Build episodeId → { id, name } map, backfilling junction rows for legacy links
    const linkedCharByEpisode = new Map<number, { id: number; name: string }>();
    for (const link of junctionLinks) {
      if (!linkedCharByEpisode.has(link.episodeId)) {
        linkedCharByEpisode.set(link.episodeId, { id: link.characterId, name: link.name });
      }
    }
    const backfillValues: Array<{ characterId: number; episodeId: number }> = [];
    for (const legacy of legacyLinks) {
      if (legacy.episodeId && !linkedCharByEpisode.has(legacy.episodeId)) {
        linkedCharByEpisode.set(legacy.episodeId, { id: legacy.id, name: legacy.name });
        backfillValues.push({ characterId: legacy.id, episodeId: legacy.episodeId });
      }
    }
    // Backfill missing junction rows fire-and-forget — no await on the hot path
    if (backfillValues.length > 0) {
      void this.db
        .insert(characterEpisodes)
        .values(backfillValues)
        .onConflictDoNothing()
        .catch(() => {});
    }

    // ── 4. Batch: next/planned sessions for all enrolled episodes ─────────────
    const upcomingSessions = await this.db
      .select()
      .from(sessions)
      .where(
        and(
          inArray(sessions.episodeId, enrolledEpisodeIds),
          or(eq(sessions.status, "next"), eq(sessions.status, "planned")),
        ),
      )
      .orderBy(asc(sessions.episodeId), asc(sessions.sessionNumber));

    // episodeId → first upcoming session
    const nextSessionByEpisode = new Map<number, (typeof upcomingSessions)[number]>();
    for (const s of upcomingSessions) {
      if (!nextSessionByEpisode.has(s.episodeId)) {
        nextSessionByEpisode.set(s.episodeId, s);
      }
    }

    // ── 5. Batch: all reading items for enrolled episodes ─────────────────────
    const allReadingItems = await this.db
      .select()
      .from(episodeReadingItems)
      .where(inArray(episodeReadingItems.episodeId, enrolledEpisodeIds));

    // episodeId → reading items
    const readingItemsByEpisode = new Map<number, typeof allReadingItems>();
    for (const item of allReadingItems) {
      const list = readingItemsByEpisode.get(item.episodeId) ?? [];
      list.push(item);
      readingItemsByEpisode.set(item.episodeId, list);
    }

    // ── 6. Batch: reading progress for this user ──────────────────────────────
    const allItemIds = allReadingItems.map((i) => i.id);
    const completedItemIds = new Set<number>();
    if (allItemIds.length > 0) {
      const progress = await this.db
        .select({ readingItemId: playerReadingProgress.readingItemId })
        .from(playerReadingProgress)
        .where(
          and(
            eq(playerReadingProgress.userId, userId),
            inArray(playerReadingProgress.readingItemId, allItemIds),
          ),
        );
      for (const p of progress) completedItemIds.add(p.readingItemId);
    }

    // ── 7. Batch: played+published sessions and player recaps ─────────────────
    const playedSessions = await this.db
      .select()
      .from(sessions)
      .where(
        and(
          inArray(sessions.episodeId, enrolledEpisodeIds),
          eq(sessions.status, "played"),
          eq(sessions.recapPublished, true),
        ),
      )
      .orderBy(asc(sessions.episodeId), asc(sessions.sessionNumber));

    const playedSessionIds = playedSessions.map((s) => s.id);
    const writtenRecapSessionIds = new Set<number>();
    if (playedSessionIds.length > 0) {
      const recaps = await this.db
        .select({ sessionId: sessionPlayerRecaps.sessionId })
        .from(sessionPlayerRecaps)
        .where(
          and(
            inArray(sessionPlayerRecaps.sessionId, playedSessionIds),
            eq(sessionPlayerRecaps.userId, userId),
          ),
        );
      for (const r of recaps) writtenRecapSessionIds.add(r.sessionId);
    }

    // episodeId → played sessions
    const playedSessionsByEpisode = new Map<number, typeof playedSessions>();
    for (const s of playedSessions) {
      const list = playedSessionsByEpisode.get(s.episodeId) ?? [];
      list.push(s);
      playedSessionsByEpisode.set(s.episodeId, list);
    }

    // ── 8. Assemble episode results (zero queries in this loop) ───────────────
    const episodeResults: DashboardEpisode[] = [];

    for (const ep of enrolledEpisodes) {
      const actions: DashboardAction[] = [];
      const linkedChar = linkedCharByEpisode.get(ep.episodeId);

      if (!hasAnyCharacter) {
        actions.push({
          type: "create_character",
          label: "Luo hahmo",
          description: "Sinulla ei ole vielä hahmoa. Luo hahmo ennen kuin voit valmistautua.",
          priority: 1,
          url: "/generator/new",
        });
      } else if (!linkedChar) {
        actions.push({
          type: "link_character",
          label: "Yhdistä hahmo jaksoon",
          description: `Yhdistä hahmosi jaksoon "${ep.episodeTitle}".`,
          priority: 2,
          url: "/generator/list",
          meta: { episodeId: ep.episodeId },
        });
      } else {
        const nextSession = nextSessionByEpisode.get(ep.episodeId);

        if (nextSession) {
          const episodeItems = readingItemsByEpisode.get(ep.episodeId) ?? [];
          const scopedItems = episodeItems.filter(
            (i) => i.sessionId === nextSession.id || i.sessionId === null,
          );

          if (scopedItems.length > 0) {
            const incomplete = scopedItems.filter((i) => !completedItemIds.has(i.id));
            const incompleteUpdateCharTasks = incomplete.filter(
              (i) => i.contentType === "task" && i.contentRef === "update-character",
            );
            const incompleteReadingItems = incomplete.filter((i) => i.contentType !== "task");
            const incompleteOtherTasks = incomplete.filter(
              (i) => i.contentType === "task" && i.contentRef !== "update-character",
            );

            for (const _ of incompleteUpdateCharTasks) {
              actions.push({
                type: "update_character",
                label: "Päivitä hahmo",
                description: `Päivitä hahmosi "${linkedChar.name}" ennen seuraavaa sessiota.`,
                priority: 3,
                url: `/generator/character/${linkedChar.id}`,
                meta: { characterId: linkedChar.id, sessionId: nextSession.id },
              });
            }

            if (incompleteReadingItems.length > 0) {
              const totalReading = scopedItems.filter((i) => i.contentType !== "task").length;
              const sessionLabel =
                nextSession.label ||
                `Sessio #${String(nextSession.sessionNumber).padStart(2, "0")}`;
              actions.push({
                type: "reading",
                label: "Lukemisto kesken",
                description: `${sessionLabel}: Lukemistoa jäljellä ${incompleteReadingItems.length} / ${totalReading}`,
                priority: 4,
                url: `/generator/prep/${ep.episodeId}`,
                meta: {
                  sessionId: nextSession.id,
                  completed: totalReading - incompleteReadingItems.length,
                  total: totalReading,
                },
              });
            }

            if (incompleteOtherTasks.length > 0) {
              const totalOtherTasks = scopedItems.filter(
                (i) => i.contentType === "task" && i.contentRef !== "update-character",
              ).length;
              const sessionLabel =
                nextSession.label ||
                `Sessio #${String(nextSession.sessionNumber).padStart(2, "0")}`;
              actions.push({
                type: "task",
                label: "Tehtäviä kesken",
                description: `${sessionLabel}: Tehtäviä jäljellä ${incompleteOtherTasks.length} / ${totalOtherTasks}`,
                priority: 5,
                url: `/generator/prep/${ep.episodeId}`,
                meta: {
                  sessionId: nextSession.id,
                  completed: totalOtherTasks - incompleteOtherTasks.length,
                  total: totalOtherTasks,
                },
              });
            }
          }
        }

        // Recap actions
        const epPlayedSessions = playedSessionsByEpisode.get(ep.episodeId) ?? [];
        for (const session of epPlayedSessions) {
          if (!writtenRecapSessionIds.has(session.id)) {
            const sessionLabel =
              session.label || `Sessio #${String(session.sessionNumber).padStart(2, "0")}`;
            actions.push({
              type: "write_recap",
              label: "Kirjoita kertaus",
              description: `Kirjoita kertaus sessiosta: ${sessionLabel}`,
              priority: 6,
              url: `/episodes/${ep.episodeSlug}/kertaus`,
              meta: { sessionId: session.id },
            });
          }
        }
      }

      actions.sort((a, b) => a.priority - b.priority);
      episodeResults.push({
        episodeId: ep.episodeId,
        episodeTitle: ep.episodeTitle,
        episodeSlug: ep.episodeSlug,
        episodeStatus: ep.episodeStatus,
        actions,
      });
    }

    // ── 9. Notifications ──────────────────────────────────────────────────────
    const { notifications, count: notificationCount } =
      await this.notificationsService.getActiveForUser(userId);

    const notificationLabelMap: Record<
      string,
      {
        label: string;
        defaultDescription: string;
        priority: number;
        urlFn: (refId?: string | null) => string;
      }
    > = {
      update_names: {
        label: "Päivitä lempinimet",
        defaultDescription: "Lisää hahmollesi lempinimet.",
        priority: 2,
        urlFn: (refId) => (refId ? `/generator/character/${refId}` : "/generator/list"),
      },
    };

    // Batch: fetch all character–episode links needed for notification routing
    const notifCharIds = notifications
      .map((n) => n.referenceId)
      .filter(Boolean)
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));

    const notifCharLinks =
      notifCharIds.length > 0
        ? await this.db
            .select({
              characterId: characterEpisodes.characterId,
              episodeId: characterEpisodes.episodeId,
            })
            .from(characterEpisodes)
            .innerJoin(characters, eq(characterEpisodes.characterId, characters.id))
            .where(inArray(characterEpisodes.characterId, notifCharIds))
        : [];

    // charId → episodeId
    const notifCharEpisodeMap = new Map<number, number>();
    for (const link of notifCharLinks) {
      notifCharEpisodeMap.set(link.characterId, link.episodeId);
    }

    // episodeId → DashboardEpisode result
    const episodeResultMap = new Map<number, DashboardEpisode>();
    for (const ep of episodeResults) {
      episodeResultMap.set(ep.episodeId, ep);
    }

    for (const notification of notifications) {
      const mapping = notificationLabelMap[notification.type];
      if (!mapping) continue;

      const action: DashboardAction = {
        type: notification.type as DashboardAction["type"],
        label: mapping.label,
        description: notification.message ?? mapping.defaultDescription,
        priority: mapping.priority,
        url: mapping.urlFn(notification.referenceId),
        meta: { notificationId: notification.id, referenceId: notification.referenceId },
      };

      const charId = notification.referenceId ? Number(notification.referenceId) : Number.NaN;
      const targetEpisodeId = !Number.isNaN(charId)
        ? notifCharEpisodeMap.get(charId)
        : undefined;
      const targetEp = targetEpisodeId ? episodeResultMap.get(targetEpisodeId) : episodeResults[0];

      if (targetEp) {
        targetEp.actions.push(action);
        targetEp.actions.sort((a, b) => a.priority - b.priority);
      }
    }

    return { pendingInvites, episodes: episodeResults, notificationCount };
  }

  async getGmOverview(
    episodeId: number,
    requestingUserRole: string,
  ): Promise<{ players: GmOverviewPlayer[] }> {
    if (requestingUserRole !== "gm") {
      throw new ForbiddenException("Only GMs can view the overview");
    }

    // ── 1. Enrolled players ───────────────────────────────────────────────────
    const enrolledPlayers = await this.db
      .select({
        userId: episodePlayers.userId,
        username: users.username,
      })
      .from(episodePlayers)
      .leftJoin(users, eq(episodePlayers.userId, users.id))
      .where(eq(episodePlayers.episodeId, episodeId));

    // ── 2. Invites ────────────────────────────────────────────────────────────
    const invites = await this.db
      .select({
        userId: episodeInvites.userId,
        username: users.username,
        status: episodeInvites.status,
      })
      .from(episodeInvites)
      .leftJoin(users, eq(episodeInvites.userId, users.id))
      .where(eq(episodeInvites.episodeId, episodeId));

    const enrolledIds = new Set(enrolledPlayers.map((p) => p.userId));
    const inviteMap = new Map(invites.map((i) => [i.userId, i]));

    const allUserEntries = new Map<number, { userId: number; username: string | null }>();
    for (const p of enrolledPlayers) {
      allUserEntries.set(p.userId, { userId: p.userId, username: p.username });
    }
    for (const i of invites) {
      if (!allUserEntries.has(i.userId)) {
        allUserEntries.set(i.userId, { userId: i.userId, username: i.username });
      }
    }

    if (allUserEntries.size === 0) return { players: [] };

    const allUserIds = Array.from(allUserEntries.keys());

    // ── 3. Batch: reading items for this episode ──────────────────────────────
    const readingItems = await this.db
      .select({ id: episodeReadingItems.id })
      .from(episodeReadingItems)
      .where(eq(episodeReadingItems.episodeId, episodeId));

    const readingItemIds = readingItems.map((i) => i.id);

    // ── 4. Batch: reading progress for all players ────────────────────────────
    const progressCountByUser = new Map<number, number>();
    if (readingItemIds.length > 0) {
      const progressRows = await this.db
        .select({
          userId: playerReadingProgress.userId,
          readingItemId: playerReadingProgress.readingItemId,
        })
        .from(playerReadingProgress)
        .where(
          and(
            inArray(playerReadingProgress.userId, allUserIds),
            inArray(playerReadingProgress.readingItemId, readingItemIds),
          ),
        );
      for (const row of progressRows) {
        progressCountByUser.set(row.userId, (progressCountByUser.get(row.userId) ?? 0) + 1);
      }
    }

    // ── 5. Batch: played+published sessions ───────────────────────────────────
    const playedSessions = await this.db
      .select({ id: sessions.id })
      .from(sessions)
      .where(
        and(
          eq(sessions.episodeId, episodeId),
          eq(sessions.status, "played"),
          eq(sessions.recapPublished, true),
        ),
      );

    // ── 6. Batch: all player recaps for those sessions ────────────────────────
    const writtenRecapsByUser = new Map<number, Set<number>>();
    if (playedSessions.length > 0) {
      const recaps = await this.db
        .select({
          sessionId: sessionPlayerRecaps.sessionId,
          userId: sessionPlayerRecaps.userId,
        })
        .from(sessionPlayerRecaps)
        .where(inArray(sessionPlayerRecaps.sessionId, playedSessions.map((s) => s.id)));

      for (const r of recaps) {
        const set = writtenRecapsByUser.get(r.userId) ?? new Set<number>();
        set.add(r.sessionId);
        writtenRecapsByUser.set(r.userId, set);
      }
    }

    // ── 7. Batch: character links for all users in this episode ───────────────
    const gmJunctionLinks = await this.db
      .select({
        userId: characters.userId,
        characterId: characterEpisodes.characterId,
        characterName: characters.name,
      })
      .from(characterEpisodes)
      .innerJoin(characters, eq(characterEpisodes.characterId, characters.id))
      .where(
        and(
          eq(characterEpisodes.episodeId, episodeId),
          inArray(characters.userId, allUserIds),
        ),
      );

    const gmLegacyLinks = await this.db
      .select({ userId: characters.userId, id: characters.id, name: characters.name })
      .from(characters)
      .where(and(inArray(characters.userId, allUserIds), eq(characters.episodeId, episodeId)));

    const linkedCharByUser = new Map<number, { id: number; name: string }>();
    for (const link of gmJunctionLinks) {
      if (!linkedCharByUser.has(link.userId)) {
        linkedCharByUser.set(link.userId, { id: link.characterId, name: link.characterName });
      }
    }
    for (const legacy of gmLegacyLinks) {
      if (!linkedCharByUser.has(legacy.userId)) {
        linkedCharByUser.set(legacy.userId, { id: legacy.id, name: legacy.name });
      }
    }

    // ── 8. Assemble (zero queries in this loop) ───────────────────────────────
    const result: GmOverviewPlayer[] = [];

    for (const [userId, entry] of allUserEntries) {
      const linkedChar = linkedCharByUser.get(userId);
      const completedCount = progressCountByUser.get(userId) ?? 0;
      const writtenRecaps = writtenRecapsByUser.get(userId) ?? new Set<number>();
      const pendingRecaps = playedSessions.filter((s) => !writtenRecaps.has(s.id)).length;

      const isEnrolled = enrolledIds.has(userId);
      const invite = inviteMap.get(userId);
      let inviteStatus: GmOverviewPlayer["inviteStatus"] = null;
      if (isEnrolled) {
        inviteStatus = "enrolled";
      } else if (invite?.status === "pending") {
        inviteStatus = "pending";
      } else if (invite?.status === "declined") {
        inviteStatus = "declined";
      }

      result.push({
        userId,
        username: entry.username,
        hasCharacterLinked: !!linkedChar,
        characterName: linkedChar?.name ?? null,
        readingProgress: { completed: completedCount, total: readingItemIds.length },
        pendingRecaps,
        inviteStatus,
      });
    }

    return { players: result };
  }
}
