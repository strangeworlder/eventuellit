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
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { CreateEpisodeSkillDto } from "./dto/create-episode-skill.dto";
import { UpdateEpisodeDto } from "./dto/update-episode.dto";
import { UpdateEpisodeSkillDto } from "./dto/update-episode-skill.dto";
import { EpisodesService } from "./episodes.service";

@Controller("episodes")
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get()
  findAll(@Query("status") status?: string) {
    return this.episodesService.findAll(status);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.episodesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Post()
  async create(@Body() dto: CreateEpisodeDto, @CurrentUser() user: AuthUser) {
    return this.episodesService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateEpisodeDto) {
    return this.episodesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.episodesService.remove(id);
  }

  // --- Skills ---

  @Get(":id/skills")
  findSkills(@Param("id", ParseIntPipe) id: number) {
    return this.episodesService.findSkills(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Post(":id/skills")
  async addSkill(@Param("id", ParseIntPipe) id: number, @Body() dto: CreateEpisodeSkillDto) {
    return this.episodesService.addSkill(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch(":id/skills/:skillId")
  async updateSkill(
    @Param("id", ParseIntPipe) id: number,
    @Param("skillId", ParseIntPipe) skillId: number,
    @Body() dto: UpdateEpisodeSkillDto,
  ) {
    return this.episodesService.updateSkill(id, skillId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Delete(":id/skills/:skillId")
  async removeSkill(
    @Param("id", ParseIntPipe) id: number,
    @Param("skillId", ParseIntPipe) skillId: number,
  ) {
    return this.episodesService.removeSkill(id, skillId);
  }
}
