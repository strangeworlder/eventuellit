-- Migration: Mission Voting System
-- Creates 4 tables: voting_rounds, mission_options, mission_votes, mission_comments

CREATE TABLE IF NOT EXISTS voting_rounds (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open', -- open | closed
  deadline    TIMESTAMPTZ,
  created_by  INTEGER NOT NULL REFERENCES users(id),
  closed_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mission_options (
  id          SERIAL PRIMARY KEY,
  round_id    INTEGER NOT NULL REFERENCES voting_rounds(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  image       TEXT,
  urgency     TEXT NOT NULL DEFAULT 'normaali', -- kriittinen | normaali | joustava
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mission_votes (
  id                  SERIAL PRIMARY KEY,
  round_id            INTEGER NOT NULL REFERENCES voting_rounds(id) ON DELETE CASCADE,
  user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  primary_option_id   INTEGER NOT NULL REFERENCES mission_options(id) ON DELETE CASCADE,
  secondary_option_id INTEGER REFERENCES mission_options(id) ON DELETE CASCADE,
  voted_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT mission_votes_round_user_uniq UNIQUE (round_id, user_id)
);

CREATE TABLE IF NOT EXISTS mission_comments (
  id         SERIAL PRIMARY KEY,
  option_id  INTEGER NOT NULL REFERENCES mission_options(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  anonymous  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
