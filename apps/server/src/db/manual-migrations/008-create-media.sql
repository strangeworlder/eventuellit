-- 008: Create media table for R2 asset tracking
CREATE TABLE IF NOT EXISTS media (
  id            SERIAL PRIMARY KEY,
  key           TEXT UNIQUE NOT NULL,
  filename      TEXT NOT NULL,
  alt           TEXT NOT NULL DEFAULT '',
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  width         INTEGER,
  height        INTEGER,
  context       TEXT NOT NULL DEFAULT 'general',
  uploaded_by   INTEGER REFERENCES users(id),
  created_at    TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add optional media FK to episodes
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS media_id INTEGER REFERENCES media(id);
