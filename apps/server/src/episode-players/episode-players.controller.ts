import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { type AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { CreateEpisodePlayerDto } from "./dto/create-episode-player.dto";
import { EpisodePlayersService } from "./episode-players.service";

@UseGuards(JwtAuthGuard)
@Controller("episode-players")
export class EpisodePlayersController {
  constructor(private readonly episodePlayersService: EpisodePlayersService) {}

  @Get()
  findByEpisode(@Query("episodeId", ParseIntPipe) episodeId: number, @CurrentUser() user: AuthUser) {
    return this.episodePlayersService.findByEpisode(episodeId, user);
  }

  @UseGuards(RolesGuard)
  @Roles("gm")
  @Post()
  enroll(@Body() dto: CreateEpisodePlayerDto) {
    return this.episodePlayersService.enroll(dto);
  }

  @UseGuards(RolesGuard)
  @Roles("gm")
  @Delete(":id")
  disenroll(@Param("id", ParseIntPipe) id: number) {
    return this.episodePlayersService.disenroll(id);
  }
}
