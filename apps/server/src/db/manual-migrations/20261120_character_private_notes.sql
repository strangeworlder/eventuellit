-- Pelaajahahmojen yksityiset muistiinpanot (omistajan muokattavissa, pelinjohtajalle lukuoikeus)

CREATE TABLE IF NOT EXISTS character_private_notes (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  episode_id INTEGER REFERENCES episodes(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS character_private_notes_char_pinned_idx
  ON character_private_notes (character_id, is_pinned);
