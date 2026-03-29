import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { ForbiddenException } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { EpisodesController } from "./episodes.controller";
import { EpisodesService } from "./episodes.service";

describe("EpisodesController", () => {
  let controller: EpisodesController;
  let service: any;

  const mockGmUser = { id: 1, role: "gm" };
  const mockPlayerUser = { id: 2, role: "player" };
  const mockGmReq = { user: mockGmUser } as any;
  const mockPlayerReq = { user: mockPlayerUser } as any;

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
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = new EpisodesController(service);
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
    await controller.create({ slug: "test", title: "Test" }, mockGmReq);
    expect(service.create).toHaveBeenCalledWith(expect.any(Object), mockGmUser.id);
  });

  it("should throw ForbiddenException when player tries to create", async () => {
    await expect(controller.create({ slug: "test", title: "Test" }, mockPlayerReq)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it("should allow GM to update", async () => {
    await controller.update(1, { title: "New" }, mockGmReq);
    expect(service.update).toHaveBeenCalledWith(1, { title: "New" });
  });

  it("should throw when player tries to update", async () => {
    await expect(controller.update(1, { title: "New" }, mockPlayerReq)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it("should allow GM to delete", async () => {
    await controller.remove(1, mockGmReq);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it("should allow GM to add skill", async () => {
    await controller.addSkill(1, { name: "Pilotti" }, mockGmReq);
    expect(service.addSkill).toHaveBeenCalledWith(1, { name: "Pilotti" });
  });

  it("should throw when player tries to add skill", async () => {
    await expect(controller.addSkill(1, { name: "Pilotti" }, mockPlayerReq)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it("should allow GM to remove skill", async () => {
    await controller.removeSkill(1, 5, mockGmReq);
    expect(service.removeSkill).toHaveBeenCalledWith(1, 5);
  });
});
