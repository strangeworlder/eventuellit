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

    const userCharacters = await this.db
      .select({ id: characters.id })
      .from(characters)
      .where(eq(characters.userId, userId));

    const hasAnyCharacter = userCharacters.length > 0;

    const episodeResults: DashboardEpisode[] = [];

    for (const ep of enrolledEpisodes) {
      const actions: DashboardAction[] = [];

      if (!hasAnyCharacter) {
        actions.push({
          type: "create_character",
          label: "Luo hahmo",
          description: "Sinulla ei ole vielä hahmoa. Luo hahmo ennen kuin voit valmistautua.",
          priority: 1,
          url: "/generator/new",
        });
      } else {
        // Check junction table first
        let linkedChars = await this.db
          .select({ id: characters.id, name: characters.name })
          .from(characterEpisodes)
          .innerJoin(characters, eq(characterEpisodes.characterId, characters.id))
          .where(and(eq(characterEpisodes.episodeId, ep.episodeId), eq(characters.userId, userId)));

        // Fallback: characters created before the junction table was populated
        // may only have characters.episodeId set without a character_episodes row.
        if (linkedChars.length === 0) {
          const directLinked = await this.db
            .select({ id: characters.id, name: characters.name })
            .from(characters)
            .where(and(eq(characters.userId, userId), eq(characters.episodeId, ep.episodeId)));
          if (directLinked.length > 0) {
            // Backfill the missing junction table rows so future queries work correctly
            for (const char of directLinked) {
              await this.db
                .insert(characterEpisodes)
                .values({ characterId: char.id, episodeId: ep.episodeId })
                .onConflictDoNothing();
            }
            linkedChars = directLinked;
          }
        }

        if (linkedChars.length === 0) {
          actions.push({
            type: "link_character",
            label: "Yhdistä hahmo jaksoon",
            description: `Yhdistä hahmosi jaksoon "${ep.episodeTitle}".`,
            priority: 2,
            url: "/generator/list",
            meta: { episodeId: ep.episodeId },
          });
        } else {
          const linkedChar = linkedChars[0];

          const nextSession = await this.db
            .select()
            .from(sessions)
            .where(
              and(
                eq(sessions.episodeId, ep.episodeId),
                or(eq(sessions.status, "next"), eq(sessions.status, "planned")),
              ),
            )
            .orderBy(asc(sessions.sessionNumber))
            .limit(1);

          if (nextSession[0]) {
            const session = nextSession[0];
            const sessionItems = await this.db
              .select()
              .from(episodeReadingItems)
              .where(
                and(
                  eq(episodeReadingItems.episodeId, ep.episodeId),
                  eq(episodeReadingItems.sessionId, session.id),
                ),
              );

            const episodeLevelItems = await this.db
              .select()
              .from(episodeReadingItems)
              .where(
                and(
                  eq(episodeReadingItems.episodeId, ep.episodeId),
                  // sessionId IS NULL - drizzle uses sql`` but we can check length
                ),
              );

            const allItems = [
              ...sessionItems,
              ...episodeLevelItems.filter((i) => i.sessionId === null),
            ];

            if (allItems.length > 0) {
              const itemIds = allItems.map((i) => i.id);
              const progress = await this.db
                .select()
                .from(playerReadingProgress)
                .where(
                  and(
                    eq(playerReadingProgress.userId, userId),
                    inArray(playerReadingProgress.readingItemId, itemIds),
                  ),
                );
              const completedIds = new Set(progress.map((p) => p.readingItemId));

              const incompleteItems = allItems.filter((i) => !completedIds.has(i.id));
              const incompleteUpdateCharTasks = incompleteItems.filter(
                (i) => i.contentType === "task" && i.contentRef === "update-character",
              );
              const incompleteReadingItems = incompleteItems.filter(
                (i) => i.contentType !== "task",
              );
              const incompleteOtherTasks = incompleteItems.filter(
                (i) => i.contentType === "task" && i.contentRef !== "update-character",
              );

              for (const _ of incompleteUpdateCharTasks) {
                actions.push({
                  type: "update_character",
                  label: "Päivitä hahmo",
                  description: `Päivitä hahmosi "${linkedChar.name}" ennen seuraavaa sessiota.`,
                  priority: 3,
                  url: `/generator/character/${linkedChar.id}`,
                  meta: { characterId: linkedChar.id, sessionId: session.id },
                });
              }

              if (incompleteReadingItems.length > 0) {
                const sessionLabel =
                  session.label || `Sessio #${String(session.sessionNumber).padStart(2, "0")}`;
                actions.push({
                  type: "reading",
                  label: "Lukemisto kesken",
                  description: `${sessionLabel}: Lukemistoa jäljellä ${incompleteReadingItems.length} / ${allItems.filter((i) => i.contentType !== "task").length}`,
                  priority: 4,
                  url: `/generator/prep/${ep.episodeId}`,
                  meta: {
                    sessionId: session.id,
                    completed:
                      allItems.filter((i) => i.contentType !== "task").length -
                      incompleteReadingItems.length,
                    total: allItems.filter((i) => i.contentType !== "task").length,
                  },
                });
              }

              if (incompleteOtherTasks.length > 0) {
                const sessionLabel =
                  session.label || `Sessio #${String(session.sessionNumber).padStart(2, "0")}`;
                actions.push({
                  type: "task",
                  label: "Tehtäviä kesken",
                  description: `${sessionLabel}: Tehtäviä jäljellä ${incompleteOtherTasks.length} / ${allItems.filter((i) => i.contentType === "task" && i.contentRef !== "update-character").length}`,
                  priority: 5,
                  url: `/generator/prep/${ep.episodeId}`,
                  meta: {
                    sessionId: session.id,
                    completed:
                      allItems.filter(
                        (i) => i.contentType === "task" && i.contentRef !== "update-character",
                      ).length - incompleteOtherTasks.length,
                    total: allItems.filter(
                      (i) => i.contentType === "task" && i.contentRef !== "update-character",
                    ).length,
                  },
                });
              }
            }
          }

          const playedSessions = await this.db
            .select()
            .from(sessions)
            .where(
              and(
                eq(sessions.episodeId, ep.episodeId),
                eq(sessions.status, "played"),
                eq(sessions.recapPublished, true),
              ),
            )
            .orderBy(asc(sessions.sessionNumber));

          for (const session of playedSessions) {
            const recap = await this.db
              .select()
              .from(sessionPlayerRecaps)
              .where(
                and(
                  eq(sessionPlayerRecaps.sessionId, session.id),
                  eq(sessionPlayerRecaps.userId, userId),
                ),
              );
            if (!recap[0]) {
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

    // Fetch active notifications and convert to dashboard actions
    const { notifications, count: notificationCount } =
      await this.notificationsService.getActiveForUser(userId);

    // Map notification types to dashboard actions
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

    for (const notification of notifications) {
      const mapping = notificationLabelMap[notification.type];
      if (!mapping) continue;

      // Find which episode this character belongs to, if any
      let targetEpisodeResult: DashboardEpisode | undefined;
      if (notification.referenceId) {
        const charId = Number(notification.referenceId);
        for (const ep of episodeResults) {
          // Check if this character is linked to this episode
          const linkedChars = await this.db
            .select({ id: characters.id })
            .from(characterEpisodes)
            .innerJoin(characters, eq(characterEpisodes.characterId, characters.id))
            .where(and(eq(characterEpisodes.episodeId, ep.episodeId), eq(characters.id, charId)));
          if (linkedChars.length > 0) {
            targetEpisodeResult = ep;
            break;
          }
        }
      }

      const action: DashboardAction = {
        type: notification.type as DashboardAction["type"],
        label: mapping.label,
        description: notification.message ?? mapping.defaultDescription,
        priority: mapping.priority,
        url: mapping.urlFn(notification.referenceId),
        meta: { notificationId: notification.id, referenceId: notification.referenceId },
      };

      if (targetEpisodeResult) {
        targetEpisodeResult.actions.push(action);
        targetEpisodeResult.actions.sort((a, b) => a.priority - b.priority);
      } else if (episodeResults.length > 0) {
        // Attach to first episode if we can't determine the right one
        episodeResults[0].actions.push(action);
        episodeResults[0].actions.sort((a, b) => a.priority - b.priority);
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

    const enrolledPlayers = await this.db
      .select({
        userId: episodePlayers.userId,
        username: users.username,
      })
      .from(episodePlayers)
      .leftJoin(users, eq(episodePlayers.userId, users.id))
      .where(eq(episodePlayers.episodeId, episodeId));

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

    const readingItems = await this.db
      .select({ id: episodeReadingItems.id })
      .from(episodeReadingItems)
      .where(eq(episodeReadingItems.episodeId, episodeId));

    const readingItemIds = readingItems.map((i) => i.id);

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

    const result: GmOverviewPlayer[] = [];

    for (const [userId, entry] of allUserEntries) {
      let linkedChar = await this.db
        .select({ id: characters.id, name: characters.name })
        .from(characterEpisodes)
        .innerJoin(characters, eq(characterEpisodes.characterId, characters.id))
        .where(and(eq(characterEpisodes.episodeId, episodeId), eq(characters.userId, userId)))
        .limit(1);

      // Fallback for legacy characters linked only via characters.episodeId
      if (linkedChar.length === 0) {
        linkedChar = await this.db
          .select({ id: characters.id, name: characters.name })
          .from(characters)
          .where(and(eq(characters.userId, userId), eq(characters.episodeId, episodeId)))
          .limit(1);
      }

      let completedCount = 0;
      if (readingItemIds.length > 0) {
        const progress = await this.db
          .select()
          .from(playerReadingProgress)
          .where(
            and(
              eq(playerReadingProgress.userId, userId),
              inArray(playerReadingProgress.readingItemId, readingItemIds),
            ),
          );
        completedCount = progress.length;
      }

      let pendingRecaps = 0;
      for (const session of playedSessions) {
        const recap = await this.db
          .select()
          .from(sessionPlayerRecaps)
          .where(
            and(
              eq(sessionPlayerRecaps.sessionId, session.id),
              eq(sessionPlayerRecaps.userId, userId),
            ),
          );
        if (!recap[0]) pendingRecaps++;
      }

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
        hasCharacterLinked: linkedChar.length > 0,
        characterName: linkedChar[0]?.name ?? null,
        readingProgress: { completed: completedCount, total: readingItemIds.length },
        pendingRecaps,
        inviteStatus,
      });
    }

    return { players: result };
  }
}
