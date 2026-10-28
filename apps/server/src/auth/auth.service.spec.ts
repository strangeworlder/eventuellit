import "reflect-metadata";
import { UnauthorizedException } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { eq, sql } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as schema from "../db/schema";
import { AuthService } from "./auth.service";
import { RequestLinkDto } from "./dto/request-link.dto";
import type { MailService } from "./mail.service";

describe("AuthService", () => {
  let service: AuthService;
  let mockInsertValues: ReturnType<typeof vi.fn>;
  let mockDb: {
    query: {
      users: {
        findFirst: ReturnType<typeof vi.fn>;
        findMany: ReturnType<typeof vi.fn>;
      };
      magicLinkTokens: {
        findFirst: ReturnType<typeof vi.fn>;
      };
      characters: {
        findMany: ReturnType<typeof vi.fn>;
      };
    };
    insert: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    transaction: ReturnType<typeof vi.fn>;
  };
  let mockJwtService: { sign: ReturnType<typeof vi.fn> };
  let mockMailService: { sendMagicLink: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockInsertValues = vi.fn().mockResolvedValue(undefined);
    mockDb = {
      query: {
        users: {
          findFirst: vi.fn(),
          findMany: vi.fn(),
        },
        magicLinkTokens: {
          findFirst: vi.fn(),
        },
        characters: {
          findMany: vi.fn(),
        },
      },
      insert: vi.fn().mockReturnValue({
        values: mockInsertValues,
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
      transaction: vi.fn().mockImplementation((cb: (tx: unknown) => Promise<unknown>) =>
        cb({
          update: vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue(undefined),
            }),
          }),
          delete: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      ),
    };

    mockJwtService = {
      sign: vi.fn().mockReturnValue("signed-jwt-token"),
    };

    mockMailService = {
      sendMagicLink: vi.fn().mockResolvedValue(undefined),
    };

    service = new AuthService(
      mockDb as unknown as NodePgDatabase<typeof schema>,
      mockJwtService as unknown as JwtService,
      mockMailService as unknown as MailService,
    );
  });

  describe("requestMagicLink", () => {
    it("should query user case-insensitively, store normalized email, and send magic link", async () => {
      mockDb.query.users.findFirst.mockResolvedValue({
        id: 1,
        email: "Player@Domain.COM",
      });

      await service.requestMagicLink("  PLAYER@domain.com  ", "https://app.example.com");

      expect(mockDb.query.users.findFirst).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalledWith(schema.magicLinkTokens);
      expect(mockInsertValues).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "player@domain.com",
        }),
      );
      expect(mockMailService.sendMagicLink).toHaveBeenCalledWith(
        "Player@Domain.COM",
        expect.stringContaining("https://app.example.com/auth/vahvista?token="),
      );
    });

    it("should return early and not send mail when user is not found", async () => {
      mockDb.query.users.findFirst.mockResolvedValue(null);

      await service.requestMagicLink("unknown@example.com", "https://app.example.com");

      expect(mockDb.insert).not.toHaveBeenCalled();
      expect(mockMailService.sendMagicLink).not.toHaveBeenCalled();
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token and find user case-insensitively", async () => {
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 10);

      mockDb.query.magicLinkTokens.findFirst.mockResolvedValue({
        id: 10,
        email: "player@domain.com",
        token: "valid-uuid-token",
        expiresAt: futureDate,
        usedAt: null,
      });

      mockDb.query.users.findFirst.mockResolvedValue({
        id: 1,
        email: "Player@Domain.COM",
        username: "PlayerOne",
        role: "player",
      });

      const result = await service.verifyToken("valid-uuid-token");

      expect(result.jwt).toBe("signed-jwt-token");
      expect(result.user.email).toBe("Player@Domain.COM");
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: "Player@Domain.COM",
        role: "player",
        username: "PlayerOne",
      });
    });

    it("should throw UnauthorizedException if token does not exist", async () => {
      mockDb.query.magicLinkTokens.findFirst.mockResolvedValue(null);

      await expect(service.verifyToken("invalid-token")).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("SQL generation & DTO normalization sanity checks", () => {
    it("generates valid PostgreSQL lower() equality in Drizzle relational query", () => {
      const realMockDb = drizzle.mock({ schema });
      const query = realMockDb.query.users.findFirst({
        where: eq(sql`lower(${schema.users.email})`, "player@domain.com"),
        columns: { id: true, email: true },
      });

      const compiled = query.toSQL();
      expect(compiled.sql.toLowerCase()).toContain('where lower("users"."email") = $1');
      expect(compiled.params).toContain("player@domain.com");
    });

    it("transforms and validates RequestLinkDto with mixed case and whitespace", async () => {
      const dto = plainToInstance(RequestLinkDto, { email: "  Player.One@Example.FI  " });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.email).toBe("player.one@example.fi");
    });
  });
});
