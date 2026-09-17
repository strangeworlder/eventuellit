import { Test, type TestingModule } from "@nestjs/testing";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
import { EpisodePlayersService } from "../episode-players/episode-players.service";
import { SessionsService } from "./sessions.service";

describe("SessionsService", () => {
  let service: SessionsService;
  let mockDb: any;
  let mockEpisodePlayersService: any;

  beforeEach(async () => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnValue([
        {
          id: 1,
          episodeId: 10,
          sessionNumber: 1,
          status: "played",
          recapPublished: true,
          gmRecap: "Published GM Recap",
        },
        {
          id: 2,
          episodeId: 10,
          sessionNumber: 2,
          status: "next",
          recapPublished: false,
          gmRecap: "Secret draft recap",
        },
      ]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    };

    mockEpisodePlayersService = {
      hasAnyEnrollments: vi.fn().mockResolvedValue(true),
      isEnrolled: vi.fn().mockResolvedValue(false),
      assertEnrolled: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
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

    service = module.get<SessionsService>(SessionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findByEpisode permissions", () => {
    it("returns sessions with published gmRecap and hides unpublished gmRecap for unauthenticated viewer", async () => {
      const result = await service.findByEpisode(10, null);

      expect(result).toHaveLength(2);
      expect(result[0].gmRecap).toBe("Published GM Recap");
      expect(result[0].canEditRecap).toBe(false);
      expect(result[0].isEnrolled).toBe(false);

      expect(result[1].gmRecap).toBeNull();
      expect(result[1].canEditRecap).toBe(false);
    });

    it("returns all gmRecaps and allows editing for GM", async () => {
      const result = await service.findByEpisode(10, { id: 99, role: "gm" });

      expect(result).toHaveLength(2);
      expect(result[0].gmRecap).toBe("Published GM Recap");
      expect(result[1].gmRecap).toBe("Secret draft recap");
      expect(result[0].isEnrolled).toBe(true);
    });

    it("gives non-enrolled logged-in user the same read access as unauthenticated viewer (canEditRecap: false)", async () => {
      mockEpisodePlayersService.hasAnyEnrollments.mockResolvedValue(true);
      mockEpisodePlayersService.isEnrolled.mockResolvedValue(false);

      const result = await service.findByEpisode(10, { id: 42, role: "player" });

      expect(result).toHaveLength(2);
      // Published recap is readable
      expect(result[0].gmRecap).toBe("Published GM Recap");
      // Unpublished recap is hidden
      expect(result[1].gmRecap).toBeNull();
      // Cannot edit player recap
      expect(result[0].canEditRecap).toBe(false);
      expect(result[0].isEnrolled).toBe(false);
    });

    it("allows enrolled player to edit recap", async () => {
      mockEpisodePlayersService.hasAnyEnrollments.mockResolvedValue(true);
      mockEpisodePlayersService.isEnrolled.mockResolvedValue(true);

      const result = await service.findByEpisode(10, { id: 42, role: "player" });

      expect(result).toHaveLength(2);
      expect(result[0].canEditRecap).toBe(true);
      expect(result[0].isEnrolled).toBe(true);
    });
  });
});
