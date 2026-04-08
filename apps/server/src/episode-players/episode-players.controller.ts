import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import type { CreateEpisodePlayerDto } from "./dto/create-episode-player.dto";
import { EpisodePlayersService } from "./episode-players.service";

function ensureGm(req: Request) {
  const user = (req as any).user;
  if (!user || user.role !== "gm") {
    throw new ForbiddenException("Only GMs can perform this action");
  }
  return user;
}

@UseGuards(JwtAuthGuard)
@Controller("episode-players")
export class EpisodePlayersController {
  constructor(private readonly episodePlayersService: EpisodePlayersService) {}

  @Get()
  findByEpisode(@Query("episodeId", ParseIntPipe) episodeId: number, @Req() req: Request) {
    const user = (req as any).user;
    return this.episodePlayersService.findByEpisode(episodeId, user);
  }

  @Post()
  enroll(@Body() dto: CreateEpisodePlayerDto, @Req() req: Request) {
    ensureGm(req);
    return this.episodePlayersService.enroll(dto);
  }

  @Delete(":id")
  disenroll(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    ensureGm(req);
    return this.episodePlayersService.disenroll(id);
  }
}
