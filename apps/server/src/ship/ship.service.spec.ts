import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ShipService } from "./ship.service";

// Minimal Drizzle mock helpers
const makeRoom = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  shipId: 1,
  svgElementId: "room-bridge",
  name: "Komentosilta",
  function: null,
  contents: null,
  ownerId: null,
  claimantId: null,
  isLocked: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeUser = (overrides: Record<string, unknown> = {}) => ({
  id: 10,
  role: "player",
  ...overrides,
});

const makeDb = (roomOverrides: Record<string, unknown> = {}) => {
  const room = makeRoom(roomOverrides);
  return {
    query: {
      ships: { findFirst: vi.fn().mockResolvedValue({ id: 1, name: "Alus" }) },
      shipRooms: { findFirst: vi.fn().mockResolvedValue(room) },
      roomOccupancies: { findFirst: vi.fn().mockResolvedValue(null) },
    },
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([room]),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 99, roomId: 1, characterId: 5 }]),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
        innerJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
  };
};

describe("ShipService", () => {
  let service: ShipService;
  let db: ReturnType<typeof makeDb>;

  beforeEach(() => {
    db = makeDb();
    service = new ShipService(db as never);
  });

  // ── Permission matrix ────────────────────────────────────────────────────

  describe("updateRoom", () => {
    it("allows GM to edit any room", async () => {
      const gm = makeUser({ role: "gm" });
      await expect(
        service.updateRoom(1, { function: "Navigointi" }, gm),
      ).resolves.toBeDefined();
    });

    it("allows any player to edit unclaimed, unlocked rooms", async () => {
      const player = makeUser({ id: 20 });
      await expect(
        service.updateRoom(1, { function: "Navigointi" }, player),
      ).resolves.toBeDefined();
    });

    it("returns ForbiddenException for a pending-claim room (non-GM)", async () => {
      db = makeDb({ claimantId: 5, ownerId: null });
      service = new ShipService(db as never);
      const player = makeUser({ id: 20 });
      await expect(service.updateRoom(1, {}, player)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("allows owner to edit their own room", async () => {
      db = makeDb({ ownerId: 10, claimantId: null });
      service = new ShipService(db as never);
      const owner = makeUser({ id: 10 });
      await expect(service.updateRoom(1, {}, owner)).resolves.toBeDefined();
    });

    it("blocks non-owner from editing an owned room", async () => {
      db = makeDb({ ownerId: 10, claimantId: null });
      service = new ShipService(db as never);
      const other = makeUser({ id: 99 });
      await expect(service.updateRoom(1, {}, other)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("blocks player from editing a locked room", async () => {
      db = makeDb({ isLocked: true });
      service = new ShipService(db as never);
      const player = makeUser({ id: 20 });
      await expect(service.updateRoom(1, {}, player)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("returns NotFoundException for missing room", async () => {
      db = makeDb();
      db.query.shipRooms.findFirst = vi.fn().mockResolvedValue(null);
      service = new ShipService(db as never);
      await expect(
        service.updateRoom(99, {}, makeUser()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── Claim state machine ──────────────────────────────────────────────────

  describe("suggestClaim", () => {
    it("sets claimantId for unclaimed room", async () => {
      const player = makeUser({ id: 10 });
      await expect(service.suggestClaim(1, player)).resolves.toBeDefined();
    });

    it("blocks claim when room already has owner", async () => {
      db = makeDb({ ownerId: 5, claimantId: null });
      service = new ShipService(db as never);
      await expect(service.suggestClaim(1, makeUser())).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("blocks claim when pending claim already exists", async () => {
      db = makeDb({ claimantId: 5, ownerId: null });
      service = new ShipService(db as never);
      await expect(service.suggestClaim(1, makeUser())).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe("approveClaim", () => {
    it("allows GM to approve a pending claim", async () => {
      db = makeDb({ claimantId: 5, ownerId: null });
      service = new ShipService(db as never);
      const gm = makeUser({ role: "gm" });
      await expect(service.approveClaim(1, gm)).resolves.toBeDefined();
    });

    it("blocks non-GM from approving", async () => {
      db = makeDb({ claimantId: 5, ownerId: null });
      service = new ShipService(db as never);
      await expect(service.approveClaim(1, makeUser())).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("throws if no pending claim exists", async () => {
      const gm = makeUser({ role: "gm" });
      await expect(service.approveClaim(1, gm)).rejects.toThrow(ForbiddenException);
    });
  });

  describe("rejectClaim", () => {
    it("allows GM to reject a pending claim", async () => {
      const gm = makeUser({ role: "gm" });
      await expect(service.rejectClaim(1, gm)).resolves.toBeDefined();
    });

    it("blocks non-GM from rejecting", async () => {
      await expect(service.rejectClaim(1, makeUser())).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe("toggleLock", () => {
    it("allows GM to lock a room", async () => {
      const gm = makeUser({ role: "gm" });
      await expect(service.toggleLock(1, gm)).resolves.toBeDefined();
    });

    it("blocks non-GM from locking", async () => {
      await expect(service.toggleLock(1, makeUser())).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
