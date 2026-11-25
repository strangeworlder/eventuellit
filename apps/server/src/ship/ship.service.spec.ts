import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthUser } from "../auth/current-user.decorator";
import { DATABASE_CONNECTION } from "../db/db.module";
import { evaluateDowntimeRolls, ShipService } from "./ship.service";
import { DEFAULT_SHIP_CONFIG, DEFAULT_SHIP_ROOMS } from "./ship-seed";

type MockDb = {
  query: Record<string, Record<string, ReturnType<typeof vi.fn>>>;
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  leftJoin: ReturnType<typeof vi.fn>;
  innerJoin: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  transaction: ReturnType<typeof vi.fn>;
  execute: ReturnType<typeof vi.fn>;
};

const PLAYER_USER: AuthUser = {
  id: 10,
  email: "pelaaja@example.com",
  username: "Pelaaja",
  role: "player",
};

const GM_USER: AuthUser = {
  id: 1,
  email: "pj@example.com",
  username: "Pelinjohtaja",
  role: "gm",
};

describe("evaluateDowntimeRolls", () => {
  it("counts 13+ hits and grants +1 critical tick only when both hit and doubles occur", () => {
    // Doubles below threshold -> 0 hits, NOT critical
    expect(evaluateDowntimeRolls([5, 5])).toEqual({
      rolls: [5, 5],
      hits: 0,
      hasDoubles: true,
      isCritical: false,
      totalTicks: 0,
    });

    // Two identical hits -> 2 hits + 1 critical = 3 ticks
    expect(evaluateDowntimeRolls([13, 13])).toEqual({
      rolls: [13, 13],
      hits: 2,
      hasDoubles: true,
      isCritical: true,
      totalTicks: 3,
    });

    // One hit plus low doubles -> 1 hit + 1 critical = 2 ticks
    expect(evaluateDowntimeRolls([15, 7, 7])).toEqual({
      rolls: [15, 7, 7],
      hits: 1,
      hasDoubles: true,
      isCritical: true,
      totalTicks: 2,
    });

    // All hits without doubles -> no bonus tick
    expect(evaluateDowntimeRolls([13, 17, 20])).toEqual({
      rolls: [13, 17, 20],
      hits: 3,
      hasDoubles: false,
      isCritical: false,
      totalTicks: 3,
    });
  });
});

