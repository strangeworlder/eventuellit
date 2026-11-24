import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { vi } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
import { UpdateEpisodeDto } from "./dto/update-episode.dto";
import { EpisodesService } from "./episodes.service";

type MockDb = {
  query: Record<string, Record<string, ReturnType<typeof vi.fn>>>;
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  leftJoin: ReturnType<typeof vi.fn>;
  innerJoin: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("EpisodesService", () => {
  let service: EpisodesService;
  let mockDb: MockDb;

  beforeEach(async () => {
    mockDb = {
      query: {
        episodes: {
          findFirst: vi.fn(),
        },
      },
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpisodesService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<EpisodesService>(EpisodesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should list all episodes", async () => {
    mockDb.orderBy.mockResolvedValueOnce([]);
    const result = await service.findAll();
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should list episodes filtered by status", async () => {
    mockDb.orderBy.mockResolvedValueOnce([]);
    const result = await service.findAll("active");
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should find one episode", async () => {
    const episode = { id: 1, title: "Test", slug: "test" };
    mockDb.where.mockResolvedValueOnce([episode]);
    const result = await service.findOne(1);
    expect(result).toEqual(episode);
  });

  it("should throw NotFoundException for missing episode", async () => {
    mockDb.where.mockResolvedValueOnce([]);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it("should create an episode", async () => {
    const episodeData = { id: 1, title: "New Episode", slug: "new-ep" };
    mockDb.returning.mockResolvedValueOnce([episodeData]);

    const result = await service.create({ slug: "new-ep", title: "New Episode" }, 1);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual(episodeData);
  });

  it("should update an episode", async () => {
    const episode = { id: 1, title: "Old Title", slug: "test" };
    // findOne call
    mockDb.where.mockResolvedValueOnce([episode]);
    // update call
    mockDb.returning.mockResolvedValueOnce([{ ...episode, title: "New Title" }]);

    const result = await service.update(1, { title: "New Title" });
    expect(result).toEqual({ ...episode, title: "New Title" });
  });

  it("should throw when updating non-existent episode", async () => {
    mockDb.where.mockResolvedValueOnce([]);
    await expect(service.update(999, { title: "X" })).rejects.toThrow(NotFoundException);
  });

  it("should delete an episode", async () => {
    const episode = { id: 1, title: "Test", slug: "test" };
    mockDb.where
      .mockResolvedValueOnce([episode]) // findOne
      .mockResolvedValueOnce(undefined); // delete
    await expect(service.remove(1)).resolves.not.toThrow();
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it("should find skills for an episode", async () => {
    const episode = { id: 1, title: "Test", slug: "test" };
    mockDb.where
      .mockResolvedValueOnce([episode]) // findOne
      .mockResolvedValueOnce([{ id: 1, name: "Pilotti" }]); // skills query
    const result = await service.findSkills(1);
    expect(result).toEqual([{ id: 1, name: "Pilotti" }]);
  });

  it("should add a skill to an episode", async () => {
    const episode = { id: 1, title: "Test", slug: "test" };
    mockDb.where.mockResolvedValueOnce([episode]);
    mockDb.returning.mockResolvedValueOnce([{ id: 1, episodeId: 1, name: "Murtovaras" }]);

    const result = await service.addSkill(1, { name: "Murtovaras" });
    expect(result).toEqual({ id: 1, episodeId: 1, name: "Murtovaras" });
  });

  it("should remove a skill from an episode", async () => {
    const episode = { id: 1, title: "Test", slug: "test" };
    const skill = { id: 5, episodeId: 1, name: "Lääkäri" };
    mockDb.where
      .mockResolvedValueOnce([episode]) // findOne episode
      .mockResolvedValueOnce([skill]) // find skill
      .mockResolvedValueOnce(undefined); // delete

    await expect(service.removeSkill(1, 5)).resolves.not.toThrow();
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it("should throw when removing skill from wrong episode", async () => {
    const episode = { id: 1, title: "Test", slug: "test" };
    const skill = { id: 5, episodeId: 2, name: "Lääkäri" }; // different episodeId
    mockDb.where.mockResolvedValueOnce([episode]).mockResolvedValueOnce([skill]);

    await expect(service.removeSkill(1, 5)).rejects.toThrow(NotFoundException);
  });

  describe("exportMarkdown", () => {
    it("should return empty placeholder when no episodes exist", async () => {
      mockDb.orderBy
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.exportMarkdown();
      expect(result.filename).toBe("Jaksot.md");
      expect(result.markdown).toBe("# Jaksot\n\nEi jaksoja tietokannassa.\n");
    });

    it("should export episodes with skills, players, summaries, and unpublished recaps without soft hyphens", async () => {
      mockDb.orderBy
        .mockResolvedValueOnce([
          {
            id: 1,
            slug: "ohjainlevy",
            title: "Oh\u00ADjain\u00ADle\u00ADvy",
            order: 1,
            status: "completed",
            description: "Keikka Kilven asemalla.",
            content: "### Premissi\n\nRyöstäkää oh\u00ADjain\u00ADle\u00ADvy.",
            location: "Kilpi",
            locationLink: "/world/09-kilpi",
            players: null,
            sessionDates: null,
            mechanicalAdditions: "### Aseet\n\nVahinko **1n8**.",
            summary: "Kolmikko pakeni Aamunkoilla.",
            tyrannyRolls: ["2"],
          },
        ])
        .mockResolvedValueOnce([
          { id: 10, episodeId: 1, name: "Hylkyjen tutkija" },
          { id: 11, episodeId: 1, name: "Byrokraatti" },
        ])
        .mockResolvedValueOnce([
          { episodeId: 1, username: "Pekka" },
          { episodeId: 1, username: "Taija" },
        ])
        .mockResolvedValueOnce([
          {
            id: 100,
            episodeId: 1,
            sessionNumber: 1,
            date: new Date("2026-03-26T18:00:00Z"),
            status: "played",
            label: "Pelastus",
            gmRecap: "Vankikuljetus pysäytettiin huoltoaukiolla.",
            recapPublished: false,
          },
        ])
        .mockResolvedValueOnce([
          {
            sessionId: 100,
            username: "Pekka",
            journal: "Syy sai vaurioita.",
            highlight: "Purppura välähdys",
            surprise: null,
            mvp: "Taija",
          },
        ]);

      const result = await service.exportMarkdown();

      expect(result.filename).toBe("Jaksot.md");
      expect(result.markdown).not.toContain("\u00AD");
      expect(result.markdown).toContain("## Ohjainlevy");
      expect(result.markdown).toContain("- **Järjestys:** #01 | **Tila:** Arkistoitu");
      expect(result.markdown).toContain("**Heitto 2**");
      expect(result.markdown).toContain("### Jaksotaidot");
      expect(result.markdown).toContain("* Hylkyjen tutkija");
      expect(result.markdown).toContain("* Pekka");
      expect(result.markdown).toContain("[Kilpi](/world/09-kilpi)");
      expect(result.markdown).toContain("### Mekaaniset Lisäykset");
      expect(result.markdown).toContain("### Jakson yhteenveto");
      expect(result.markdown).toContain("### Sessio #01 — Pelastus");
      expect(result.markdown).toContain("*(Luonnos — julkaisematta)*");
      expect(result.markdown).toContain("Vankikuljetus pysäytettiin huoltoaukiolla.");
      expect(result.markdown).toContain("##### Pekka");
      expect(result.markdown).toContain("**Kehu kaveria:**\nTaija");
    });

    it("should format multiple and letter tyranny rolls in markdown export", async () => {
      mockDb.orderBy
        .mockResolvedValueOnce([
          {
            id: 2,
            slug: "kaksoisheittajakso",
            title: "Kaksoisheitto",
            order: 2,
            status: "active",
            description: null,
            content: null,
            location: null,
            locationLink: null,
            players: null,
            sessionDates: null,
            mechanicalAdditions: null,
            summary: null,
            tyrannyRolls: ["4", "K", "11"],
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.exportMarkdown();

      expect(result.markdown).toContain("**Heitot 4, K, 11**");
    });
  });

  describe("tyrannyRolls validation and normalization", () => {
    it("should normalize tyrannyRolls to uppercase on update", async () => {
      const episode = { id: 1, title: "Test", slug: "test", tyrannyRolls: [] };
      mockDb.where.mockResolvedValueOnce([episode]);
      mockDb.returning.mockResolvedValueOnce([{ ...episode, tyrannyRolls: ["4", "Ä", "12"] }]);

      await service.update(1, { tyrannyRolls: [" 4 ", "ä", "12"] });

      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({ tyrannyRolls: ["4", "Ä", "12"] }),
      );
    });

    it("should accept valid numbers 1-12, Finnish letters, and empty arrays in UpdateEpisodeDto", async () => {
      const dto = plainToInstance(UpdateEpisodeDto, {
        tyrannyRolls: [1, "12", "k", "ä", "ö", "å", "4"],
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto.tyrannyRolls).toEqual(["1", "12", "K", "Ä", "Ö", "Å", "4"]);

      const emptyDto = plainToInstance(UpdateEpisodeDto, { tyrannyRolls: [] });
      expect(await validate(emptyDto)).toHaveLength(0);
    });

    it("should reject out-of-range numbers, multi-letter strings, and symbols in UpdateEpisodeDto", async () => {
      for (const invalid of [["0"], ["13"], ["AB"], ["?"], ["1", "14"], ["01"]]) {
        const dto = plainToInstance(UpdateEpisodeDto, { tyrannyRolls: invalid });
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      }
    });
  });
});
