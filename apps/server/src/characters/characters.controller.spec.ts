import "reflect-metadata";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { JwtAuthGuard } from "../auth/auth.guard";
import { CharactersController } from "./characters.controller";
import { CharactersService } from "./characters.service";

describe("CharactersController", () => {
  let controller: CharactersController;
  let service: any;

  const mockUser = { id: 1, role: "player" };
  const mockReq = { user: mockUser } as any;

  beforeEach(async () => {
    service = {
      findAll: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue(null),
      listSnapshots: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      linkEpisode: vi.fn().mockResolvedValue({ linked: true, alreadyLinked: false }),
      refreshForEpisode: vi.fn().mockResolvedValue({ refreshed: true, alreadyRefreshed: false }),
      advanceForEpisode: vi.fn().mockResolvedValue({ advanced: true, alreadyAdvanced: false }),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: CharactersService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = new CharactersController(service);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call findAll", async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it("should pass user context to listSnapshots", async () => {
    await controller.listSnapshots(1, mockReq);
    expect(service.listSnapshots).toHaveBeenCalledWith(1, mockUser.id, mockUser.role);
  });

  it("should pass userId to create", async () => {
    await controller.create(
      {
        name: "Hero",
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
      },
      mockReq,
    );
    expect(service.create).toHaveBeenCalledWith(expect.any(Object), mockUser.id);
  });

  it("should pass userId and role to update", async () => {
    const harmit = [{ text: "Palovamma", healed: false }];
    await controller.update(1, { harmit }, mockReq);
    expect(service.update).toHaveBeenCalledWith(1, { harmit }, mockUser.id, mockUser.role);
  });

  it("should pass userId and role to remove", async () => {
    await controller.remove(1, mockReq);
    expect(service.remove).toHaveBeenCalledWith(1, mockUser.id, mockUser.role);
  });

  it("should pass userId to linkEpisode", async () => {
    await controller.linkEpisode(1, { episodeId: 2 }, mockReq);
    expect(service.linkEpisode).toHaveBeenCalledWith(1, 2, mockUser.id);
  });

  it("should pass userId to refresh", async () => {
    await controller.refresh(1, { episodeId: 2, healedHarmitIndexes: [0] }, mockReq);
    expect(service.refreshForEpisode).toHaveBeenCalledWith(
      1,
      { episodeId: 2, healedHarmitIndexes: [0] },
      mockUser.id,
    );
  });

  it("should pass userId to advance", async () => {
    await controller.advance(
      1,
      { episodeId: 2, attribute: "fysiikka", reward: "skills_plus_n6", newSkills: [] },
      mockReq,
    );
    expect(service.advanceForEpisode).toHaveBeenCalledWith(
      1,
      { episodeId: 2, attribute: "fysiikka", reward: "skills_plus_n6", newSkills: [] },
      mockUser.id,
    );
  });
});
