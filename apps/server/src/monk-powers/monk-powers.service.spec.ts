import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
import { MonkPowersService } from "./monk-powers.service";

type MockDb = {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("MonkPowersService", () => {
  let service: MonkPowersService;
  let mockDb: MockDb;

  beforeEach(async () => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonkPowersService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<MonkPowersService>(MonkPowersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should find all monk powers", async () => {
    const list = [{ id: 1, name: "Meditaatio", tier: 1 }];
    mockDb.orderBy.mockResolvedValueOnce(list);
    const result = await service.findAll();
    expect(result).toEqual(list);
  });

  it("should filter by tier when tier is specified", async () => {
    mockDb.orderBy.mockResolvedValueOnce([]);
    await service.findAll(2);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it("should throw NotFoundException if power not found in findOne", async () => {
    mockDb.where.mockResolvedValueOnce([]);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it("should create a monk power", async () => {
    const created = { id: 1, name: "Voima 1", tier: 1, description: "Koe", properties: {} };
    mockDb.returning.mockResolvedValueOnce([created]);
    const result = await service.create({ name: "Voima 1", tier: 1, description: "Koe" });
    expect(result).toEqual(created);
  });

  it("should update a monk power", async () => {
    const existing = { id: 1, name: "Vanha nimi", tier: 1 };
    const updated = { id: 1, name: "Uusi nimi", tier: 1 };
    mockDb.where.mockResolvedValueOnce([existing]); // for findOne check
    mockDb.returning.mockResolvedValueOnce([updated]);

    const result = await service.update(1, { name: "Uusi nimi" });
    expect(result).toEqual(updated);
  });

  it("should remove a monk power", async () => {
    const existing = { id: 1, name: "Poistettava", tier: 1 };
    mockDb.where.mockResolvedValueOnce([existing]); // for findOne check
    const result = await service.remove(1);
    expect(result).toEqual({ success: true });
    expect(mockDb.delete).toHaveBeenCalled();
  });
});
