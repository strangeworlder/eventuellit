import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    discordId: text("discord_id").unique().notNull(), // As per PRD (Login via Discord)
    username: text("username").notNull(),
    avatarUrl: text("avatar_url"),
    role: text("role").default("player").notNull(), // player or gm
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const characters = pgTable("characters", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }), // Nullable for now while we build without auth
    name: text("name").notNull(),
    archetype: text("archetype").notNull().default("soldier"),
    keho: integer("keho").default(8).notNull(),
    currentKeho: integer("current_keho").default(8).notNull(),
    mieli: integer("mieli").default(8).notNull(),
    currentMieli: integer("current_mieli").default(8).notNull(),
    tera: integer("tera").default(8).notNull(),
    currentTera: integer("current_tera").default(8).notNull(),
    sisuDie: text("sisu_die").notNull().default("d6"),
    sisuCount: integer("sisu_count").notNull().default(3),
    currentSisuCount: integer("current_sisu_count").notNull().default(3),
    vaurio: integer("vaurio").notNull().default(0),
    skills: jsonb("skills").default([]).notNull(),
    inventory: jsonb("inventory").default([]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const episodes = pgTable("episodes", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    summary: text("summary"),
    gmId: integer("gm_id").references(() => users.id).notNull(),
    datePlayed: timestamp("date_played").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
