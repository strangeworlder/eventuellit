-- Hahmojen munkki-tatuoinnit (kiinteät numeroidut paikat 1..monk_advancements_allowed)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS tattoos JSONB NOT NULL DEFAULT '[]'::jsonb;
