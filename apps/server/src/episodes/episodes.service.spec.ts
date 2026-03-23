import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
import { EpisodesService } from "./episodes.service";

describe("EpisodesService", () => {
  let service: EpisodesService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      query: {
        episodes: {
          findFirst: vi.fn(),
        },
      },
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
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

    const result = await service.create(
      { slug: "new-ep", title: "New Episode" },
      1,
    );
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
    await expect(service.update(999, { title: "X" })).rejects.toThrow(
      NotFoundException,
    );
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
    mockDb.returning.mockResolvedValueOnce([
      { id: 1, episodeId: 1, name: "Murtovaras" },
    ]);

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
    mockDb.where
      .mockResolvedValueOnce([episode])
      .mockResolvedValueOnce([skill]);

    await expect(service.removeSkill(1, 5)).rejects.toThrow(NotFoundException);
  });
});
