-- Add anchor_id to users and characters (or rename from anchor_card_id if previously migrated)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'anchor_card_id') THEN
    ALTER TABLE users RENAME COLUMN anchor_card_id TO anchor_id;
  ELSE
    ALTER TABLE users ADD COLUMN IF NOT EXISTS anchor_id text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'characters' AND column_name = 'anchor_card_id') THEN
    ALTER TABLE characters RENAME COLUMN anchor_card_id TO anchor_id;
  ELSE
    ALTER TABLE characters ADD COLUMN IF NOT EXISTS anchor_id text;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS users_anchor_id_unique ON users (anchor_id);
CREATE INDEX IF NOT EXISTS characters_anchor_id_idx ON characters (anchor_id);
