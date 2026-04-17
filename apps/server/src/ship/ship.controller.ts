import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { AddOccupantDto } from "./dto/add-occupant.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { ShipService } from "./ship.service";

@UseGuards(JwtAuthGuard)
@Controller("ship")
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  /** GET /ship — full ship overview with all rooms and occupancy */
  @Get()
  getShip() {
    return this.shipService.getShip();
  }

  /** GET /ship/rooms/:id — single room with occupants */
  @Get("rooms/:id")
  getRoom(@Param("id", ParseIntPipe) id: number) {
    return this.shipService.getRoom(id);
  }

  /** PATCH /ship/rooms/:id — edit room function and/or contents */
  @Patch("rooms/:id")
  updateRoom(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user as { id: number; role: string };
    return this.shipService.updateRoom(id, dto, user);
  }

  /** POST /ship/rooms/:id/occupants — add a character to the room */
  @Post("rooms/:id/occupants")
  addOccupant(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AddOccupantDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user as { id: number; role: string };
    return this.shipService.addOccupant(id, dto, user);
  }

  /** DELETE /ship/rooms/:id/occupants/:characterId — remove a character */
  @Delete("rooms/:id/occupants/:characterId")
  removeOccupant(
    @Param("id", ParseIntPipe) id: number,
    @Param("characterId", ParseIntPipe) characterId: number,
    @Req() req: Request,
  ) {
    const user = (req as any).user as { id: number; role: string };
    return this.shipService.removeOccupant(id, characterId, user);
  }

  /** POST /ship/rooms/:id/claim — player suggests ownership */
  @Post("rooms/:id/claim")
  suggestClaim(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = (req as any).user as { id: number; role: string };
    return this.shipService.suggestClaim(id, user);
  }

  /** POST /ship/rooms/:id/approve-claim — GM promotes claim → owner */
  @Post("rooms/:id/approve-claim")
  approveClaim(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = (req as any).user as { id: number; role: string };
    return this.shipService.approveClaim(id, user);
  }

  /** POST /ship/rooms/:id/reject-claim — GM clears pending claim */
  @Post("rooms/:id/reject-claim")
  rejectClaim(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = (req as any).user as { id: number; role: string };
    return this.shipService.rejectClaim(id, user);
  }

  /** PATCH /ship/rooms/:id/lock — GM toggles lock */
  @Patch("rooms/:id/lock")
  toggleLock(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = (req as any).user as { id: number; role: string };
    return this.shipService.toggleLock(id, user);
  }
}
