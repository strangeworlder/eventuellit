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
import { EpisodePlayersService } from "../episode-players/episode-players.service";
import { ReadingItemsService } from "./reading-items.service";
import { CreateReadingItemDto } from "./dto/create-reading-item.dto";
import { UpdateReadingItemDto } from "./dto/update-reading-item.dto";

function ensureGm(req: Request) {
  const user = (req as any).user;
  if (!user || user.role !== "gm") {
    throw new ForbiddenException("Only GMs can perform this action");
  }
  return user;
}

@Controller("reading-items")
export class ReadingItemsController {
  constructor(
    private readonly readingItemsService: ReadingItemsService,
    private readonly episodePlayersService: EpisodePlayersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByEpisode(
    @Query("episodeId", ParseIntPipe) episodeId: number,
    @Query("sessionId") sessionIdStr: string | undefined,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    await this.episodePlayersService.assertEnrolled(episodeId, user.id, user.role);
    const sessionId = sessionIdStr !== undefined ? parseInt(sessionIdStr, 10) : undefined;
    return this.readingItemsService.findByEpisode(episodeId, user.id, sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReadingItemDto, @Req() req: Request) {
    ensureGm(req);
    return this.readingItemsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateReadingItemDto,
    @Req() req: Request,
  ) {
    ensureGm(req);
    return this.readingItemsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    ensureGm(req);
    return this.readingItemsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("suggestions/:episodeId")
  getSuggestions(
    @Param("episodeId", ParseIntPipe) episodeId: number,
    @Query("sessionId") sessionIdStr: string | undefined,
    @Req() req: Request,
  ) {
    ensureGm(req);
    const sessionId = sessionIdStr !== undefined ? parseInt(sessionIdStr, 10) : undefined;
    return this.readingItemsService.getSuggestions(episodeId, sessionId);
  }
}
