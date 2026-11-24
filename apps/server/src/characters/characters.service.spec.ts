import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { vi } from "vitest";
import { DATABASE_CONNECTION } from "../db/db.module";
import { NotificationsService } from "../notifications/notifications.service";
import { CharactersService } from "./characters.service";

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
  execute?: ReturnType<typeof vi.fn>;
};

describe("CharactersService", () => {
  let service: CharactersService;
  let mockDb: MockDb;

  beforeEach(async () => {
    mockDb = {
      query: {
        users: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
        characters: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
        episodes: {
          findFirst: vi.fn(),
        },
        monkPowers: {
          findFirst: vi.fn(),
        },
        characterMonkPowers: {
          findFirst: vi.fn(),
        },
        characterPrivateNotes: {
          findFirst: vi.fn(),
        },
      },
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockImplementation(() => Promise.resolve([])),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      transaction: vi.fn(async (cb) => cb(mockDb)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
        {
          provide: NotificationsService,
          useValue: { dismissByType: vi.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a character with userId from JWT", async () => {
    const characterData = { name: "Test Character", userId: 1, id: 1 };
    mockDb.returning.mockResolvedValueOnce([characterData]);

    const dto = {
      name: "Test Character",
      archetype: "Sotilas",
      episodeId: 1,
      keho: 8,
      mieli: 8,
      tera: 8,
      sisuDice: [
        { id: "sisu-0", faces: 8 },
        { id: "sisu-1", faces: 8 },
        { id: "sisu-2", faces: 8 },
      ],
      skills: [],
    };

    const result = await service.create(dto, 1);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual(characterData);
  });

  it("should claim an anchor for a user who does not have one yet and backfill characters", async () => {
    mockDb.query.users.findFirst
      .mockResolvedValueOnce({ id: 1, anchorId: null }) // current user
      .mockResolvedValueOnce(null); // uniqueness check: no other user has it
    mockDb.returning.mockResolvedValueOnce([{ id: 2, name: "Second Char", anchorId: "kuilu" }]);

    const dto = {
      name: "Second Char",
      archetype: "Ekspertti",
      anchorId: "kuilu",
      keho: 8,
      mieli: 8,
      tera: 8,
      sisuDice: [],
      skills: [],
    };

    const result = await service.create(dto, 1);
    // Updates both users table and existing characters table
    expect(mockDb.update).toHaveBeenCalledTimes(2);
    expect(mockDb.set).toHaveBeenCalledWith({ anchorId: "kuilu" });
    expect(result).toEqual({ id: 2, name: "Second Char", anchorId: "kuilu" });
  });

  it("should enforce existing user anchor when user already has one", async () => {
    mockDb.query.users.findFirst.mockResolvedValueOnce({ id: 1, anchorId: "kuilu" }); // user already has anchor
    mockDb.returning.mockResolvedValueOnce([{ id: 3, name: "Third Char", anchorId: "kuilu" }]);

    const dto = {
      name: "Third Char",
      archetype: "Sotilas",
      anchorId: "sopu", // tries to pass a different anchor
      keho: 8,
      mieli: 8,
      tera: 8,
      sisuDice: [],
      skills: [],
    };

    const result = await service.create(dto, 1);
    // Should NOT update users or characters table because anchor was already locked
    expect(mockDb.update).not.toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith(
      expect.objectContaining({
        anchorId: "kuilu", // Enforced existing anchor
      }),
    );
    expect(result).toEqual({ id: 3, name: "Third Char", anchorId: "kuilu" });
  });

  it("should reject claiming an anchor that another user has already claimed", async () => {
    mockDb.query.users.findFirst
      .mockResolvedValueOnce({ id: 1, anchorId: null }) // current user
      .mockResolvedValueOnce({ id: 2, anchorId: "kuilu" }); // another user has it

    const dto = {
      name: "Second Char",
      archetype: "Ekspertti",
      anchorId: "kuilu",
      keho: 8,
      mieli: 8,
      tera: 8,
      sisuDice: [],
      skills: [],
    };

    await expect(service.create(dto, 1)).rejects.toThrow("Ankkuri on jo toisen pelaajan varaama");
  });

  it("should return claimed anchor IDs", async () => {
    mockDb.where.mockResolvedValueOnce([{ anchorId: "kuilu" }, { anchorId: "kipina" }]);
    const result = await service.getClaimedAnchorIds();
    expect(result).toEqual(["kuilu", "kipina"]);
  });

  it("should find all characters with owner join and attach episodes", async () => {
    const charRow = { id: 1, userId: 2, name: "Hero", ownerName: "player1" };
    mockDb.leftJoin.mockResolvedValueOnce([charRow]);
    const result = await service.findAll();
    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toEqual([
      { ...charRow, episodes: [], monkPowers: [], hasPlayedSessions: false },
    ]);
  });

  it("should set hasPlayedSessions=false for a debut character with no played sessions", async () => {
    const charRow = { id: 5, userId: 3, name: "Rookie", ownerName: "newplayer" };
    mockDb.leftJoin.mockResolvedValueOnce([charRow]);
    const result = await service.findAll();
    expect(result[0].hasPlayedSessions).toBe(false);
  });

  it("should set hasPlayedSessions=true for a character with at least one played session", async () => {
    const charRow = { id: 7, userId: 4, name: "Veteran", ownerName: "veteran" };
    mockDb.leftJoin.mockResolvedValueOnce([charRow]);
    // linkRows empty, playedRows returns a match for characterId 7, monkPowers empty
    mockDb.orderBy
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ characterId: 7 }])
      .mockResolvedValueOnce([]);
    const result = await service.findAll();
    expect(result[0].hasPlayedSessions).toBe(true);
  });

  it("should allow owner to update their character", async () => {
    const character = { id: 1, userId: 42 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    const harmit = [{ text: "Palovamma", healed: false }];
    mockDb.returning.mockResolvedValueOnce([{ ...character, harmit }]);

    const result = await service.update(1, { harmit }, 42, "player");
    expect(result).toEqual({ ...character, harmit });
  });

  it("should allow gm to update any character", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    const harmit = [
      { text: "Murtuma", healed: false },
      { text: "Shokki", healed: true },
    ];
    mockDb.returning.mockResolvedValueOnce([{ ...character, harmit }]);

    const result = await service.update(1, { harmit }, 1, "gm");
    expect(result).toEqual({ ...character, harmit });
  });

  it("should throw ForbiddenException when non-owner player tries to update", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);

    await expect(
      service.update(1, { harmit: [{ text: "Haava", healed: false }] }, 1, "player"),
    ).rejects.toThrow(ForbiddenException);
  });

  it("should throw NotFoundException when updating non-existent character", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce(undefined);

    await expect(
      service.update(999, { harmit: [{ text: "Haava", healed: false }] }, 1, "player"),
    ).rejects.toThrow(NotFoundException);
  });

  it("should allow owner to delete their character", async () => {
    const character = { id: 1, userId: 42 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    mockDb.where.mockResolvedValueOnce(undefined);

    await expect(service.remove(1, 42, "player")).resolves.not.toThrow();
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it("should allow gm to delete any character", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);
    mockDb.where.mockResolvedValueOnce(undefined);

    await expect(service.remove(1, 1, "gm")).resolves.not.toThrow();
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it("should throw ForbiddenException when non-owner player tries to delete", async () => {
    const character = { id: 1, userId: 99 };
    mockDb.query.characters.findFirst.mockResolvedValueOnce(character);

    await expect(service.remove(1, 1, "player")).rejects.toThrow(ForbiddenException);
  });

  it("should link episode for owner when enrolled", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockDb.query.episodes.findFirst.mockResolvedValueOnce({ id: 2 });
    mockDb.limit
      .mockResolvedValueOnce([{ id: 99 }]) // enrollment exists
      .mockResolvedValueOnce([]); // no existing link

    const result = await service.linkEpisode(1, 2, 1);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(result).toEqual({ linked: true, alreadyLinked: false });
  });

  it("should be idempotent when link already exists", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockDb.query.episodes.findFirst.mockResolvedValueOnce({ id: 2 });
    mockDb.limit
      .mockResolvedValueOnce([{ id: 99 }]) // enrollment exists
      .mockResolvedValueOnce([{ id: 10 }]); // existing link

    const result = await service.linkEpisode(1, 2, 1);

    expect(result).toEqual({ linked: true, alreadyLinked: true });
  });

  it("should throw ForbiddenException when user is not enrolled", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockDb.query.episodes.findFirst.mockResolvedValueOnce({ id: 2 });
    mockDb.limit.mockResolvedValueOnce([]);

    await expect(service.linkEpisode(1, 2, 1)).rejects.toThrow(ForbiddenException);
  });

  it("should refresh linked character Kesto and Sisu once while leaving harmit unchanged", async () => {
    const existingHarmit = [{ text: "Haava", healed: false }];
    mockDb.query.characters.findFirst.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      keho: 10,
      currentKeho: 4,
      mieli: 9,
      currentMieli: 3,
      tera: 8,
      currentTera: 2,
      harmit: existingHarmit,
      removedFromPlayAt: null,
    });
    mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: null, advancedAt: null }]);

    const result = await service.refreshForEpisode(1, { episodeId: 2 }, 1);

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalledWith(
      expect.objectContaining({
        currentKeho: 10,
        currentMieli: 9,
        currentTera: 8,
        removedSisuIds: [],
      }),
    );
    expect(mockDb.set).not.toHaveBeenCalledWith(
      expect.objectContaining({
        harmit: expect.anything(),
      }),
    );
    expect(result).toEqual({ refreshed: true, alreadyRefreshed: false });
  });

  it("should not refresh already refreshed link", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      keho: 8,
      currentKeho: 8,
      mieli: 8,
      currentMieli: 8,
      tera: 8,
      currentTera: 8,
      harmit: [],
      removedFromPlayAt: null,
    });
    mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: new Date(), advancedAt: null }]);

    const result = await service.refreshForEpisode(1, { episodeId: 2 }, 1);
    expect(result).toEqual({ refreshed: true, alreadyRefreshed: true });
  });

  it("should advance linked character and snapshot", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      keho: 8,
      currentKeho: 8,
      mieli: 8,
      currentMieli: 8,
      tera: 8,
      currentTera: 8,
      sisuDice: [],
      skills: [],
      fysiikka: 0,
      nopeus: 0,
      ymmarrys: 0,
      persoona: 0,
      nakemys: 0,
      napparyys: 0,
    });
    mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: new Date(), advancedAt: null }]);
    mockDb.returning.mockResolvedValueOnce([{ id: 1, name: "Hero" }]);

    const result = await service.advanceForEpisode(
      1,
      { episodeId: 2, attribute: "fysiikka", reward: "skills_plus_n6", newSkills: ["Aseet"] },
      1,
    );

    expect(mockDb.insert).toHaveBeenCalled();
    expect(result.advanced).toBe(true);
    expect(result.alreadyAdvanced).toBe(false);
  });

  it("should advance linked character as monk with power selection", async () => {
    mockDb.query.characters.findFirst.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      keho: 8,
      currentKeho: 8,
      mieli: 8,
      currentMieli: 8,
      tera: 8,
      currentTera: 8,
      sisuDice: [],
      skills: [],
      fysiikka: 0,
      nopeus: 0,
      ymmarrys: 0,
      persoona: 0,
      nakemys: 0,
      napparyys: 0,
      monkAdvancementsAllowed: 1,
      monkAdvancementsUsed: 0,
    });
    mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: new Date(), advancedAt: null }]);
    // In advanceForEpisode when reward === 'munkki', the query is:
    // await this.db.select(...).from(characterMonkPowers).innerJoin(...).where(...)
    // Here where terminates the chain (await where(...))
    mockDb.where.mockImplementationOnce(() => mockDb); // for assertOwnedLinkedCharacter .where(...).limit(1)
    mockDb.where.mockResolvedValueOnce([]); // for currentPowers .where(...) -> resolves to empty array []
    const power = { id: 10, name: "Varjoharppaus", tier: 1 };
    mockDb.query.monkPowers.findFirst.mockResolvedValueOnce(power);
    mockDb.returning.mockResolvedValueOnce([{ id: 1, name: "Hero", monkAdvancementsUsed: 1 }]);

    const result = await service.advanceForEpisode(
      1,
      { episodeId: 2, attribute: "fysiikka", reward: "munkki", powerId: 10 },
      1,
    );

    expect(result.advanced).toBe(true);
    expect(result.alreadyAdvanced).toBe(false);
    expect(mockDb.insert).toHaveBeenCalled();
  });

  describe("rebellion skill (Kapinan riveissä taisteleva -> taistellut)", () => {
    it("should reject rebellion skill when creating a new character", async () => {
      mockDb.query.users.findFirst.mockResolvedValueOnce({ id: 1, rebellionLevel: 0 });

      await expect(
        service.create(
          {
            name: "Rookie",
            archetype: "Sotilas",
            keho: 8,
            mieli: 8,
            tera: 8,
            sisuDice: [],
            skills: [{ name: "Kapinan riveissä taisteleva", isCustom: false }],
          },
          1,
        ),
      ).rejects.toThrow("Tätä erikoistaitoa ei voi valita uutta hahmoa luodessa");
    });

    it("should automatically include locked 'Kapinan riveissä taistellut' on new characters when user has rebellionLevel >= 1", async () => {
      mockDb.query.users.findFirst.mockResolvedValueOnce({ id: 1, rebellionLevel: 1 });
      mockDb.returning.mockResolvedValueOnce([{ id: 10, name: "New Char" }]);

      await service.create(
        {
          name: "New Char",
          archetype: "Sotilas",
          keho: 8,
          mieli: 8,
          tera: 8,
          sisuDice: [],
          skills: [{ name: "Tarkkuusammunta", isCustom: false }],
        },
        1,
      );

      expect(mockDb.values).toHaveBeenCalledWith(
        expect.objectContaining({
          skills: [
            { name: "Tarkkuusammunta", isCustom: false },
            { name: "Kapinan riveissä taistellut", isCustom: false, locked: true },
          ],
        }),
      );
    });

    it("should transform 'Kapinan riveissä taisteleva' into locked 'Kapinan riveissä taistellut', set user rebellionLevel=1, and backfill other characters on advance", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        keho: 8,
        currentKeho: 8,
        mieli: 8,
        currentMieli: 8,
        tera: 8,
        currentTera: 8,
        sisuDice: [],
        skills: [{ name: "Hylkyjen tutkija", isCustom: false }],
        fysiikka: 0,
        nopeus: 0,
        ymmarrys: 0,
        persoona: 0,
        nakemys: 0,
        napparyys: 0,
      });
      mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: new Date(), advancedAt: null }]);
      mockDb.query.users.findFirst.mockResolvedValueOnce({ id: 1, rebellionLevel: 0 });
      mockDb.query.characters.findMany.mockResolvedValueOnce([
        { id: 1, userId: 1, skills: [{ name: "Hylkyjen tutkija", isCustom: false }] },
        { id: 2, userId: 1, skills: [{ name: "Lääketiede", isCustom: false }] },
      ]);
      mockDb.returning.mockResolvedValueOnce([{ id: 1, name: "Hero" }]);

      const result = await service.advanceForEpisode(
        1,
        {
          episodeId: 2,
          attribute: "fysiikka",
          reward: "skill_plus_n8",
          newSkills: ["Kapinan riveissä taisteleva"],
        },
        1,
      );

      expect(result.advanced).toBe(true);
      expect(mockDb.set).toHaveBeenCalledWith({ rebellionLevel: 1 });
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({
          skills: [
            { name: "Hylkyjen tutkija", isCustom: false },
            { name: "Kapinan riveissä taistellut", isCustom: false, locked: true },
          ],
        }),
      );
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({
          skills: [
            { name: "Lääketiede", isCustom: false },
            { name: "Kapinan riveissä taistellut", isCustom: false, locked: true },
          ],
        }),
      );
    });

    it("should reject selecting 'Kapinan riveissä taisteleva' if user already has rebellionLevel >= 1", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        keho: 8,
        currentKeho: 8,
        mieli: 8,
        currentMieli: 8,
        tera: 8,
        currentTera: 8,
        sisuDice: [],
        skills: [],
        fysiikka: 0,
        nopeus: 0,
        ymmarrys: 0,
        persoona: 0,
        nakemys: 0,
        napparyys: 0,
      });
      mockDb.limit.mockResolvedValueOnce([{ id: 123, refreshedAt: new Date(), advancedAt: null }]);
      mockDb.query.users.findFirst.mockResolvedValueOnce({ id: 1, rebellionLevel: 1 });

      await expect(
        service.advanceForEpisode(
          1,
          {
            episodeId: 2,
            attribute: "fysiikka",
            reward: "skill_plus_n8",
            newSkills: ["Kapinan riveissä taisteleva"],
          },
          1,
        ),
      ).rejects.toThrow("Pelaajalla on jo tämä taito");
    });

    it("should prevent removing or renaming 'Kapinan riveissä taistellut' in update", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        skills: [
          { name: "Lääketiede", isCustom: false },
          { name: "Kapinan riveissä taistellut", isCustom: false, locked: true },
        ],
      });

      await expect(
        service.update(1, { skills: [{ name: "Lääketiede", isCustom: false }] }, 1, "player"),
      ).rejects.toThrow("Lukittua erikoistaitoa ei voi muokata tai poistaa");
    });
  });

  describe("advanceAsMonk", () => {
    it("should throw NotFoundException if character not found", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce(null);
      await expect(service.advanceAsMonk(1, { powerId: 10 }, 1)).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if user does not own the character", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 1, userId: 99 });
      await expect(service.advanceAsMonk(1, { powerId: 10 }, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should throw BadRequestException if no monk advancements available", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        monkAdvancementsAllowed: 1,
        monkAdvancementsUsed: 1,
      });
      await expect(service.advanceAsMonk(1, { powerId: 10 }, 1)).rejects.toThrow(
        "No monk advancements available",
      );
    });

    it("should throw NotFoundException if power not found", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        monkAdvancementsAllowed: 2,
        monkAdvancementsUsed: 0,
      });
      mockDb.query.monkPowers.findFirst.mockResolvedValueOnce(null);
      await expect(service.advanceAsMonk(1, { powerId: 10 }, 1)).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException if character already has the power", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        monkAdvancementsAllowed: 2,
        monkAdvancementsUsed: 0,
      });
      mockDb.query.monkPowers.findFirst.mockResolvedValueOnce({
        id: 10,
        name: "Meditaatio",
        tier: 1,
      });
      mockDb.query.characterMonkPowers.findFirst.mockResolvedValueOnce({
        characterId: 1,
        powerId: 10,
      });
      await expect(service.advanceAsMonk(1, { powerId: 10 }, 1)).rejects.toThrow(
        "Character already has this power",
      );
    });

    it("should throw BadRequestException if tier pyramid requirement is not met", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        monkAdvancementsAllowed: 2,
        monkAdvancementsUsed: 0,
      });
      // Tier 2 power
      mockDb.query.monkPowers.findFirst.mockResolvedValueOnce({
        id: 20,
        name: "Levitaatio",
        tier: 2,
      });
      mockDb.query.characterMonkPowers.findFirst.mockResolvedValueOnce(null);
      // Hahmolla vain 1 tier 1 voima (tarvitaan 2)
      mockDb.where.mockResolvedValueOnce([{ tier: 1 }]);

      await expect(service.advanceAsMonk(1, { powerId: 20 }, 1)).rejects.toThrow(
        /Pyramid requirement not met/,
      );
    });

    it("should succeed when adding tier 1 power, add d4 sisu die and increment used counter", async () => {
      const char = {
        id: 1,
        userId: 1,
        monkAdvancementsAllowed: 2,
        monkAdvancementsUsed: 0,
        sisuDice: [{ id: "sisu-1", faces: 8 }],
        episodeId: 5,
      };
      mockDb.query.characters.findFirst.mockResolvedValueOnce(char);
      const power = { id: 10, name: "Varjoharppaus", tier: 1 };
      mockDb.query.monkPowers.findFirst.mockResolvedValueOnce(power);
      mockDb.query.characterMonkPowers.findFirst.mockResolvedValueOnce(null);
      mockDb.where.mockResolvedValueOnce([]); // no existing powers
      mockDb.returning.mockResolvedValueOnce([{ ...char, monkAdvancementsUsed: 1 }]);

      const result = await service.advanceAsMonk(1, { powerId: 10 }, 1);
      expect(result.advanced).toBe(true);
      expect(result.power).toEqual(power);
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalledTimes(2); // characterMonkPowers and characterArcSnapshots
    });

    it("should succeed when adding tier 2 power with 2 tier 1 powers", async () => {
      const char = {
        id: 1,
        userId: 1,
        monkAdvancementsAllowed: 3,
        monkAdvancementsUsed: 2,
        sisuDice: [],
        episodeId: null,
      };
      mockDb.query.characters.findFirst.mockResolvedValueOnce(char);
      const power = { id: 20, name: "Mielenrauha", tier: 2 };
      mockDb.query.monkPowers.findFirst.mockResolvedValueOnce(power);
      mockDb.query.characterMonkPowers.findFirst.mockResolvedValueOnce(null);
      // 2 tier 1 powers already owned
      mockDb.where.mockResolvedValueOnce([{ tier: 1 }, { tier: 1 }]);
      mockDb.returning.mockResolvedValueOnce([{ ...char, monkAdvancementsUsed: 3 }]);

      const result = await service.advanceAsMonk(1, { powerId: 20 }, 1);
      expect(result.advanced).toBe(true);
      expect(result.power).toEqual(power);
    });
  });

  describe("exportMarkdown", () => {
    it("should return placeholder when no characters exist", async () => {
      mockDb.leftJoin.mockResolvedValueOnce([]);
      const result = await service.exportMarkdown();
      expect(result).toEqual({
        filename: "Hahmot.md",
        markdown: "# Hahmot\n\nEi hahmoja tietokannassa.\n",
      });
    });

    it("should export characters grouped by player with decoded dice and tolerate missing ship tables", async () => {
      const charRow = {
        id: 1,
        userId: 10,
        name: "Jackslaw",
        archetype: "Sotilas",
        sex: "male",
        motivation: "Vapauttaa veljensä.",
        notes: "Koodinimi Syy",
        nicknames: ["Syy"],
        keho: 11,
        currentKeho: 9,
        mieli: 8,
        currentMieli: 8,
        tera: 8,
        currentTera: 7,
        sisuDice: [
          { id: "s1", faces: 8 },
          { id: "s2", faces: 8 },
          { id: "s3", faces: 8 },
        ],
        removedSisuIds: ["s3"],
        harmit: [{ text: "Ruhje", healed: false }],
        skills: [
          { name: "Hylkyjen tutkija", isCustom: false },
          { name: "Katutappelu", isCustom: true },
        ],
        inventory: [{ id: "i1", name: "Sädepistooli", quantity: 1 }],
        fysiikka: 4, // 1n6, 1n4
        nopeus: 0,
        ymmarrys: 0,
        persoona: 0,
        nakemys: 0,
        napparyys: 0,
        anchorId: "kuilu",
        rebellionLevel: 0,
        monkAdvancementsAllowed: 1,
        monkAdvancementsUsed: 1,
        removedFromPlayAt: null,
        ownerName: "Pekka",
      };

      mockDb.leftJoin.mockResolvedValueOnce([charRow]);
      mockDb.orderBy
        .mockResolvedValueOnce([
          {
            characterId: 1,
            id: 2,
            title: "Ohjainlevy",
            status: "completed",
            refreshedAt: null,
            advancedAt: null,
          },
        ])
        .mockResolvedValueOnce([{ characterId: 1 }])
        .mockResolvedValueOnce([
          {
            characterId: 1,
            id: 5,
            name: "Varjoaskel",
            tier: 1,
            description: "Katoaa varjoihin.",
            properties: { Kesto: "1 kohtaus" },
            acquiredAt: new Date("2026-04-01T12:00:00Z"),
          },
        ]);
      mockDb.execute = vi.fn().mockRejectedValue(new Error('relation "ship_rooms" does not exist'));

      const result = await service.exportMarkdown();

      expect(result.filename).toBe("Hahmot.md");
      expect(result.markdown).toContain("## Pelaaja: Pekka");
      expect(result.markdown).toContain("### Jackslaw");
      expect(result.markdown).toContain("- **Arkkityyppi:** Sotilas");
      expect(result.markdown).toContain("- **Sukupuoli:** Mies");
      expect(result.markdown).toContain("- **Lempinimet:** Syy");
      expect(result.markdown).toContain("- **Pelaajan Ankkuri:** `kuilu`");
      expect(result.markdown).toContain("- **Keho:** 9 / 11 *(Fysiikka: 1n6, 1n4, Nopeus: —)*");
      expect(result.markdown).toContain("- **Sisu:** 2×n8 *(käytetty: 1×n8)*");
      expect(result.markdown).toContain("  - Ruhje *(aktiivinen)*");
      expect(result.markdown).toContain("- Katutappelu *(oma taito)*");
      expect(result.markdown).toContain("- **Varjoaskel** (1. piiri)");
      expect(result.markdown).toContain("- Sädepistooli");
      expect(result.markdown).toContain("Vapauttaa veljensä.");
      expect(result.markdown).toContain("Koodinimi Syy");
      expect(result.markdown).not.toContain("Aamunkoi");
    });

    it("should include Aamunkoi cabin, possessions, and clocks when ship tables exist", async () => {
      const charRow = {
        id: 2,
        userId: 11,
        name: "Shael",
        archetype: "Ekspertti",
        sex: "non-binary",
        motivation: null,
        notes: null,
        nicknames: [],
        keho: 8,
        currentKeho: 8,
        mieli: 8,
        currentMieli: 8,
        tera: 8,
        currentTera: 8,
        sisuDice: [],
        removedSisuIds: [],
        harmit: [],
        skills: [],
        inventory: [],
        fysiikka: 0,
        nopeus: 0,
        ymmarrys: 0,
        persoona: 0,
        nakemys: 0,
        napparyys: 0,
        anchorId: null,
        rebellionLevel: 0,
        monkAdvancementsAllowed: 0,
        monkAdvancementsUsed: 0,
        removedFromPlayAt: null,
        ownerName: "Taija",
      };

      mockDb.leftJoin.mockResolvedValueOnce([charRow]);
      mockDb.orderBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      mockDb.execute = vi
        .fn()
        .mockResolvedValueOnce({
          rows: [
            {
              claimed_by_character_id: 2,
              key: "cabin-a01",
              deck_number: 1,
              name: "Hytti A-01",
              cabin_custom_title: "Seurauksen kajuutta",
              cabin_decoration: "Kultainen kompassi seinällä",
              gm_room_notes: "Piilotettu lokero sängyn alla",
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              character_id: 2,
              name: "Rukousnauha",
              description: "Ekklesian muisto",
              gm_mechanical_notes: "+1n4 stressiin",
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              character_id: 2,
              category: "tutkimus",
              title: "Purppuravälähdysten alkuperä",
              description: "Analysoidaan nauhoituksia",
              segments_filled: 3,
              segments_total: 6,
              status: "active",
              completion_notes: null,
            },
          ],
        });

      const result = await service.exportMarkdown();

      expect(result.markdown).toContain("#### Aamunkoi (Hytti ja omaisuus)");
      expect(result.markdown).toContain("- **Hytti:** Seurauksen kajuutta (Kansi 1, `cabin-a01`)");
      expect(result.markdown).toContain("- **Hytin sisustus:** Kultainen kompassi seinällä");
      expect(result.markdown).toContain(
        "- **PJ-muistiinpanot hytistä:** Piilotettu lokero sängyn alla",
      );
      expect(result.markdown).toContain(
        "  - **Rukousnauha** — Ekklesian muisto *(Mekaniikka: +1n4 stressiin)*",
      );
      expect(result.markdown).toContain(
        "  - **Purppuravälähdysten alkuperä** (Tutkimus, 3/6, aktiivinen) — Analysoidaan nauhoituksia",
      );
    });

    it("should render Julkinen kuvaus and Yksityiset muistiinpanot in exported markdown", async () => {
      const charRow = {
        id: 3,
        userId: 12,
        name: "Vesper",
        archetype: "Ekspertti",
        sex: "female",
        motivation: null,
        notes: "Arpinen mekaanikko satamasta.",
        nicknames: [],
        keho: 8,
        currentKeho: 8,
        mieli: 8,
        currentMieli: 8,
        tera: 8,
        currentTera: 8,
        sisuDice: [],
        removedSisuIds: [],
        harmit: [],
        skills: [],
        inventory: [],
        fysiikka: 0,
        nopeus: 0,
        ymmarrys: 0,
        persoona: 0,
        nakemys: 0,
        napparyys: 0,
        anchorId: null,
        rebellionLevel: 0,
        monkAdvancementsAllowed: 0,
        monkAdvancementsUsed: 0,
        removedFromPlayAt: null,
        ownerName: "Aino",
      };

      mockDb.leftJoin.mockResolvedValueOnce([charRow]);
      mockDb.orderBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      mockDb.execute = vi
        .fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [
            {
              character_id: 3,
              title: "Epäilty kontakti",
              content: "Ratasvartion luutnantti tietää oikean nimeni.",
              is_pinned: true,
              created_at: new Date("2026-11-20T10:00:00Z"),
              episode_title: "Ohjainlevy",
            },
          ],
        });

      const result = await service.exportMarkdown();

      expect(result.markdown).toContain("#### Julkinen kuvaus");
      expect(result.markdown).toContain("Arpinen mekaanikko satamasta.");
      expect(result.markdown).toContain("#### Yksityiset muistiinpanot");
      expect(result.markdown).toContain("##### Epäilty kontakti *(kiinnitetty, Jakso: Ohjainlevy");
      expect(result.markdown).toContain("Ratasvartion luutnantti tietää oikean nimeni.");
    });
  });

  describe("private notes", () => {
    it("allows character owner and GM to list private notes, but forbids other players", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      mockDb.orderBy.mockResolvedValueOnce([
        { id: 101, characterId: 5, title: "Salaisuus", content: "Viesti", isPinned: true },
      ]);
      const ownerNotes = await service.listPrivateNotes(5, 10, "player");
      expect(ownerNotes).toHaveLength(1);

      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      mockDb.orderBy.mockResolvedValueOnce([
        { id: 101, characterId: 5, title: "Salaisuus", content: "Viesti", isPinned: true },
      ]);
      const gmNotes = await service.listPrivateNotes(5, 99, "gm");
      expect(gmNotes).toHaveLength(1);

      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      await expect(service.listPrivateNotes(5, 22, "player")).rejects.toThrow(ForbiddenException);
    });

    it("allows only character owner to create, update, and delete private notes (blocks GM on another player's character)", async () => {
      // GM blocked from creating on player 10's character
      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      await expect(
        service.createPrivateNote(5, { content: "PJ ei saa kirjoittaa tätä" }, 99),
      ).rejects.toThrow(ForbiddenException);

      // Owner succeeds with episode check
      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      mockDb.limit.mockResolvedValueOnce([{ id: 77 }]);
      mockDb.returning.mockResolvedValueOnce([
        {
          id: 201,
          characterId: 5,
          episodeId: 2,
          title: "Johtolanka",
          content: "Koodi on 4419",
          isPinned: true,
        },
      ]);

      const created = await service.createPrivateNote(
        5,
        { title: "  Johtolanka  ", content: "  Koodi on 4419  ", episodeId: 2, isPinned: true },
        10,
      );
      expect(created.title).toBe("Johtolanka");

      // GM blocked from updating and deleting on player 10's character
      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      await expect(service.updatePrivateNote(5, 201, { isPinned: false }, 99)).rejects.toThrow(
        ForbiddenException,
      );

      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      await expect(service.removePrivateNote(5, 201, 99)).rejects.toThrow(ForbiddenException);

      // Owner can update and delete
      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      mockDb.query.characterPrivateNotes.findFirst.mockResolvedValueOnce({
        id: 201,
        characterId: 5,
      });
      mockDb.returning.mockResolvedValueOnce([{ id: 201, characterId: 5, isPinned: false }]);
      const updated = await service.updatePrivateNote(5, 201, { isPinned: false }, 10);
      expect(updated.isPinned).toBe(false);

      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      mockDb.query.characterPrivateNotes.findFirst.mockResolvedValueOnce({
        id: 201,
        characterId: 5,
      });
      const removed = await service.removePrivateNote(5, 201, 10);
      expect(removed).toEqual({ deleted: true });
    });

    it("rejects linking a private note to an episode the character does not belong to", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({ id: 5, userId: 10 });
      mockDb.limit.mockResolvedValueOnce([]);

      await expect(
        service.createPrivateNote(5, { content: "Merkintä", episodeId: 999 }, 10),
      ).rejects.toThrow(BadRequestException);
    });

    it("migrates public character notes into a private note and clears characters.notes", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 5,
        userId: 10,
        notes: "  Vanha teksti, joka halutaan piiloon  ",
      });
      mockDb.returning.mockResolvedValueOnce([
        {
          id: 301,
          characterId: 5,
          title: null,
          content: "Vanha teksti, joka halutaan piiloon",
          isPinned: false,
        },
      ]);

      const res = await service.migratePublicNotesToPrivate(5, 10);
      expect(res.migrated).toBe(true);
      expect(res.note.content).toBe("Vanha teksti, joka halutaan piiloon");
      expect(mockDb.set).toHaveBeenCalledWith(expect.objectContaining({ notes: null }));
    });

    it("creates initial private note inside character creation transaction when provided", async () => {
      mockDb.query.users.findFirst.mockResolvedValueOnce({ id: 1, rebellionLevel: 0 });
      mockDb.returning.mockResolvedValueOnce([{ id: 42, name: "Uusi", userId: 1 }]);

      await service.create(
        {
          name: "Uusi",
          archetype: "Sotilas",
          episodeId: 3,
          keho: 8,
          mieli: 8,
          tera: 8,
          sisuDice: [{ id: "s1", faces: 8 }],
          skills: [],
          initialPrivateNote: "  Ensimmäinen salaisuus  ",
        },
        1,
      );

      // characters + characterEpisodes + characterPrivateNotes = 3 inserts
      expect(mockDb.insert).toHaveBeenCalledTimes(3);
      expect(mockDb.values).toHaveBeenCalledWith(
        expect.objectContaining({
          characterId: 42,
          episodeId: 3,
          content: "Ensimmäinen salaisuus",
        }),
      );
    });
  });

  describe("tattoos", () => {
    it("normalizes, sorts, and persists tattoos within monkAdvancementsAllowed", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 11,
        userId: 5,
        monkAdvancementsAllowed: 2,
        tattoos: [],
        harmit: [],
        skills: [],
      });
      mockDb.returning.mockResolvedValueOnce([
        {
          id: 11,
          tattoos: [
            { slot: 1, title: "Sininen kala" },
            { slot: 2, title: "Laiskiainen", description: "Oikeassa käsivarressa (Aseesta)" },
          ],
        },
      ]);

      await service.update(
        11,
        {
          tattoos: [
            {
              slot: 2,
              title: "  Laiskiainen  ",
              description: "  Oikeassa käsivarressa (Aseesta)  ",
            },
            { slot: 1, title: "  Sininen kala  ", description: "   " },
          ],
        },
        5,
        "player",
      );

      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({
          tattoos: [
            { slot: 1, title: "Sininen kala" },
            { slot: 2, title: "Laiskiainen", description: "Oikeassa käsivarressa (Aseesta)" },
          ],
        }),
      );
    });

    it("rejects empty title, duplicate slots, and new slots above monkAdvancementsAllowed", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 11,
        userId: 5,
        monkAdvancementsAllowed: 2,
        tattoos: [],
        harmit: [],
        skills: [],
      });
      await expect(
        service.update(11, { tattoos: [{ slot: 1, title: "   " }] }, 5, "player"),
      ).rejects.toThrow(BadRequestException);

      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 11,
        userId: 5,
        monkAdvancementsAllowed: 2,
        tattoos: [],
        harmit: [],
        skills: [],
      });
      await expect(
        service.update(
          11,
          {
            tattoos: [
              { slot: 1, title: "Kala" },
              { slot: 1, title: "Laiskiainen" },
            ],
          },
          5,
          "player",
        ),
      ).rejects.toThrow(BadRequestException);

      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 11,
        userId: 5,
        monkAdvancementsAllowed: 1,
        tattoos: [],
        harmit: [],
        skills: [],
      });
      await expect(
        service.update(11, { tattoos: [{ slot: 2, title: "Laiskiainen" }] }, 5, "player"),
      ).rejects.toThrow(BadRequestException);
    });

    it("preserves editing or clearing an existing tattoo above lowered potential while blocking new ones", async () => {
      mockDb.query.characters.findFirst.mockResolvedValueOnce({
        id: 11,
        userId: 5,
        monkAdvancementsAllowed: 1,
        tattoos: [
          { slot: 1, title: "Kala" },
          { slot: 2, title: "Vanha merkki" },
        ],
        harmit: [],
        skills: [],
      });
      mockDb.returning.mockResolvedValueOnce([
        {
          id: 11,
          tattoos: [
            { slot: 1, title: "Kala" },
            { slot: 2, title: "Päivitetty merkki" },
          ],
        },
      ]);

      await service.update(
        11,
        {
          tattoos: [
            { slot: 1, title: "Kala" },
            { slot: 2, title: "Päivitetty merkki" },
          ],
        },
        5,
        "player",
      );

      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({
          tattoos: [
            { slot: 1, title: "Kala" },
            { slot: 2, title: "Päivitetty merkki" },
          ],
        }),
      );
    });

    it("exports Tatuoinnit section with described and undescribed slots in markdown export", async () => {
      const charWithPotential = {
        id: 21,
        userId: 12,
        name: "Holti",
        archetype: "Ekspertti",
        sex: "male",
        motivation: null,
        notes: null,
        nicknames: [],
        keho: 8,
        currentKeho: 8,
        mieli: 8,
        currentMieli: 8,
        tera: 8,
        currentTera: 8,
        sisuDice: [],
        removedSisuIds: [],
        harmit: [],
        skills: [],
        inventory: [],
        fysiikka: 0,
        nopeus: 0,
        ymmarrys: 0,
        persoona: 0,
        nakemys: 0,
        napparyys: 0,
        anchorId: null,
        rebellionLevel: 0,
        monkAdvancementsAllowed: 2,
        monkAdvancementsUsed: 0,
        tattoos: [
          {
            slot: 1,
            title: "Kirkkaansininen kalatatuointi",
            description: "Oikeassa käsivarressa (Painajaisesta).",
          },
        ],
        removedFromPlayAt: null,
        ownerName: "Aino",
      };

      mockDb.leftJoin.mockResolvedValueOnce([charWithPotential]);
      mockDb.orderBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      mockDb.execute = vi
        .fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await service.exportMarkdown();

      expect(result.markdown).toContain("#### Tatuoinnit");
      expect(result.markdown).toContain("- **Tatuoinnit:** 1 / 2 kuvattu");
      expect(result.markdown).toContain("- **Tatuointi 1 — Kirkkaansininen kalatatuointi**");
      expect(result.markdown).toContain("  - Oikeassa käsivarressa (Painajaisesta).");
      expect(result.markdown).toContain("- **Tatuointi 2:** *Ei vielä kuvailtu.*");
      expect(result.markdown.indexOf("#### Tatuoinnit")).toBeLessThan(
        result.markdown.indexOf("#### Munkin voimat"),
      );
    });
  });
});
