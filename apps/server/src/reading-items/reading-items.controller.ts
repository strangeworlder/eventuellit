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
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { type AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { EpisodePlayersService } from "../episode-players/episode-players.service";
import { CreateReadingItemDto } from "./dto/create-reading-item.dto";
import { UpdateReadingItemDto } from "./dto/update-reading-item.dto";
import { ReadingItemsService } from "./reading-items.service";

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
    @CurrentUser() user: AuthUser,
  ) {
    await this.episodePlayersService.assertEnrolled(episodeId, user.id, user.role);
    const sessionId = sessionIdStr !== undefined ? parseInt(sessionIdStr, 10) : undefined;
    return this.readingItemsService.findByEpisode(episodeId, user.id, sessionId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Post()
  create(@Body() dto: CreateReadingItemDto) {
    return this.readingItemsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateReadingItemDto) {
    return this.readingItemsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.readingItemsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Get("suggestions/:episodeId")
  getSuggestions(
    @Param("episodeId", ParseIntPipe) episodeId: number,
    @Query("sessionId") sessionIdStr: string | undefined,
  ) {
    const sessionId = sessionIdStr !== undefined ? parseInt(sessionIdStr, 10) : undefined;
    return this.readingItemsService.getSuggestions(episodeId, sessionId);
  }
}
