import {
  Body,
  Controller,
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
import { CreateEpisodeInviteDto } from "./dto/create-episode-invite.dto";
import { RespondEpisodeInviteDto } from "./dto/respond-episode-invite.dto";
import { EpisodeInvitesService } from "./episode-invites.service";

function ensureGm(req: Request) {
  const user = (req as any).user;
  if (!user || user.role !== "gm") {
    throw new ForbiddenException("Only GMs can perform this action");
  }
  return user;
}

@UseGuards(JwtAuthGuard)
@Controller("episode-invites")
export class EpisodeInvitesController {
  constructor(private readonly episodeInvitesService: EpisodeInvitesService) {}

  @Post()
  create(@Body() dto: CreateEpisodeInviteDto, @Req() req: Request) {
    const gm = ensureGm(req);
    return this.episodeInvitesService.create(dto, gm.id);
  }

  @Get()
  findByEpisode(@Query("episodeId", ParseIntPipe) episodeId: number, @Req() req: Request) {
    ensureGm(req);
    return this.episodeInvitesService.findByEpisode(episodeId);
  }

  @Get("mine")
  findMine(@Req() req: Request) {
    const user = (req as any).user;
    return this.episodeInvitesService.findMine(user.id);
  }

  @Patch(":id")
  respond(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: RespondEpisodeInviteDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.episodeInvitesService.respond(id, dto, user.id);
  }
}
