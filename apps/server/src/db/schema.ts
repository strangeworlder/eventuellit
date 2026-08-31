import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  role: text("role").default("player").notNull(), // player or gm
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const magicLinkTokens = pgTable("magic_link_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: uuid("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  order: integer("order").default(99).notNull(),
  status: text("status").default("planned").notNull(), // active, completed, planned
  description: text("description"),
  content: text("content"), // Main body (markdown)
  location: text("location"),
  locationLink: text("location_link"),
  image: text("image"),
  imageAlt: text("image_alt"),
  theme: text("theme"),
  mediaId: integer("media_id").references(() => media.id),
  mechanicalAdditions: text("mechanical_additions"), // Markdown content
  summary: text("summary"),
  tyrannyRoll: integer("tyranny_roll"), // d12 result (1–12), episode-level
  gmId: integer("gm_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(), // R2 object key, e.g. "episodes/jakso-1.png"
  filename: text("filename").notNull(), // original upload filename
  alt: text("alt").default("").notNull(), // alt text
  mimeType: text("mime_type").notNull(), // "image/png", "image/jpeg", etc.
  sizeBytes: integer("size_bytes").notNull(),
  width: integer("width"),
  height: integer("height"),
  context: text("context").default("general").notNull(), // "episodes", "ruleset", "world", "general"
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const episodeSkills = pgTable("episode_skills", {
  id: serial("id").primaryKey(),
  episodeId: integer("episode_id")
    .references(() => episodes.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  archetype: text("archetype").notNull().default("soldier"),
  sex: text("sex"), // male, female, non-binary, none
  motivation: text("motivation"),
  notes: text("notes"),
  nicknames: jsonb("nicknames").default([]).notNull(), // string[]
  keho: integer("keho").default(8).notNull(),
  currentKeho: integer("current_keho").default(8).notNull(),
  mieli: integer("mieli").default(8).notNull(),
  currentMieli: integer("current_mieli").default(8).notNull(),
  tera: integer("tera").default(8).notNull(),
  currentTera: integer("current_tera").default(8).notNull(),
  sisuDice: jsonb("sisu_dice").default([]).notNull(), // Array<{ id: string, faces: number }>
  removedSisuIds: jsonb("removed_sisu_ids").default([]).notNull(), // string[]
  harmit: jsonb("harmit").default([]).notNull(),
  skills: jsonb("skills").default([]).notNull(),
  inventory: jsonb("inventory").default([]).notNull(),
  // Packed base-3 encoding for dice tiers [n4, n6, n8, n10, n12] (0-2 each). Max value 242.
  fysiikka: integer("fysiikka").default(0).notNull(),
  nopeus: integer("nopeus").default(0).notNull(),
  ymmarrys: integer("ymmarrys").default(0).notNull(),
  persoona: integer("persoona").default(0).notNull(),
  nakemys: integer("nakemys").default(0).notNull(),
  napparyys: integer("napparyys").default(0).notNull(),
  removedFromPlayAt: timestamp("removed_from_play_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const characterEpisodes = pgTable(
  "character_episodes",
  {
    id: serial("id").primaryKey(),
    characterId: integer("character_id")
      .references(() => characters.id, { onDelete: "cascade" })
      .notNull(),
    episodeId: integer("episode_id")
      .references(() => episodes.id, { onDelete: "cascade" })
      .notNull(),
    refreshedAt: timestamp("refreshed_at"),
    advancedAt: timestamp("advanced_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    charEpisodeUniq: uniqueIndex("character_episodes_char_episode_uniq").on(
      t.characterId,
      t.episodeId,
    ),
  }),
);

export const characterArcSnapshots = pgTable("character_arc_snapshots", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id")
    .references(() => characters.id, { onDelete: "cascade" })
    .notNull(),
  episodeId: integer("episode_id")
    .references(() => episodes.id, { onDelete: "cascade" })
    .notNull(),
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
  reason: text("reason").default("advancement").notNull(),
  sheetJson: jsonb("sheet_json").notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    episodeId: integer("episode_id")
      .references(() => episodes.id, { onDelete: "cascade" })
      .notNull(),
    sessionNumber: integer("session_number").notNull(),
    date: timestamp("date"),
    status: text("status").default("planned").notNull(), // planned | next | played
    label: text("label"),
    gmRecap: text("gm_recap"),
    recapPublished: boolean("recap_published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    episodeStatusIdx: index("sessions_episode_status_idx").on(t.episodeId, t.status),
  }),
);

export const sessionPlayerRecaps = pgTable(
  "session_player_recaps",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id")
      .references(() => sessions.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    journal: text("journal"),
    highlight: text("highlight"),
    surprise: text("surprise"),
    mvp: text("mvp"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    sessionUserUniq: uniqueIndex("session_player_recaps_session_user_uniq").on(
      t.sessionId,
      t.userId,
    ),
  }),
);

export const episodeReadingItems = pgTable("episode_reading_items", {
  id: serial("id").primaryKey(),
  episodeId: integer("episode_id")
    .references(() => episodes.id, { onDelete: "cascade" })
    .notNull(),
  sessionId: integer("session_id").references(() => sessions.id, { onDelete: "cascade" }),
  contentType: text("content_type").notNull(), // 'world' | 'ruleset' | 'custom' | 'task'
  contentRef: text("content_ref"), // e.g. 'ekklesia', 'mekaniikat'
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"), // relative link, e.g. '/world/ekklesia'
  orderIndex: integer("order_index").default(0).notNull(),
  autoSuggested: boolean("auto_suggested").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const episodePlayers = pgTable(
  "episode_players",
  {
    id: serial("id").primaryKey(),
    episodeId: integer("episode_id")
      .references(() => episodes.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    episodeUserUniq: uniqueIndex("episode_players_episode_user_uniq").on(
      t.episodeId,
      t.userId,
    ),
  }),
);

export const playerReadingProgress = pgTable(
  "player_reading_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    readingItemId: integer("reading_item_id")
      .references(() => episodeReadingItems.id, { onDelete: "cascade" })
      .notNull(),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (t) => ({
    userItemUniq: uniqueIndex("player_reading_progress_user_item_uniq").on(
      t.userId,
      t.readingItemId,
    ),
  }),
);

export const playerNotifications = pgTable(
  "player_notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    type: text("type").notNull(), // e.g. "update_names"
    referenceId: text("reference_id"), // e.g. character ID — text for flexibility
    message: text("message"),
    dismissedAt: timestamp("dismissed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userDismissedIdx: index("player_notifications_user_dismissed_idx").on(
      t.userId,
      t.dismissedAt,
    ),
  }),
);

export const episodeInvites = pgTable("episode_invites", {
  id: serial("id").primaryKey(),
  episodeId: integer("episode_id")
    .references(() => episodes.id, { onDelete: "cascade" })
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").default("pending").notNull(), // pending | accepted | declined
  invitedBy: integer("invited_by")
    .references(() => users.id)
    .notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
});

// ─── Mission Voting ────────────────────────────────────────────────────────────

/** A single voting round, created by the GM. Not tied to an episode — the vote decides what the next episode will be. */
export const votingRounds = pgTable("voting_rounds", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g. "Valitse seuraava operaatio"
  status: text("status").default("open").notNull(), // open | closed
  deadline: timestamp("deadline"), // optional GM-set deadline
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Individual mission option within a voting round, created by the GM. */
export const missionOptions = pgTable("mission_options", {
  id: serial("id").primaryKey(),
  roundId: integer("round_id")
    .references(() => votingRounds.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"), // optional R2 image URL
  urgency: text("urgency").default("normaali").notNull(), // kriittinen | normaali | joustava
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * One row per player per round. Stores both primary (3 pts) and secondary (1 pt) choices.
 * Upserting this row changes the player's vote.
 */
export const missionVotes = pgTable(
  "mission_votes",
  {
    id: serial("id").primaryKey(),
    roundId: integer("round_id")
      .references(() => votingRounds.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    primaryOptionId: integer("primary_option_id")
      .references(() => missionOptions.id, { onDelete: "cascade" })
      .notNull(),
    secondaryOptionId: integer("secondary_option_id")
      .references(() => missionOptions.id, { onDelete: "cascade" }),
    votedAt: timestamp("voted_at").defaultNow().notNull(),
  },
  (t) => ({
    roundUserUniq: uniqueIndex("mission_votes_round_user_uniq").on(t.roundId, t.userId),
  }),
);

/** Flat comment on a specific mission option. Commenter chooses anonymous or named. */
export const missionComments = pgTable("mission_comments", {
  id: serial("id").primaryKey(),
  optionId: integer("option_id")
    .references(() => missionOptions.id, { onDelete: "cascade" })
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  anonymous: boolean("anonymous").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

