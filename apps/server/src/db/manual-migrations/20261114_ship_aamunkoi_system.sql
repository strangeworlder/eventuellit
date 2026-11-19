-- Aamunkoi-tukikohta-aluksen, hyttien, erikoisten omistusten sekä 5n20-väliaikajärjestelmän taulut

CREATE TABLE IF NOT EXISTS ship_config (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Aamunkoi',
  callsign TEXT NOT NULL DEFAULT 'RUNKO-150M',
  theme TEXT NOT NULL DEFAULT 'base',
  status_banner TEXT NOT NULL DEFAULT 'Kiertoradalla - navigointikilvet vajaateholla',
  hull_notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ship_rooms (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  deck_number INTEGER NOT NULL,
  kind TEXT NOT NULL,
  svg_zone_id TEXT NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  status_label TEXT NOT NULL DEFAULT 'Toiminnassa',
  status_tone TEXT NOT NULL DEFAULT 'normal',
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  claimed_by_character_id INTEGER UNIQUE REFERENCES characters(id) ON DELETE SET NULL,
  cabin_custom_title TEXT,
  cabin_decoration TEXT,
  gm_room_notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cabin_possessions (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  gm_mechanical_notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ship_clocks (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  scope TEXT NOT NULL,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  room_key TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  segments_total INTEGER,
  segments_filled INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  completion_notes TEXT,
  created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ship_downtime_turns (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  source_completed_episode_id INTEGER NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  locked_episode_id INTEGER REFERENCES episodes(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  draft_allocation_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  resolution_json JSONB,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ship_downtime_turns_char_source_ep_uniq
  ON ship_downtime_turns (character_id, source_completed_episode_id);
