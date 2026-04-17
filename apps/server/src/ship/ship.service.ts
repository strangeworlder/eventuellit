import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { eq, inArray } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import {
  characters,
  roomOccupancies,
  shipRooms,
  ships,
  users,
} from "../db/schema";
import type { AddOccupantDto } from "./dto/add-occupant.dto";
import type { UpdateRoomDto } from "./dto/update-room.dto";

type UserRole = { id: number; role: string };

/** Derive the editable state of a room for a given user. */
function canEdit(
  room: typeof shipRooms.$inferSelect,
  user: UserRole,
): boolean {
  if (user.role === "gm") return true;
  if (room.isLocked) return false;
  // Frozen pending-claim state — nobody (except GM) can edit
  if (room.claimantId !== null && room.ownerId === null) return false;
  // Owned room — only the owner can edit
  if (room.ownerId !== null) return room.ownerId === user.id;
  // Unclaimed — anyone can edit
  return true;
}

@Injectable()
export class ShipService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  // ── Ship & rooms overview ──────────────────────────────────────────────────

  async getShip() {
    const ship = await this.db.query.ships.findFirst();
    if (!ship) throw new NotFoundException("Alusta ei löydy");

    const rooms = await this.db
      .select({
        id: shipRooms.id,
        shipId: shipRooms.shipId,
        svgElementId: shipRooms.svgElementId,
        name: shipRooms.name,
        function: shipRooms.function,
        contents: shipRooms.contents,
        ownerId: shipRooms.ownerId,
        claimantId: shipRooms.claimantId,
        isLocked: shipRooms.isLocked,
        ownerName: users.username,
        createdAt: shipRooms.createdAt,
        updatedAt: shipRooms.updatedAt,
      })
      .from(shipRooms)
      .leftJoin(users, eq(shipRooms.ownerId, users.id))
      .where(eq(shipRooms.shipId, ship.id));

    const roomIds = rooms.map((r) => r.id);
    const occupancies =
      roomIds.length > 0
        ? await this.db
            .select({
              roomId: roomOccupancies.roomId,
              characterId: characters.id,
              characterName: characters.name,
              archetype: characters.archetype,
              userId: characters.userId,
            })
            .from(roomOccupancies)
            .innerJoin(characters, eq(roomOccupancies.characterId, characters.id))
            .where(inArray(roomOccupancies.roomId, roomIds))
        : [];

    const occupancyMap = new Map<
      number,
      Array<{
        characterId: number;
        characterName: string;
        archetype: string;
        userId: number;
      }>
    >();
    for (const o of occupancies) {
      const list = occupancyMap.get(o.roomId) ?? [];
      list.push({
        characterId: o.characterId,
        characterName: o.characterName,
        archetype: o.archetype,
        userId: o.userId,
      });
      occupancyMap.set(o.roomId, list);
    }

    return {
      ...ship,
      rooms: rooms.map((r) => ({ ...r, occupants: occupancyMap.get(r.id) ?? [] })),
    };
  }

  // ── Single room ────────────────────────────────────────────────────────────

  async getRoom(id: number) {
    const rows = await this.db
      .select({
        id: shipRooms.id,
        shipId: shipRooms.shipId,
        svgElementId: shipRooms.svgElementId,
        name: shipRooms.name,
        function: shipRooms.function,
        contents: shipRooms.contents,
        ownerId: shipRooms.ownerId,
        claimantId: shipRooms.claimantId,
        isLocked: shipRooms.isLocked,
        ownerName: users.username,
        createdAt: shipRooms.createdAt,
        updatedAt: shipRooms.updatedAt,
      })
      .from(shipRooms)
      .leftJoin(users, eq(shipRooms.ownerId, users.id))
      .where(eq(shipRooms.id, id));

    const room = rows[0];
    if (!room) throw new NotFoundException("Huonetta ei löydy");

    const occupants = await this.db
      .select({
        characterId: characters.id,
        characterName: characters.name,
        archetype: characters.archetype,
        userId: characters.userId,
      })
      .from(roomOccupancies)
      .innerJoin(characters, eq(roomOccupancies.characterId, characters.id))
      .where(eq(roomOccupancies.roomId, id));

    return { ...room, occupants };
  }

  // ── Edit room content ──────────────────────────────────────────────────────

  async updateRoom(id: number, dto: UpdateRoomDto, user: UserRole) {
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.id, id),
    });
    if (!room) throw new NotFoundException("Huonetta ei löydy");
    if (!canEdit(room, user)) {
      throw new ForbiddenException("Sinulla ei ole oikeutta muokata tätä huonetta");
    }

    const result = await this.db
      .update(shipRooms)
      .set({ function: dto.function, contents: dto.contents, updatedAt: new Date() })
      .where(eq(shipRooms.id, id))
      .returning();

    return result[0];
  }

  // ── Occupancy ──────────────────────────────────────────────────────────────

  async addOccupant(roomId: number, dto: AddOccupantDto, user: UserRole) {
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.id, roomId),
    });
    if (!room) throw new NotFoundException("Huonetta ei löydy");
    if (!canEdit(room, user)) {
      throw new ForbiddenException("Sinulla ei ole oikeutta muokata tätä huonetta");
    }

    const existing = await this.db.query.roomOccupancies.findFirst({
      where: (t) =>
        eq(t.roomId, roomId) && eq(t.characterId, dto.characterId),
    });
    if (existing) return existing;

    const result = await this.db
      .insert(roomOccupancies)
      .values({ roomId, characterId: dto.characterId })
      .returning();
    return result[0];
  }

  async removeOccupant(roomId: number, characterId: number, user: UserRole) {
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.id, roomId),
    });
    if (!room) throw new NotFoundException("Huonetta ei löydy");
    if (!canEdit(room, user)) {
      throw new ForbiddenException("Sinulla ei ole oikeutta muokata tätä huonetta");
    }

    await this.db
      .delete(roomOccupancies)
      .where(
        eq(roomOccupancies.roomId, roomId) &&
          eq(roomOccupancies.characterId, characterId),
      );
  }

  // ── Claim workflow ─────────────────────────────────────────────────────────

  /** Player suggests ownership: sets claimantId, freezes room. */
  async suggestClaim(roomId: number, user: UserRole) {
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.id, roomId),
    });
    if (!room) throw new NotFoundException("Huonetta ei löydy");
    if (room.ownerId !== null) {
      throw new ForbiddenException("Huoneella on jo omistaja");
    }
    if (room.claimantId !== null) {
      throw new ForbiddenException("Huoneella on jo odottava hakemus");
    }

    const result = await this.db
      .update(shipRooms)
      .set({ claimantId: user.id, updatedAt: new Date() })
      .where(eq(shipRooms.id, roomId))
      .returning();
    return result[0];
  }

  /** GM approves a pending claim: promotes claimantId → ownerId. */
  async approveClaim(roomId: number, user: UserRole) {
    if (user.role !== "gm") {
      throw new ForbiddenException("Vain pelinjohtaja voi hyväksyä hakemuksen");
    }
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.id, roomId),
    });
    if (!room) throw new NotFoundException("Huonetta ei löydy");
    if (room.claimantId === null) {
      throw new ForbiddenException("Ei odottavaa hakemusta");
    }

    const result = await this.db
      .update(shipRooms)
      .set({ ownerId: room.claimantId, claimantId: null, updatedAt: new Date() })
      .where(eq(shipRooms.id, roomId))
      .returning();
    return result[0];
  }

  /** GM rejects a pending claim: clears claimantId, room goes back to unclaimed. */
  async rejectClaim(roomId: number, user: UserRole) {
    if (user.role !== "gm") {
      throw new ForbiddenException("Vain pelinjohtaja voi hylätä hakemuksen");
    }
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.id, roomId),
    });
    if (!room) throw new NotFoundException("Huonetta ei löydy");

    const result = await this.db
      .update(shipRooms)
      .set({ claimantId: null, updatedAt: new Date() })
      .where(eq(shipRooms.id, roomId))
      .returning();
    return result[0];
  }

  /** GM toggles isLocked on a room. */
  async toggleLock(roomId: number, user: UserRole) {
    if (user.role !== "gm") {
      throw new ForbiddenException("Vain pelinjohtaja voi lukita huoneen");
    }
    const room = await this.db.query.shipRooms.findFirst({
      where: eq(shipRooms.id, roomId),
    });
    if (!room) throw new NotFoundException("Huonetta ei löydy");

    const result = await this.db
      .update(shipRooms)
      .set({ isLocked: !room.isLocked, updatedAt: new Date() })
      .where(eq(shipRooms.id, roomId))
      .returning();
    return result[0];
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  /** Used by controller to verify a ship exists without returning data. */
  async ensureShipExists() {
    const ship = await this.db.query.ships.findFirst();
    if (!ship) throw new NotFoundException("Alusta ei löydy");
    return ship;
  }
}
