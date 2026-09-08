-- Voima-katalogi (GM:n hallinnoima)
CREATE TABLE IF NOT EXISTS monk_powers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 8),
  description TEXT,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hahmon valitut voimat (many-to-many)
CREATE TABLE IF NOT EXISTS character_monk_powers (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  power_id INTEGER NOT NULL REFERENCES monk_powers(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (character_id, power_id)
);

-- Hahmon munkki-kehityskertojen laskurit
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS monk_advancements_allowed INTEGER NOT NULL DEFAULT 0;

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS monk_advancements_used INTEGER NOT NULL DEFAULT 0;

-- Munkki-kehitys on jaksosta riippumaton, joten sallitaan episode_id:n olla tyhjä arc snapshotissa
ALTER TABLE character_arc_snapshots
ALTER COLUMN episode_id DROP NOT NULL;

