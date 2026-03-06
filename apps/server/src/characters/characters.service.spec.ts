import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
import { CharactersService } from "./characters.service";

describe("CharactersService", () => {
  let service: CharactersService;
  let mockDb: any;

  beforeEach(async () => {
    // Mocking the Drizzle API interface to prevent hitting the real database during unit tests
    mockDb = {
      query: {
        characters: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
      },
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
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

  it("should create a character", async () => {
    const characterData = { name: "Test Character", userId: 1, tropes: [] };
    mockDb.returning.mockResolvedValueOnce([characterData]);

    const result = await service.create(characterData as any);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual(characterData);
  });

  it("should find all characters", async () => {
    mockDb.query.characters.findMany.mockResolvedValueOnce([]);
    const result = await service.findAll();
    expect(mockDb.query.characters.findMany).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
