import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { JwtAuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { UpdateEpisodeDto } from "./dto/update-episode.dto";
import { EpisodesController } from "./episodes.controller";
import { EpisodesService } from "./episodes.service";

describe("EpisodesController", () => {
  let controller: EpisodesController;
  let service: Record<string, ReturnType<typeof vi.fn>>;

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

    const _module: TestingModule = await Test.createTestingModule({
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

    controller = new EpisodesController(service as unknown as EpisodesService);
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
    await controller.create({ slug: "test", title: "Test" } as CreateEpisodeDto, mockGmUser);
    expect(service.create).toHaveBeenCalledWith(expect.any(Object), mockGmUser.id);
  });

  it("should allow GM to update", async () => {
    await controller.update(1, { title: "New" } as UpdateEpisodeDto);
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

  describe("ValidationPipe with UpdateEpisodeDto and CreateEpisodeDto", () => {
    const pipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    it("should allow players, sessionDates, and theme in update payload", async () => {
      const payload = {
        title: "Painajainen",
        theme: "base",
        players: "Player 1, Player 2",
        sessionDates: "2026-09-01",
      };
      const result = await pipe.transform(payload, {
        type: "body",
        metatype: UpdateEpisodeDto,
      });
      expect(result).toMatchObject(payload);
    });

    it("should allow players and sessionDates in create payload", async () => {
      const payload = {
        slug: "jakso-7",
        title: "Painajainen",
        theme: "royal",
        players: "Player 1",
        sessionDates: "2026-09-01",
      };
      const result = await pipe.transform(payload, {
        type: "body",
        metatype: CreateEpisodeDto,
      });
      expect(result).toMatchObject(payload);
    });
  });
});
