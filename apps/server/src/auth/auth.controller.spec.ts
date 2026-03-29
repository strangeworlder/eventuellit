import "reflect-metadata";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { JwtAuthGuard } from "./auth.guard";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let service: any;

  const mockUser = { id: 1, email: "test@test.fi", username: "testuser", role: "player" };
  const mockReq = { user: mockUser } as any;

  const mockRes = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
    };
    return res as any;
  };

  beforeEach(async () => {
    service = {
      requestMagicLink: vi.fn().mockResolvedValue(undefined),
      verifyToken: vi.fn().mockResolvedValue({ user: mockUser, jwt: "token" }),
      validateUser: vi.fn().mockResolvedValue(mockUser),
      exportUserData: vi.fn().mockResolvedValue({
        exportedAt: "2026-03-24T00:00:00.000Z",
        user: mockUser,
        characters: [],
      }),
      deleteUserAccount: vi.fn().mockResolvedValue(undefined),
    };

    await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = new AuthController(service);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("GET /auth/my-data", () => {
    it("should return user data for authenticated user", async () => {
      const result = await controller.exportMyData(mockReq);

      expect(service.exportUserData).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        exportedAt: "2026-03-24T00:00:00.000Z",
        user: mockUser,
        characters: [],
      });
    });
  });

  describe("DELETE /auth/my-account", () => {
    it("should delete account and clear cookie", async () => {
      const res = mockRes();

      await controller.deleteMyAccount(mockReq, res);

      expect(service.deleteUserAccount).toHaveBeenCalledWith(mockUser.id);
      expect(res.clearCookie).toHaveBeenCalledWith(
        "auth_token",
        expect.objectContaining({
          httpOnly: true,
        }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Account deleted successfully" });
    });
  });
});
