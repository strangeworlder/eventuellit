import { Test, type TestingModule } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { vi } from "vitest";
import { JwtAuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { EpisodesController } from "./episodes.controller";
import { EpisodesService } from "./episodes.service";

describe("EpisodesController", () => {
  let controller: EpisodesController;
  let service: any;

  const mockGmUser = { id: 1, email: "gm@test.com", username: "gm", role: "gm" };

  beforeEach(async () => {
    service = {
      findAll: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      remove: vi.fn().mockResolvedValue(undefined),
      findSkills: vi.fn().mockResolvedValue([]),
      addSkill: vi.fn().mockResolvedValue({}),
      updateSkill: vi.fn().mockResolvedValue({}),
      removeSkill: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [
        {
          provide: EpisodesService,
          useValue: service,
        },
        Reflector,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EpisodesController>(EpisodesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call findAll", async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it("should call findAll with status filter", async () => {
    await controller.findAll("active");
    expect(service.findAll).toHaveBeenCalledWith("active");
  });

  it("should pass gmId to create", async () => {
    await controller.create({ slug: "test", title: "Test" } as any, mockGmUser);
    expect(service.create).toHaveBeenCalledWith(expect.any(Object), mockGmUser.id);
  });

  it("should allow GM to update", async () => {
    await controller.update(1, { title: "New" } as any);
    expect(service.update).toHaveBeenCalledWith(1, { title: "New" });
  });

  it("should allow GM to delete", async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it("should allow GM to add skill", async () => {
    await controller.addSkill(1, { name: "Pilotti" });
    expect(service.addSkill).toHaveBeenCalledWith(1, { name: "Pilotti" });
  });

  it("should allow GM to remove skill", async () => {
    await controller.removeSkill(1, 5);
    expect(service.removeSkill).toHaveBeenCalledWith(1, 5);
  });
});
