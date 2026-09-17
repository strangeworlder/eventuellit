import { Test, type TestingModule } from "@nestjs/testing";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
import { EpisodePlayersService } from "../episode-players/episode-players.service";
import { SessionRecapsService } from "./session-recaps.service";

describe("SessionRecapsService", () => {
  let service: SessionRecapsService;
  let mockDb: any;
  let mockEpisodePlayersService: any;

  const mockSessionRow = {
    id: 1,
    episodeId: 10,
    sessionNumber: 1,
    status: "played",
    recapPublished: true,
  };

  const mockRecaps = [
    {
      id: 101,
      sessionId: 1,
      userId: 5,
      username: "Alice",
      journal: "Great game",
      highlight: "Dragon fight",
      surprise: "Plot twist",
      mvp: "Bob",
    },
  ];

  beforeEach(async () => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockImplementation(() => {
        return mockRecaps;
      }),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    };

    // For getSessionOrThrow (first query in findBySession)
    mockDb.from.mockImplementation((table: any) => {
      return {
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockImplementation(() => {
          // If querying sessions
          return [mockSessionRow];
        }),
      };
    });

    mockEpisodePlayersService = {
      hasAnyEnrollments: vi.fn().mockResolvedValue(true),
      isEnrolled: vi.fn().mockResolvedValue(false),
      assertEnrolled: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionRecapsService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
        {
          provide: EpisodePlayersService,
          useValue: mockEpisodePlayersService,
        },
      ],
    }).compile();

    service = module.get<SessionRecapsService>(SessionRecapsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findBySession read permissions", () => {
    it("returns published recaps for unauthenticated viewer", async () => {
      mockSessionRow.recapPublished = true;
      const result = await service.findBySession(1, null);
      expect(result).toBeDefined();
      expect(mockEpisodePlayersService.assertEnrolled).not.toHaveBeenCalled();
    });

    it("returns published recaps for logged-in user who is NOT enrolled", async () => {
      mockSessionRow.recapPublished = true;
      mockEpisodePlayersService.hasAnyEnrollments.mockResolvedValue(true);
      mockEpisodePlayersService.isEnrolled.mockResolvedValue(false);

      const result = await service.findBySession(1, { id: 99, role: "player" });
      expect(result).toBeDefined();
      // assertEnrolled must not be called (read permission granted like unauthenticated user)
      expect(mockEpisodePlayersService.assertEnrolled).not.toHaveBeenCalled();
    });

    it("returns empty array for non-enrolled player when recap is unpublished (same as anonymous)", async () => {
      mockSessionRow.recapPublished = false;
      mockEpisodePlayersService.hasAnyEnrollments.mockResolvedValue(true);
      mockEpisodePlayersService.isEnrolled.mockResolvedValue(false);

      const result = await service.findBySession(1, { id: 99, role: "player" });
      expect(result).toEqual([]);
    });

    it("returns empty array for anonymous viewer when recap is unpublished", async () => {
      mockSessionRow.recapPublished = false;

      const result = await service.findBySession(1, null);
      expect(result).toEqual([]);
    });
  });
});
