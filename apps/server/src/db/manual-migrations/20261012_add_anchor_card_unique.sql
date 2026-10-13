-- Add anchor_card_id to users and characters
ALTER TABLE users ADD COLUMN IF NOT EXISTS anchor_card_id text;
CREATE UNIQUE INDEX IF NOT EXISTS users_anchor_card_id_unique ON users (anchor_card_id);

ALTER TABLE characters ADD COLUMN IF NOT EXISTS anchor_card_id text;
CREATE INDEX IF NOT EXISTS characters_anchor_card_id_idx ON characters (anchor_card_id);
