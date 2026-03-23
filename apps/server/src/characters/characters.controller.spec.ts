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
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
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

  it("should pass userId to create", async () => {
    await controller.create({ name: "Hero", archetype: "soldier", episodeId: 1, keho: 8, mieli: 8, tera: 8, sisuDie: "n8", sisuCount: 3, skills: [] }, mockReq);
    expect(service.create).toHaveBeenCalledWith(expect.any(Object), mockUser.id);
  });

  it("should pass userId and role to update", async () => {
    await controller.update(1, { vaurio: 1 }, mockReq);
    expect(service.update).toHaveBeenCalledWith(1, { vaurio: 1 }, mockUser.id, mockUser.role);
  });

  it("should pass userId and role to remove", async () => {
    await controller.remove(1, mockReq);
    expect(service.remove).toHaveBeenCalledWith(1, mockUser.id, mockUser.role);
  });
});
