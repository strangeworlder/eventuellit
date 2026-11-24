import { Inject, Injectable, NotFoundException, type OnModuleInit } from "@nestjs/common";
import { asc, eq, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import {
  episodePlayers,
  episodeSkills,
  episodes,
  sessionPlayerRecaps,
  sessions,
  users,
} from "../db/schema";
import type { CreateEpisodeDto } from "./dto/create-episode.dto";
import type { CreateEpisodeSkillDto } from "./dto/create-episode-skill.dto";
import { normalizeTyrannyRolls } from "./dto/tyranny-roll.validation";
import type { UpdateEpisodeDto } from "./dto/update-episode.dto";
import type { UpdateEpisodeSkillDto } from "./dto/update-episode-skill.dto";

function cleanText(text: string): string {
  return text.replace(/\u00AD/g, "").trim();
}

function formatEpisodeStatusFi(status: string): string {
  switch (status) {
    case "active":
      return "Aktiivinen";
    case "completed":
      return "Arkistoitu";
    case "planned":
      return "Tulossa";
    default:
      return status;
  }
}

function formatSessionStatusFi(status: string): string {
  switch (status) {
    case "played":
      return "Pelattu";
    case "next":
      return "Seuraava";
    case "planned":
      return "Tulossa";
    default:
      return status;
  }
}

function formatDateFi(date: Date | string | null | undefined, long = false): string | null {
  if (!date) return null;
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  if (long) {
    return parsed.toLocaleDateString("fi-FI", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return parsed.toLocaleDateString("fi-FI");
}

@Injectable()
export class EpisodesService implements OnModuleInit {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async onModuleInit() {
    if (typeof this.db.execute !== "function") return;
    await this.db.execute(sql`
      ALTER TABLE episodes
      ADD COLUMN IF NOT EXISTS tyranny_rolls JSONB NOT NULL DEFAULT '[]'::jsonb
    `);
    await this.db.execute(sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'episodes'
            AND column_name = 'tyranny_roll'
        ) THEN
          UPDATE episodes
          SET
            tyranny_rolls = CASE
              WHEN tyranny_rolls = '[]'::jsonb THEN jsonb_build_array(tyranny_roll::text)
              ELSE tyranny_rolls
            END,
            tyranny_roll = NULL
          WHERE tyranny_roll IS NOT NULL;
        END IF;
      END $$;
    `);
  }

  async findAll(status?: string) {
    if (status) {
      return this.db
        .select()
        .from(episodes)
        .where(eq(episodes.status, status))
        .orderBy(episodes.order);
    }
    return this.db.select().from(episodes).orderBy(episodes.order);
  }

  async findOne(id: number) {
    const rows = await this.db.select().from(episodes).where(eq(episodes.id, id));
    if (!rows[0]) {
      throw new NotFoundException("Episode not found");
    }
    return rows[0];
  }

  async create(data: CreateEpisodeDto, gmId: number) {
    const insertData: typeof episodes.$inferInsert = {
      slug: data.slug,
      title: data.title,
      order: data.order ?? 99,
      status: data.status ?? "planned",
      description: data.description,
      content: data.content,
      location: data.location,
      locationLink: data.locationLink,
      image: data.image,
      imageAlt: data.imageAlt,
      theme: data.theme,
      players: data.players,
      sessionDates: data.sessionDates,
      mechanicalAdditions: data.mechanicalAdditions,
      summary: data.summary,
      tyrannyRolls: normalizeTyrannyRolls(data.tyrannyRolls) ?? [],
      mediaId: data.mediaId,
      gmId,
    };
    const result = await this.db.insert(episodes).values(insertData).returning();
    return result[0];
  }

  async update(id: number, data: UpdateEpisodeDto) {
    await this.findOne(id); // throws if not found

    const updateData: Partial<typeof episodes.$inferInsert> = {
      ...data,
      ...(data.tyrannyRolls !== undefined
        ? { tyrannyRolls: normalizeTyrannyRolls(data.tyrannyRolls) }
        : {}),
      updatedAt: new Date(),
    };
    const result = await this.db
      .update(episodes)
      .set(updateData)
      .where(eq(episodes.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    await this.findOne(id); // throws if not found
    await this.db.delete(episodes).where(eq(episodes.id, id));
  }

  // --- Skills ---

  async findSkills(episodeId: number) {
    await this.findOne(episodeId); // throws if episode not found
    return this.db.select().from(episodeSkills).where(eq(episodeSkills.episodeId, episodeId));
  }

  async addSkill(episodeId: number, data: CreateEpisodeSkillDto) {
    await this.findOne(episodeId); // throws if episode not found
    const result = await this.db
      .insert(episodeSkills)
      .values({ episodeId, name: data.name })
      .returning();
    return result[0];
  }

  async updateSkill(episodeId: number, skillId: number, data: UpdateEpisodeSkillDto) {
    await this.findOne(episodeId);
    const skill = await this.db.select().from(episodeSkills).where(eq(episodeSkills.id, skillId));
    if (!skill[0] || skill[0].episodeId !== episodeId) {
      throw new NotFoundException("Skill not found for this episode");
    }
    const result = await this.db
      .update(episodeSkills)
      .set({ name: data.name })
      .where(eq(episodeSkills.id, skillId))
      .returning();
    return result[0];
  }

  async removeSkill(episodeId: number, skillId: number) {
    await this.findOne(episodeId);
    const skill = await this.db.select().from(episodeSkills).where(eq(episodeSkills.id, skillId));
    if (!skill[0] || skill[0].episodeId !== episodeId) {
      throw new NotFoundException("Skill not found for this episode");
    }
    await this.db.delete(episodeSkills).where(eq(episodeSkills.id, skillId));
  }

  /** Export all episodes with metadata, skills, players, summaries, and session recaps as clean Markdown. */
  async exportMarkdown(): Promise<{ filename: string; markdown: string }> {
    const [allEpisodes, allSkills, allPlayers, allSessions, allPlayerRecaps] = await Promise.all([
      this.db.select().from(episodes).orderBy(asc(episodes.order), asc(episodes.id)),
      this.db
        .select()
        .from(episodeSkills)
        .orderBy(asc(episodeSkills.episodeId), asc(episodeSkills.id)),
      this.db
        .select({
          episodeId: episodePlayers.episodeId,
          username: users.username,
        })
        .from(episodePlayers)
        .leftJoin(users, eq(episodePlayers.userId, users.id))
        .orderBy(asc(episodePlayers.episodeId), asc(episodePlayers.id)),
      this.db
        .select()
        .from(sessions)
        .orderBy(asc(sessions.episodeId), asc(sessions.sessionNumber), asc(sessions.id)),
      this.db
        .select({
          sessionId: sessionPlayerRecaps.sessionId,
          username: users.username,
          journal: sessionPlayerRecaps.journal,
          highlight: sessionPlayerRecaps.highlight,
          surprise: sessionPlayerRecaps.surprise,
          mvp: sessionPlayerRecaps.mvp,
        })
        .from(sessionPlayerRecaps)
        .leftJoin(users, eq(sessionPlayerRecaps.userId, users.id))
        .orderBy(asc(sessionPlayerRecaps.sessionId), asc(sessionPlayerRecaps.id)),
    ]);

    if (allEpisodes.length === 0) {
      return {
        filename: "Jaksot.md",
        markdown: "# Jaksot\n\nEi jaksoja tietokannassa.\n",
      };
    }

    const skillsByEpisode = new Map<number, string[]>();
    for (const skill of allSkills) {
      const list = skillsByEpisode.get(skill.episodeId) ?? [];
      list.push(cleanText(skill.name));
      skillsByEpisode.set(skill.episodeId, list);
    }

    const playersByEpisode = new Map<number, string[]>();
    for (const player of allPlayers) {
      if (!player.username) continue;
      const list = playersByEpisode.get(player.episodeId) ?? [];
      list.push(cleanText(player.username));
      playersByEpisode.set(player.episodeId, list);
    }

    const sessionsByEpisode = new Map<number, (typeof allSessions)[number][]>();
    for (const session of allSessions) {
      const list = sessionsByEpisode.get(session.episodeId) ?? [];
      list.push(session);
      sessionsByEpisode.set(session.episodeId, list);
    }

    const recapsBySession = new Map<number, (typeof allPlayerRecaps)[number][]>();
    for (const recap of allPlayerRecaps) {
      const list = recapsBySession.get(recap.sessionId) ?? [];
      list.push(recap);
      recapsBySession.set(recap.sessionId, list);
    }

    const sections: string[] = ["# Jaksot"];

    for (const episode of allEpisodes) {
      const epLines: string[] = [];
      const orderNum = `#${String(episode.order).padStart(2, "0")}`;
      epLines.push(`## ${cleanText(episode.title)}`);
      epLines.push(
        `- **Järjestys:** ${orderNum} | **Tila:** ${formatEpisodeStatusFi(episode.status)}`,
      );

      if (episode.description?.trim()) {
        epLines.push("");
        epLines.push(`**${cleanText(episode.description)}**`);
      }

      const rolls = Array.isArray(episode.tyrannyRolls) ? episode.tyrannyRolls : [];
      if (rolls.length === 1) {
        epLines.push("");
        epLines.push(`**Heitto ${rolls[0]}**`);
      } else if (rolls.length > 1) {
        epLines.push("");
        epLines.push(`**Heitot ${rolls.join(", ")}**`);
      }

      const cleanedContent = episode.content?.trim() ? cleanText(episode.content) : "";
      if (cleanedContent) {
        epLines.push("");
        epLines.push(cleanedContent);
      }

      const epSkills = skillsByEpisode.get(episode.id) ?? [];
      if (epSkills.length > 0) {
        const lowerContent = cleanedContent.toLowerCase();
        const hasMissingSkill = epSkills.some((name) => !lowerContent.includes(name.toLowerCase()));
        if (hasMissingSkill) {
          epLines.push("");
          epLines.push("### Jaksotaidot");
          epLines.push("");
          for (const skillName of epSkills) {
            epLines.push(`* ${skillName}`);
          }
        }
      }

      const epPlayers = playersByEpisode.get(episode.id) ?? [];
      const epSessions = sessionsByEpisode.get(episode.id) ?? [];
      const hasInfo =
        epPlayers.length > 0 ||
        Boolean(episode.players?.trim()) ||
        epSessions.length > 0 ||
        Boolean(episode.sessionDates?.trim()) ||
        Boolean(episode.location?.trim());

      if (hasInfo) {
        epLines.push("");
        epLines.push("### Tiedot");

        if (epPlayers.length > 0) {
          epLines.push("");
          epLines.push("#### Pelaajat");
          epLines.push("");
          for (const username of epPlayers) {
            epLines.push(`* ${username}`);
          }
        } else if (episode.players?.trim()) {
          epLines.push("");
          epLines.push("#### Pelaajat");
          epLines.push("");
          epLines.push(cleanText(episode.players));
        }

        if (epSessions.length > 0) {
          epLines.push("");
          epLines.push("#### Sessiot");
          epLines.push("");
          for (const s of epSessions) {
            const shortDate = formatDateFi(s.date, false);
            const label = s.label?.trim() ? ` ${cleanText(s.label)}` : "";
            const datePart = shortDate ? ` (${shortDate})` : "";
            epLines.push(
              `* #${String(s.sessionNumber).padStart(2, "0")}${label}${datePart} — ${formatSessionStatusFi(s.status)}`,
            );
          }
        } else if (episode.sessionDates?.trim()) {
          epLines.push("");
          epLines.push("#### Sessiot");
          epLines.push("");
          epLines.push(cleanText(episode.sessionDates));
        }

        if (episode.location?.trim()) {
          epLines.push("");
          epLines.push("#### Sijainti");
          epLines.push("");
          const locName = cleanText(episode.location);
          const locLink = episode.locationLink?.trim();
          epLines.push(locLink ? `[${locName}](${locLink})` : locName);
        }
      }

      if (episode.mechanicalAdditions?.trim()) {
        epLines.push("");
        epLines.push("### Mekaaniset Lisäykset");
        epLines.push("");
        epLines.push(cleanText(episode.mechanicalAdditions));
      }

      if (episode.summary?.trim()) {
        epLines.push("");
        epLines.push("### Jakson yhteenveto");
        epLines.push("");
        epLines.push(cleanText(episode.summary));
      }

      for (const s of epSessions) {
        const sessionLabel = `Sessio #${String(s.sessionNumber).padStart(2, "0")}${
          s.label?.trim() ? ` — ${cleanText(s.label)}` : ""
        }`;
        const longDate = formatDateFi(s.date, true);
        const draftNotice =
          s.status === "played" && !s.recapPublished ? " *(Luonnos — julkaisematta)*" : "";

        epLines.push("");
        epLines.push(`### ${sessionLabel}`);
        epLines.push("");
        epLines.push(
          `**${formatSessionStatusFi(s.status)}**${longDate ? ` — ${longDate}` : ""}${draftNotice}`,
        );

        if (s.gmRecap?.trim()) {
          epLines.push("");
          epLines.push("#### Pelinjohtajan kertaus");
          epLines.push("");
          epLines.push(cleanText(s.gmRecap));
        }

        const recaps = recapsBySession.get(s.id) ?? [];
        if (recaps.length > 0 || s.status === "played") {
          epLines.push("");
          epLines.push("#### Pelaajien kertaukset");
          if (recaps.length === 0) {
            epLines.push("");
            epLines.push("Pelaajat eivät ole vielä kirjoittaneet kertauksia.");
          } else {
            for (const recap of recaps) {
              epLines.push("");
              epLines.push(`##### ${recap.username?.trim() || "Tuntematon pelaaja"}`);
              const fields: Array<[string, string | null | undefined]> = [
                ["Hahmon näkökulmasta muistiinpanoja", recap.journal],
                ["Mitä jäi mieleen?", recap.highlight],
                ["Meta-pohdintaa / muistiinpanoja", recap.surprise],
                ["Kehu kaveria", recap.mvp],
              ];
              const nonEmpty = fields.filter(([, value]) => Boolean(value?.trim()));
              if (nonEmpty.length === 0) {
                epLines.push("");
                epLines.push("*Tyhjä kertaus.*");
              } else {
                for (const [label, value] of nonEmpty) {
                  if (!value) continue;
                  epLines.push("");
                  epLines.push(`**${label}:**`);
                  epLines.push(cleanText(value));
                }
              }
            }
          }
        }
      }

      sections.push(epLines.join("\n"));
    }

    return {
      filename: "Jaksot.md",
      markdown: `${sections.join("\n\n---\n\n")}\n`,
    };
  }
}
