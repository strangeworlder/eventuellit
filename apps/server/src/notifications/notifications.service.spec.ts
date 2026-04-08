import { describe, expect, it, vi } from "vitest";
import { NotificationsService } from "./notifications.service";

function createMockDb(overrides: Record<string, unknown> = {}) {
  const chain: Record<string, unknown> = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
  // Make all chainable
  for (const key of Object.keys(chain)) {
    if (typeof chain[key] === "function" && !overrides[key]) {
      chain[key] = vi.fn().mockReturnValue(chain);
    }
  }
  if (overrides.returning) chain.returning = overrides.returning;
  if (overrides.where) chain.where = overrides.where;
  // biome-ignore lint/suspicious/noExplicitAny: test mock requires any for Drizzle DB type
  return chain as any;
}

describe("NotificationsService", () => {
  describe("getActiveForUser", () => {
    it("returns active (undismissed) notifications for a user", async () => {
      const mockRows = [
        { id: 1, userId: 10, type: "update_names", referenceId: "5", dismissedAt: null },
        { id: 2, userId: 10, type: "update_names", referenceId: "6", dismissedAt: null },
      ];
      const db = createMockDb({
        where: vi.fn().mockResolvedValue(mockRows),
      });
      const service = new NotificationsService(db);

      const result = await service.getActiveForUser(10);

      expect(result.notifications).toEqual(mockRows);
      expect(result.count).toBe(2);
    });

    it("returns empty list when no notifications exist", async () => {
      const db = createMockDb({
        where: vi.fn().mockResolvedValue([]),
      });
      const service = new NotificationsService(db);

      const result = await service.getActiveForUser(99);

      expect(result.notifications).toEqual([]);
      expect(result.count).toBe(0);
    });
  });

  describe("dismiss", () => {
    it("sets dismissedAt on the matching notification", async () => {
      const dismissed = {
        id: 1,
        userId: 10,
        type: "update_names",
        dismissedAt: new Date(),
      };
      const db = createMockDb({
        returning: vi.fn().mockResolvedValue([dismissed]),
      });
      const service = new NotificationsService(db);

      const result = await service.dismiss(1, 10);

      expect(result).toEqual(dismissed);
    });

    it("returns null when notification not found", async () => {
      const db = createMockDb({
        returning: vi.fn().mockResolvedValue([]),
      });
      const service = new NotificationsService(db);

      const result = await service.dismiss(999, 10);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("creates a notification with all fields", async () => {
      const created = {
        id: 1,
        userId: 10,
        type: "update_names",
        referenceId: "5",
        message: "Päivitä hahmosi lempinimet",
      };
      const db = createMockDb({
        returning: vi.fn().mockResolvedValue([created]),
      });
      const service = new NotificationsService(db);

      const result = await service.create(10, "update_names", "5", "Päivitä hahmosi lempinimet");

      expect(result).toEqual(created);
    });
  });

  describe("dismissByType", () => {
    it("dismisses all notifications of a given type for a user", async () => {
      const dismissed = [
        { id: 1, userId: 10, type: "update_names", dismissedAt: new Date() },
        { id: 2, userId: 10, type: "update_names", dismissedAt: new Date() },
      ];
      const db = createMockDb({
        returning: vi.fn().mockResolvedValue(dismissed),
      });
      const service = new NotificationsService(db);

      const result = await service.dismissByType(10, "update_names");

      expect(result).toHaveLength(2);
    });

    it("dismisses only matching referenceId when provided", async () => {
      const dismissed = [
        { id: 1, userId: 10, type: "update_names", referenceId: "5", dismissedAt: new Date() },
      ];
      const db = createMockDb({
        returning: vi.fn().mockResolvedValue(dismissed),
      });
      const service = new NotificationsService(db);

      const result = await service.dismissByType(10, "update_names", "5");

      expect(result).toHaveLength(1);
      expect(result[0].referenceId).toBe("5");
    });
  });

  describe("createForAllPlayers", () => {
    it("returns empty array when no players exist", async () => {
      const db = createMockDb({
        where: vi.fn().mockResolvedValue([]),
      });
      const service = new NotificationsService(db);

      const result = await service.createForAllPlayers("update_names", "Test message");

      expect(result).toEqual([]);
    });
  });
});
