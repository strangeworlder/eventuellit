import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { CharactersService } from "./characters.service";
import { AdvanceCharacterDto } from "./dto/advance-character.dto";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { LinkEpisodeDto } from "./dto/link-episode.dto";
import { RefreshCharacterDto } from "./dto/refresh-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";

@UseGuards(JwtAuthGuard)
@Controller("characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto, @Req() req: Request) {
    const user = (req as any).user;
    return this.charactersService.create(createCharacterDto, user.id);
  }

  @Get()
  findAll() {
    return this.charactersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @Get(":id/snapshots")
  listSnapshots(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const user = (req as any).user;
    return this.charactersService.listSnapshots(id, user.id, user.role);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.charactersService.update(id, updateCharacterDto, user.id, user.role);
  }

  @Post(":id/link-episode")
  linkEpisode(
    @Param("id", ParseIntPipe) id: number,
    @Body() linkEpisodeDto: LinkEpisodeDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.charactersService.linkEpisode(id, linkEpisodeDto.episodeId, user.id);
  }

  @Post(":id/refresh")
  refresh(
    @Param("id", ParseIntPipe) id: number,
    @Body() refreshCharacterDto: RefreshCharacterDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.charactersService.refreshForEpisode(id, refreshCharacterDto, user.id);
  }

  @Post(":id/advance")
  advance(
    @Param("id", ParseIntPipe) id: number,
    @Body() advanceCharacterDto: AdvanceCharacterDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.charactersService.advanceForEpisode(id, advanceCharacterDto, user.id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const user = (req as any).user;
    return this.charactersService.remove(id, user.id, user.role);
  }
}
