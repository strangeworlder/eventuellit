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
import { EpisodesService } from "./episodes.service";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { UpdateEpisodeDto } from "./dto/update-episode.dto";
import { CreateEpisodeSkillDto } from "./dto/create-episode-skill.dto";
import { UpdateEpisodeSkillDto } from "./dto/update-episode-skill.dto";

function ensureGm(req: Request) {
  const user = (req as any).user;
  if (!user || user.role !== "gm") {
    throw new ForbiddenException("Only GMs can perform this action");
  }
  return user;
}

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

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateEpisodeDto, @Req() req: Request) {
    const user = ensureGm(req);
    return this.episodesService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateEpisodeDto,
    @Req() req: Request,
  ) {
    ensureGm(req);
    return this.episodesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    ensureGm(req);
    return this.episodesService.remove(id);
  }

  // --- Skills ---

  @Get(":id/skills")
  findSkills(@Param("id", ParseIntPipe) id: number) {
    return this.episodesService.findSkills(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/skills")
  async addSkill(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateEpisodeSkillDto,
    @Req() req: Request,
  ) {
    ensureGm(req);
    return this.episodesService.addSkill(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/skills/:skillId")
  async updateSkill(
    @Param("id", ParseIntPipe) id: number,
    @Param("skillId", ParseIntPipe) skillId: number,
    @Body() dto: UpdateEpisodeSkillDto,
    @Req() req: Request,
  ) {
    ensureGm(req);
    return this.episodesService.updateSkill(id, skillId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/skills/:skillId")
  async removeSkill(
    @Param("id", ParseIntPipe) id: number,
    @Param("skillId", ParseIntPipe) skillId: number,
    @Req() req: Request,
  ) {
    ensureGm(req);
    return this.episodesService.removeSkill(id, skillId);
  }
}
