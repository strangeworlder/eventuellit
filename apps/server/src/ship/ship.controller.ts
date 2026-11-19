import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { type AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { ClaimCabinDto } from "./dto/claim-cabin.dto";
import { CreatePossessionDto } from "./dto/create-possession.dto";
import { CreateShipClockDto } from "./dto/create-ship-clock.dto";
import { CreateShipRoomDto } from "./dto/create-ship-room.dto";
import { DowntimeAllocationDto } from "./dto/downtime-allocation.dto";
import { UpdateCabinInteriorDto } from "./dto/update-cabin-interior.dto";
import { UpdatePossessionDto } from "./dto/update-possession.dto";
import { UpdateShipClockDto } from "./dto/update-ship-clock.dto";
import { UpdateShipConfigDto } from "./dto/update-ship-config.dto";
import { UpdateShipRoomDto } from "./dto/update-ship-room.dto";
import { ShipService } from "./ship.service";

@Controller("ship")
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @UseGuards(JwtAuthGuard)
  @Get("overview")
  getOverview(@CurrentUser() user: AuthUser) {
    return this.shipService.getOverview(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch("config")
  updateConfig(@Body() dto: UpdateShipConfigDto) {
    return this.shipService.updateConfig(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Post("rooms")
  createRoom(@Body() dto: CreateShipRoomDto) {
    return this.shipService.createRoom(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch("rooms/:key")
  updateRoom(@Param("key") key: string, @Body() dto: UpdateShipRoomDto) {
    return this.shipService.updateRoom(key, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("rooms/:key/claim")
  claimCabin(@Param("key") key: string, @Body() dto: ClaimCabinDto, @CurrentUser() user: AuthUser) {
    return this.shipService.claimCabin(key, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("rooms/:key/vacate")
  vacateCabin(@Param("key") key: string, @CurrentUser() user: AuthUser) {
    return this.shipService.vacateCabin(key, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("cabins/:characterId")
  getCabinDetails(
    @Param("characterId", ParseIntPipe) characterId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.shipService.getCabinDetails(characterId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("cabins/:characterId")
  updateCabinInterior(
    @Param("characterId", ParseIntPipe) characterId: number,
    @Body() dto: UpdateCabinInteriorDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.shipService.updateCabinInterior(characterId, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("cabins/:characterId/possessions")
  createPossession(
    @Param("characterId", ParseIntPipe) characterId: number,
    @Body() dto: CreatePossessionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.shipService.createPossession(characterId, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("possessions/:id")
  updatePossession(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePossessionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.shipService.updatePossession(id, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("possessions/:id")
  deletePossession(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.shipService.deletePossession(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("clocks")
  listClocks(@CurrentUser() user: AuthUser) {
    return this.shipService.listClocks(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("clocks")
  createClock(@Body() dto: CreateShipClockDto, @CurrentUser() user: AuthUser) {
    return this.shipService.createClock(dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch("clocks/:id")
  updateClock(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateShipClockDto) {
    return this.shipService.updateClock(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Delete("clocks/:id")
  deleteClock(@Param("id", ParseIntPipe) id: number) {
    return this.shipService.deleteClock(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("downtime/:characterId")
  getCharacterDowntime(
    @Param("characterId", ParseIntPipe) characterId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.shipService.getCharacterDowntime(characterId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put("downtime/:characterId/draft")
  saveDowntimeDraft(
    @Param("characterId", ParseIntPipe) characterId: number,
    @Body() dto: DowntimeAllocationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.shipService.saveDowntimeDraft(characterId, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("downtime/:characterId/resolve")
  resolveDowntime(
    @Param("characterId", ParseIntPipe) characterId: number,
    @Body() dto: DowntimeAllocationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.shipService.resolveDowntime(characterId, dto, user);
  }
}
