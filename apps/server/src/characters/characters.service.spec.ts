import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
import { NotificationsService } from "../notifications/notifications.service";
import { CharactersService } from "./characters.service";

describe("CharactersService", () => {
  let service: CharactersService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      query: {
        characters: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
        episodes: {
          findFirst: vi.fn(),
        },
      },
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
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
        CharactersService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
        {
          provide: NotificationsService,
          useValue: { dismissByType: vi.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a character with userId from JWT", async () => {
    const characterData = { name: "Test Character", userId: 1, id: 1 };
    mockDb.returning.mockResolvedValueOnce([characterData]);

    const dto = {
      name: "Test Character",
      archetype: "Sotilas",
      episodeId: 1,
      keho: 8,
      mieli: 8,
      tera: 8,
      sisuDice: [
        { id: "sisu-0", faces: 8 },
        { id: "sisu-1", faces: 8 },
        { id: "sisu-2", faces: 8 },
      ],
      skills: [],
    };

    const result = await service.create(dto, 1);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual(characterData);
  });

  it("should find all characters with owner join and attach episodes", async () => {
    const charRow = { id: 1, userId: 2, name: "Hero", ownerName: "player1" };
    mockDb.leftJoin.mockResolvedValueOnce([charRow]);
    // linkRows query ends with .orderBy; playedRows query also ends with .orderBy
    mockDb.orderBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    const result = await service.findAll();
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual([{ ...charRow, episodes: [], hasPlayedSessions: false }]);
  });

  it("should set hasPlayedSessions=false for a debut character with no played sessions", async () => {
    const charRow = { id: 5, userId: 3, name: "Rookie", ownerName: "newplayer" };
    mockDb.leftJoin.mockResolvedValueOnce([charRow]);
    mockDb.orderBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]); // no played sessions
    const result = await service.findAll();
    expect(result[0].hasPlayedSessions).toBe(false);
  });

  it("should set hasPlayedSessions=true for a character with at least one played session", async () => {
    const charRow = { id: 7, userId: 4, name: "Veteran", ownerName: "veteran" };
    mockDb.leftJoin.mockResolvedValueOnce([charRow]);
    // linkRows empty, playedRows returns a match for characterId 7
    mockDb.orderBy.mockResolvedValueOnce([]).mockResolvedValueOnce([{ characterId: 7 }]);
    const result = await service.findAll();
    expect(result[0].hasPlayedSessions).toBe(true);
  });

  it("should allow owner to update their character", async () => {
    const character = { id: 1, userId: 42 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    const harmit = [{ text: "Palovamma", healed: false }];
    mockDb.returning.mockResolvedValueOnce([{ ...character, harmit }]);

    const result = await service.update(1, { harmit }, 42, "player");
    expect(result).toEqual({ ...character, harmit });
  });

  it("should allow gm to update any character", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    const harmit = [
      { text: "Murtuma", healed: false },
      { text: "Shokki", healed: true },
    ];
    mockDb.returning.mockResolvedValueOnce([{ ...character, harmit }]);

    const result = await service.update(1, { harmit }, 1, "gm");
    expect(result).toEqual({ ...character, harmit });
  });

  it("should throw ForbiddenException when non-owner player tries to update", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);

    await expect(
      service.update(1, { harmit: [{ text: "Haava", healed: false }] }, 1, "player"),
    ).rejects.toThrow(ForbiddenException);
  });

  it("should throw NotFoundException when updating non-existent character", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce(undefined);

    await expect(
      service.update(999, { harmit: [{ text: "Haava", healed: false }] }, 1, "player"),
    ).rejects.toThrow(NotFoundException);
  });

  it("should allow owner to delete their character", async () => {
    const character = { id: 1, userId: 42 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    mockDb.where.mockResolvedValueOnce(undefined);

    await expect(service.remove(1, 42, "player")).resolves.not.toThrow();
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it("should allow gm to delete any character", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    mockDb.where.mockResolvedValueOnce(undefined);

    await expect(service.remove(1, 1, "gm")).resolves.not.toThrow();
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it("should throw ForbiddenException when non-owner player tries to delete", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);

    await expect(service.remove(1, 1, "player")).rejects.toThrow(ForbiddenException);
  });

  it("should link episode for owner when enrolled", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockDb.query.episodes.findFirst.mockResolvedValueOnce({ id: 2 });
    mockDb.limit
      .mockResolvedValueOnce([{ id: 99 }]) // enrollment exists
      .mockResolvedValueOnce([]); // no existing link

    const result = await service.linkEpisode(1, 2, 1);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual({ linked: true, alreadyLinked: false });
  });

  it("should be idempotent when link already exists", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockDb.query.episodes.findFirst.mockResolvedValueOnce({ id: 2 });
    mockDb.limit
      .mockResolvedValueOnce([{ id: 99 }]) // enrollment exists
      .mockResolvedValueOnce([{ id: 10 }]); // existing link

    const result = await service.linkEpisode(1, 2, 1);

    expect(result).toEqual({ linked: true, alreadyLinked: true });
  });

  it("should throw ForbiddenException when user is not enrolled", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockDb.query.episodes.findFirst.mockResolvedValueOnce({ id: 2 });
    mockDb.limit.mockResolvedValueOnce([]);

    await expect(service.linkEpisode(1, 2, 1)).rejects.toThrow(ForbiddenException);
  });

  it("should refresh linked character once", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      keho: 10,
      currentKeho: 4,
      mieli: 9,
      currentMieli: 3,
      tera: 8,
      currentTera: 2,
      harmit: [{ text: "Haava", healed: false }],
      removedFromPlayAt: null,
    });
    mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: null, advancedAt: null }]);

    const result = await service.refreshForEpisode(
      1,
      { episodeId: 2, healedHarmitIndexes: [0] },
      1,
    );

    expect(mockDb.update).toHaveBeenCalled();
    expect(result).toEqual({ refreshed: true, alreadyRefreshed: false });
  });

  it("should not refresh already refreshed link", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      keho: 8,
      currentKeho: 8,
      mieli: 8,
      currentMieli: 8,
      tera: 8,
      currentTera: 8,
      harmit: [],
      removedFromPlayAt: null,
    });
    mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: new Date(), advancedAt: null }]);

    const result = await service.refreshForEpisode(1, { episodeId: 2 }, 1);
    expect(result).toEqual({ refreshed: true, alreadyRefreshed: true });
  });

  it("should advance linked character and snapshot", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      keho: 8,
      currentKeho: 8,
      mieli: 8,
      currentMieli: 8,
      tera: 8,
      currentTera: 8,
      sisuDice: [],
      skills: [],
      fysiikka: 0,
      nopeus: 0,
      ymmarrys: 0,
      persoona: 0,
      nakemys: 0,
      napparyys: 0,
    });
    mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: new Date(), advancedAt: null }]);
    mockDb.returning.mockResolvedValueOnce([{ id: 1, name: "Hero" }]);

    const result = await service.advanceForEpisode(
      1,
      { episodeId: 2, attribute: "fysiikka", reward: "skills_plus_n6", newSkills: ["Aseet"] },
      1,
    );

    expect(mockDb.insert).toHaveBeenCalled();
    expect(result.advanced).toBe(true);
    expect(result.alreadyAdvanced).toBe(false);
  });
});
