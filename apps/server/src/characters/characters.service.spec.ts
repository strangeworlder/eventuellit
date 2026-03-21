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
      where: vi.fn().mockReturnThis(),
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
    const characterData = { name: "Test Character", userId: 1 };
    mockDb.returning.mockResolvedValueOnce([characterData]);

    const dto = {
      name: "Test Character",
      archetype: "soldier" as const,
      keho: 8,
      mieli: 8,
      tera: 8,
      sisuDie: "n8" as const,
      sisuCount: 3,
      skills: [],
    };

    const result = await service.create(dto, 1);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual(characterData);
  });

  it("should find all characters with owner join", async () => {
    mockDb.leftJoin.mockResolvedValueOnce([]);
    const result = await service.findAll();
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should allow owner to update their character", async () => {
    const character = { id: 1, userId: 42 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    mockDb.returning.mockResolvedValueOnce([{ ...character, vaurio: 1 }]);

    const result = await service.update(1, { vaurio: 1 }, 42, "player");
    expect(result).toEqual({ ...character, vaurio: 1 });
  });

  it("should allow gm to update any character", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    mockDb.returning.mockResolvedValueOnce([{ ...character, vaurio: 2 }]);

    const result = await service.update(1, { vaurio: 2 }, 1, "gm");
    expect(result).toEqual({ ...character, vaurio: 2 });
  });

  it("should throw ForbiddenException when non-owner player tries to update", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);

    await expect(service.update(1, { vaurio: 1 }, 1, "player")).rejects.toThrow(
      ForbiddenException,
    );
  });

  it("should throw NotFoundException when updating non-existent character", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce(undefined);

    await expect(service.update(999, { vaurio: 1 }, 1, "player")).rejects.toThrow(
      NotFoundException,
    );
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
