import { integer, jsonb, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
  players: text("players"), // Comma-separated player names
  sessionDates: text("session_dates"), // Comma-separated dates
  location: text("location"),
  locationLink: text("location_link"),
  image: text("image"),
  imageAlt: text("image_alt"),
  mechanicalAdditions: text("mechanical_additions"), // Markdown content
  summary: text("summary"),
  gmId: integer("gm_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  episodeId: integer("episode_id").references(() => episodes.id),
  name: text("name").notNull(),
  archetype: text("archetype").notNull().default("soldier"),
  sex: text("sex"), // male, female, non-binary, none
  motivation: text("motivation"),
  notes: text("notes"),
  keho: integer("keho").default(8).notNull(),
  currentKeho: integer("current_keho").default(8).notNull(),
  mieli: integer("mieli").default(8).notNull(),
  currentMieli: integer("current_mieli").default(8).notNull(),
  tera: integer("tera").default(8).notNull(),
  currentTera: integer("current_tera").default(8).notNull(),
  sisuDie: text("sisu_die").notNull().default("n6"),
  sisuCount: integer("sisu_count").notNull().default(3),
  currentSisuCount: integer("current_sisu_count").notNull().default(3),
  vaurio: integer("vaurio").notNull().default(0),
  skills: jsonb("skills").default([]).notNull(),
  inventory: jsonb("inventory").default([]).notNull(),
  fysiikka: integer("fysiikka").default(0).notNull(),
  nopeus: integer("nopeus").default(0).notNull(),
  ymmarrys: integer("ymmarrys").default(0).notNull(),
  persoona: integer("persoona").default(0).notNull(),
  nakemys: integer("nakemys").default(0).notNull(),
  napparyys: integer("napparyys").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const characterEpisodes = pgTable("character_episodes", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id")
    .references(() => characters.id, { onDelete: "cascade" })
    .notNull(),
  episodeId: integer("episode_id")
    .references(() => episodes.id, { onDelete: "cascade" })
    .notNull(),
});