describe("ShipService", () => {
  let service: ShipService;
  let mockDb: MockDb;

  beforeEach(async () => {
    mockDb = {
      query: {
        shipRooms: { findFirst: vi.fn() },
        characters: { findFirst: vi.fn() },
        cabinPossessions: { findFirst: vi.fn() },
        shipClocks: { findFirst: vi.fn() },
        shipDowntimeTurns: { findFirst: vi.fn() },
      },
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      transaction: vi.fn(async (cb) => cb(mockDb)),
      execute: vi.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<ShipService>(ShipService);
  });

  it("claims an unoccupied cabin and clears any previous cabin claim in the same transaction", async () => {
    mockDb.query.shipRooms.findFirst.mockResolvedValueOnce({
      id: 8,
      key: "cabin-b1",
      kind: "cabin",
      isLocked: false,
      claimedByCharacterId: null,
    });
    mockDb.query.characters.findFirst.mockResolvedValueOnce({
      id: 42,
      userId: PLAYER_USER.id,
      removedFromPlayAt: null,
      harmit: [{ text: "Palovamma", healed: false }],
    });
    mockDb.returning.mockResolvedValueOnce([{ key: "cabin-b1", claimedByCharacterId: 42 }]);

    const result = await service.claimCabin("cabin-b1", { characterId: 42 }, PLAYER_USER);

    expect(mockDb.transaction).toHaveBeenCalledTimes(1);
    expect(mockDb.update).toHaveBeenCalledTimes(2);
    expect(mockDb.set).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ claimedByCharacterId: null }),
    );
    expect(mockDb.set).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ claimedByCharacterId: 42 }),
    );
    expect(result).toEqual({ key: "cabin-b1", claimedByCharacterId: 42 });
  });

  it("rejects claiming a locked cabin or a cabin occupied by another character", async () => {
    mockDb.query.shipRooms.findFirst.mockResolvedValueOnce({
      key: "cabin-b2",
      kind: "cabin",
      isLocked: true,
      claimedByCharacterId: null,
    });
    await expect(service.claimCabin("cabin-b2", { characterId: 42 }, PLAYER_USER)).rejects.toThrow(
      BadRequestException,
    );

    mockDb.query.shipRooms.findFirst.mockResolvedValueOnce({
      key: "cabin-b3",
      kind: "cabin",
      isLocked: false,
      claimedByCharacterId: 99,
    });
    await expect(service.claimCabin("cabin-b3", { characterId: 42 }, PLAYER_USER)).rejects.toThrow(
      BadRequestException,
    );
  });

  it("prevents player edit/delete on possessions with GM mechanical notes and allows GM unlock", async () => {
    const lockedItem = {
      id: 7,
      characterId: 42,
      name: "Messinkikompassi",
      description: "Osoittaa kohti Länsiasemaa.",
      gmMechanicalNotes: "+1n20 suunnistukseen tyhjiömyrskyssä.",
    };
    const ownedChar = { id: 42, userId: PLAYER_USER.id };

    mockDb.query.cabinPossessions.findFirst.mockResolvedValueOnce(lockedItem);
    mockDb.query.characters.findFirst.mockResolvedValueOnce(ownedChar);
    await expect(service.updatePossession(7, { name: "Muutettu" }, PLAYER_USER)).rejects.toThrow(
      ForbiddenException,
    );

    mockDb.query.cabinPossessions.findFirst.mockResolvedValueOnce(lockedItem);
    mockDb.query.characters.findFirst.mockResolvedValueOnce(ownedChar);
    await expect(service.deletePossession(7, PLAYER_USER)).rejects.toThrow(ForbiddenException);

    // GM clears the mechanical note -> unlocks item
    mockDb.query.cabinPossessions.findFirst.mockResolvedValueOnce(lockedItem);
    mockDb.query.characters.findFirst.mockResolvedValueOnce(ownedChar);
    mockDb.returning.mockResolvedValueOnce([{ ...lockedItem, gmMechanicalNotes: null }]);

    const unlocked = await service.updatePossession(7, { gmMechanicalNotes: "" }, GM_USER);
    expect(unlocked.isLockedByGm).toBe(false);
  });

  it("allows drafting downtime after completed episode, blocks resolve until next episode link, then heals harmit", async () => {
    const char = {
      id: 42,
      userId: PLAYER_USER.id,
      name: "Kipinä",
      archetype: "Ekspertti",
      removedFromPlayAt: null,
      harmit: [
        { text: "Palovamma", healed: false },
        { text: "Naarmu", healed: true },
      ],
    };

    // Case 1: only completed episode linked -> canDraft=true, canRoll=false (4 dice: 5 - 1 active harmi)
    mockDb.query.characters.findFirst.mockResolvedValueOnce(char);
    mockDb.orderBy
      .mockResolvedValueOnce([
        { episodeId: 1, title: "Jakso 1", slug: "j1", status: "completed", order: 1 },
      ]) // linkedRows
      .mockResolvedValueOnce([]) // turns
      .mockResolvedValueOnce([]); // listClocks

    const preLinkState = await service.getCharacterDowntime(42, PLAYER_USER);
    expect(preLinkState.availableDice).toBe(4);
    expect(preLinkState.canDraft).toBe(true);
    expect(preLinkState.canRoll).toBe(false);

    // Resolving before linking to next episode must reject
    mockDb.query.characters.findFirst.mockResolvedValueOnce(char);
    mockDb.orderBy
      .mockResolvedValueOnce([
        { episodeId: 1, title: "Jakso 1", slug: "j1", status: "completed", order: 1 },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    await expect(
      service.resolveDowntime(
        42,
        { healedHarmiIndices: [0], clockDice: {}, prepDice: 3, prepDescription: "Partiointi" },
        PLAYER_USER,
      ),
    ).rejects.toThrow(BadRequestException);

    // Case 2: next episode is linked -> resolve heals active harmi 1:1 and resolves prep dice
    mockDb.query.characters.findFirst.mockResolvedValueOnce(char);
    mockDb.orderBy
      .mockResolvedValueOnce([
        { episodeId: 1, title: "Jakso 1", slug: "j1", status: "completed", order: 1 },
        { episodeId: 2, title: "Jakso 2", slug: "j2", status: "planned", order: 2 },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    mockDb.query.shipDowntimeTurns.findFirst.mockResolvedValueOnce(null);
    mockDb.returning
      .mockResolvedValueOnce([
        {
          ...char,
          harmit: [
            { text: "Palovamma", healed: true },
            { text: "Naarmu", healed: true },
          ],
        },
      ])
      .mockResolvedValueOnce([{ id: 99, status: "resolved" }]);

    const resolved = await service.resolveDowntime(
      42,
      {
        healedHarmiIndices: [0],
        clockDice: {},
        prepDice: 3,
        prepDescription: "Käytävien kartoitus",
      },
      PLAYER_USER,
    );

    expect(resolved.resolution.availableDice).toBe(4);
    expect(resolved.resolution.healedHarmit).toEqual([{ index: 0, text: "Palovamma" }]);
    expect(resolved.resolution.prepResult?.diceCount).toBe(3);
    expect(resolved.resolution.prepResult?.rolls).toHaveLength(3);
    expect(mockDb.insert).toHaveBeenCalledTimes(2); // snapshot + shipDowntimeTurns
  });

  it("picks the latest completed episode as pendingSourceEpisode and does not fall back to older completed episodes", async () => {
    const char = {
      id: 43,
      userId: PLAYER_USER.id,
      name: "Vara",
      archetype: "Sotilas",
      removedFromPlayAt: null,
      harmit: [],
    };

    mockDb.query.characters.findFirst.mockResolvedValueOnce(char);
    mockDb.orderBy
      .mockResolvedValueOnce([
        { episodeId: 1, title: "Jakso 1", slug: "j1", status: "completed", order: 1 },
        { episodeId: 11, title: "Jakso 11", slug: "j11", status: "completed", order: 11 },
        { episodeId: 12, title: "Jakso 12", slug: "j12", status: "planned", order: 12 },
      ])
      .mockResolvedValueOnce([]) // no resolved turns yet
      .mockResolvedValueOnce([]);

    const ctx = await service.getCharacterDowntime(43, PLAYER_USER);
    expect(ctx.pendingSourceEpisode?.episodeId).toBe(11);
    expect(ctx.lockedEpisode?.episodeId).toBe(12);
    expect(ctx.canRoll).toBe(true);

    // Once episode 11 is resolved, episode 1 must not reopen as a pending source episode
    mockDb.query.characters.findFirst.mockResolvedValueOnce(char);
    mockDb.orderBy
      .mockResolvedValueOnce([
        { episodeId: 1, title: "Jakso 1", slug: "j1", status: "completed", order: 1 },
        { episodeId: 11, title: "Jakso 11", slug: "j11", status: "completed", order: 11 },
        { episodeId: 12, title: "Jakso 12", slug: "j12", status: "planned", order: 12 },
      ])
      .mockResolvedValueOnce([
        {
          id: 55,
          characterId: 43,
          sourceCompletedEpisodeId: 11,
          lockedEpisodeId: 12,
          status: "resolved",
          resolvedAt: new Date("2026-11-25T10:00:00Z"),
          resolutionJson: null,
        },
      ])
      .mockResolvedValueOnce([]);

    const afterResolve = await service.getCharacterDowntime(43, PLAYER_USER);
    expect(afterResolve.pendingSourceEpisode).toBeNull();
    expect(afterResolve.canDraft).toBe(false);
    expect(afterResolve.canRoll).toBe(false);
  });
});

describe("DEFAULT_SHIP_ROOMS 4-deck canonical ship architecture", () => {
  it("defines 4 canonical decks with 40 cabins across wings A-D and 16 facilities/sealed sectors", () => {
    const decks = new Set(DEFAULT_SHIP_ROOMS.map((room) => room.deckNumber));
    expect(Array.from(decks).sort()).toEqual([1, 2, 3, 4]);

    const cabins = DEFAULT_SHIP_ROOMS.filter((room) => room.kind === "cabin");
    expect(cabins).toHaveLength(40);

    const byWing = new Map<string, number>();
    for (const cabin of cabins) {
      byWing.set(cabin.svgZoneId, (byWing.get(cabin.svgZoneId) ?? 0) + 1);
    }
    expect(byWing.get("d1-wing-a")).toBe(6);
    expect(byWing.get("d2-wing-b")).toBe(12);
    expect(byWing.get("d2-wing-c")).toBe(12);
    expect(byWing.get("d3-wing-d")).toBe(10);

    const nonCabins = DEFAULT_SHIP_ROOMS.filter((room) => room.kind !== "cabin");
    expect(nonCabins).toHaveLength(16);

    const sealedRooms = DEFAULT_SHIP_ROOMS.filter((room) => room.kind === "sealed");
    expect(sealedRooms.map((r) => r.key).sort()).toEqual([
      "sealed-archive",
      "sealed-dormitory",
      "sealed-shafts",
    ]);
    expect(sealedRooms.every((r) => r.isLocked)).toBe(true);

    expect(DEFAULT_SHIP_CONFIG.callsign).toBe("Runko 150 m");
    expect(DEFAULT_SHIP_CONFIG.statusBanner).not.toMatch(/kiertoradalla/i);

    for (const room of DEFAULT_SHIP_ROOMS) {
      const copy = `${room.name} ${room.subtitle ?? ""} ${room.description}`;
      expect(copy).not.toMatch(/[—–]|--/);
      expect(copy).not.toMatch(/torped|tulenjohto|reaktorikent|kiertorad|antimateria/i);
      expect(copy).not.toMatch(/\b(EGA|CGA)\b/i);
    }
  });
});

describe("ShipService.updateRoom validation", () => {
  let service: ShipService;
  let mockDb: MockDb;

  beforeEach(async () => {
    mockDb = {
      query: {
        shipRooms: { findFirst: vi.fn() },
        characters: { findFirst: vi.fn() },
        cabinPossessions: { findFirst: vi.fn() },
        shipClocks: { findFirst: vi.fn() },
        shipDowntimeTurns: { findFirst: vi.fn() },
      },
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      transaction: vi.fn(async (cb) => cb(mockDb)),
      execute: vi.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<ShipService>(ShipService);
  });

  it("trims and updates room name, subtitle, and statusTone, and rejects blank names", async () => {
    mockDb.query.shipRooms.findFirst.mockResolvedValue({
      id: 9,
      key: "breach-port",
      name: "Kylkivaurio",
      statusTone: "critical",
    });

    await expect(service.updateRoom("breach-port", { name: "   " })).rejects.toThrow(
      BadRequestException,
    );

    mockDb.returning.mockResolvedValueOnce([
      {
        id: 9,
        key: "breach-port",
        name: "Paikattu kylkilaipio",
        subtitle: "Hitsattu umpeen",
        statusTone: "normal",
        statusLabel: "Tiivistetty",
      },
    ]);

    const updated = await service.updateRoom("breach-port", {
      name: "  Paikattu kylkilaipio  ",
      subtitle: " Hitsattu umpeen ",
      statusTone: "normal",
      statusLabel: " Tiivistetty ",
    });

    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Paikattu kylkilaipio",
        subtitle: "Hitsattu umpeen",
        statusTone: "normal",
        statusLabel: "Tiivistetty",
      }),
    );
    expect(updated.name).toBe("Paikattu kylkilaipio");
    expect(updated.statusTone).toBe("normal");
  });
});
