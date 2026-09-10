import "reflect-metadata";
import { Reflector } from "@nestjs/core";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { JwtAuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { MonkPowersController } from "./monk-powers.controller";
import { MonkPowersService } from "./monk-powers.service";

describe("MonkPowersController", () => {
  let controller: MonkPowersController;
  let service: any;

  beforeEach(async () => {
    service = {
      findAll: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      remove: vi.fn().mockResolvedValue({ success: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonkPowersController],
      providers: [
        {
          provide: MonkPowersService,
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

    controller = new MonkPowersController(service);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call findAll without tier when tier is not provided", async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalledWith(undefined);
  });

  it("should call findAll with parsed tier when tier query is provided", async () => {
    await controller.findAll("3");
    expect(service.findAll).toHaveBeenCalledWith(3);
  });

  it("should call findOne with parsed id", async () => {
    await controller.findOne(5);
    expect(service.findOne).toHaveBeenCalledWith(5);
  });

  it("should call create with dto", async () => {
    const dto = { name: "Valonkantaja", tier: 2 };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("should call update with id and dto", async () => {
    const dto = { name: "Päivitetty" };
    await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it("should call remove with id", async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
