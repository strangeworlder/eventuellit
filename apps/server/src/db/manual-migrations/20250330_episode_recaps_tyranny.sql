-- Incremental migration for existing databases (use `npm run db:push` for local dev).
ALTER TABLE "episodes" ADD COLUMN IF NOT EXISTS "tyranny_roll" integer;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "gm_recap" text;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "recap_published" boolean DEFAULT false NOT NULL;

CREATE TABLE IF NOT EXISTS "session_player_recaps" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"journal" text,
	"highlight" text,
	"surprise" text,
	"mvp" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "session_player_recaps_session_user_uniq" ON "session_player_recaps" ("session_id","user_id");

DO $$ BEGIN
 ALTER TABLE "session_player_recaps" ADD CONSTRAINT "session_player_recaps_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "session_player_recaps" ADD CONSTRAINT "session_player_recaps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
