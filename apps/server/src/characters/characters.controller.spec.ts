import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { CharactersController } from "./characters.controller";
import { CharactersService } from "./characters.service";

describe("CharactersController", () => {
  let controller: CharactersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: CharactersService,
          useValue: {
            findAll: vi.fn().mockResolvedValue([]),
            findOne: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
