import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { type AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard";
import { UpsertSessionPlayerRecapDto } from "./dto/upsert-session-player-recap.dto";
import { SessionRecapsService } from "./session-recaps.service";

@Controller("session-recaps")
export class SessionRecapsController {
  constructor(private readonly sessionRecapsService: SessionRecapsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findBySession(@Query("sessionId", ParseIntPipe) sessionId: number, @Req() req: Request) {
    // OptionalJwtAuthGuard may or may not populate req.user
    const user: { id: number; role: string } | undefined = (req as any).user;
    return this.sessionRecapsService.findBySession(sessionId, user ?? null);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  upsert(@Body() dto: UpsertSessionPlayerRecapDto, @CurrentUser() user: AuthUser) {
    return this.sessionRecapsService.upsert(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.sessionRecapsService.remove(id, user);
  }
}
