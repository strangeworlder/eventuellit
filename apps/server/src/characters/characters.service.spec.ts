import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
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
        CharactersService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
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
    mockDb.orderBy.mockResolvedValueOnce([]);
    const result = await service.findAll();
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual([{ ...charRow, episodes: [] }]);
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
});
