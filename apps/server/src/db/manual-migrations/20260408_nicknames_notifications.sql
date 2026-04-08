-- Character nicknames
ALTER TABLE "characters" ADD COLUMN IF NOT EXISTS "nicknames" jsonb DEFAULT '[]' NOT NULL;

-- Player notifications
CREATE TABLE IF NOT EXISTS "player_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"reference_id" text,
	"message" text,
	"dismissed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "player_notifications" ADD CONSTRAINT "player_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
