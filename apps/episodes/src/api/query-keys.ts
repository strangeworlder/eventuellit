export const queryKeys = {
  episodes: {
    all: ["episodes"] as const,
    list: (status?: string) => ["episodes", "list", status] as const,
    detail: (id: number) => ["episodes", "detail", id] as const,
    skills: (episodeId: number) => ["episodes", "skills", episodeId] as const,
    players: (episodeId: number) => ["episodes", "players", episodeId] as const,
    invites: (episodeId: number) => ["episodes", "invites", episodeId] as const,
    progress: (episodeId: number) => ["episodes", "progress", episodeId] as const,
  },
  sessions: {
    all: ["sessions"] as const,
    list: (episodeId: number) => ["sessions", "list", episodeId] as const,
    recaps: (sessionId: number) => ["sessions", "recaps", sessionId] as const,
  },
  reading: {
    items: (episodeId: number, sessionId?: number) =>
      ["reading", "items", episodeId, sessionId] as const,
    suggestions: (episodeId: number, sessionId?: number) =>
      ["reading", "suggestions", episodeId, sessionId] as const,
  },
  media: {
    all: ["media"] as const,
    list: (context?: string) => ["media", "list", context] as const,
  },
  users: {
    players: ["users", "players"] as const,
  },
} as const;
