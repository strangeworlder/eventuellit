import {
  Body,
  Controller,
  Delete,
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
import { type AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { EpisodePlayersService } from "../episode-players/episode-players.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { SessionsService } from "./sessions.service";

@Controller("sessions")
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly episodePlayersService: EpisodePlayersService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findByEpisode(@Query("episodeId", ParseIntPipe) episodeId: number, @Req() req: Request) {
    const user: { id: number; role: string } | undefined = (req as any).user;
    if (user) {
      await this.episodePlayersService.assertEnrolled(episodeId, user.id, user.role);
    }
    return this.sessionsService.findByEpisode(episodeId, user ?? null);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Post()
  create(@Body() dto: CreateSessionDto) {
    return this.sessionsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sessionsService.remove(id);
  }
}
