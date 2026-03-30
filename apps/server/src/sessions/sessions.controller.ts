import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard";
import { EpisodePlayersService } from "../episode-players/episode-players.service";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";

function ensureGm(req: Request) {
  const user = (req as any).user;
  if (!user || user.role !== "gm") {
    throw new ForbiddenException("Only GMs can perform this action");
  }
  return user;
}

@Controller("sessions")
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly episodePlayersService: EpisodePlayersService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findByEpisode(
    @Query("episodeId", ParseIntPipe) episodeId: number,
    @Req() req: Request,
  ) {
    const user: { id: number; role: string } | undefined = (req as any).user;
    if (user) {
      await this.episodePlayersService.assertEnrolled(episodeId, user.id, user.role);
    }
    return this.sessionsService.findByEpisode(episodeId, user ?? null);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSessionDto, @Req() req: Request) {
    ensureGm(req);
    return this.sessionsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSessionDto,
    @Req() req: Request,
  ) {
    ensureGm(req);
    return this.sessionsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    ensureGm(req);
    return this.sessionsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("migrate/:episodeId")
  migrate(
    @Param("episodeId", ParseIntPipe) episodeId: number,
    @Req() req: Request,
  ) {
    ensureGm(req);
    return this.sessionsService.migrateFromEpisodeDates(episodeId);
  }
}
