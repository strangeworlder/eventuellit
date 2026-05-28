import {
  Body,
  Controller,
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
import { CreateEpisodeInviteDto } from "./dto/create-episode-invite.dto";
import { RespondEpisodeInviteDto } from "./dto/respond-episode-invite.dto";
import { EpisodeInvitesService } from "./episode-invites.service";

@UseGuards(JwtAuthGuard)
@Controller("episode-invites")
export class EpisodeInvitesController {
  constructor(private readonly episodeInvitesService: EpisodeInvitesService) {}

  @UseGuards(RolesGuard)
  @Roles("gm")
  @Post()
  create(@Body() dto: CreateEpisodeInviteDto, @CurrentUser() user: AuthUser) {
    return this.episodeInvitesService.create(dto, user.id);
  }

  @UseGuards(RolesGuard)
  @Roles("gm")
  @Get()
  findByEpisode(@Query("episodeId", ParseIntPipe) episodeId: number) {
    return this.episodeInvitesService.findByEpisode(episodeId);
  }

  @Get("mine")
  findMine(@CurrentUser() user: AuthUser) {
    return this.episodeInvitesService.findMine(user.id);
  }

  @Patch(":id")
  respond(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: RespondEpisodeInviteDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.episodeInvitesService.respond(id, dto, user.id);
  }
}
