import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { type AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { CharactersService } from "./characters.service";
import { AdvanceCharacterDto } from "./dto/advance-character.dto";
import { AdvanceMonkDto } from "./dto/advance-monk.dto";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { CreatePrivateNoteDto } from "./dto/create-private-note.dto";
import { LinkEpisodeDto } from "./dto/link-episode.dto";
import { RefreshCharacterDto } from "./dto/refresh-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";
import { UpdatePrivateNoteDto } from "./dto/update-private-note.dto";

@UseGuards(JwtAuthGuard)
@Controller("characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto, @CurrentUser() user: AuthUser) {
    return this.charactersService.create(createCharacterDto, user.id);
  }

  @Get()
  findAll() {
    return this.charactersService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles("gm")
  @Get("export/markdown")
  exportMarkdown() {
    return this.charactersService.exportMarkdown();
  }

  @Get("anchors/claimed")
  getClaimedAnchors() {
    return this.charactersService.getClaimedAnchorIds();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @Get(":id/snapshots")
  listSnapshots(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.charactersService.listSnapshots(id, user.id, user.role);
  }

  @Get(":id/private-notes")
  listPrivateNotes(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.charactersService.listPrivateNotes(id, user.id, user.role);
  }

  @Post(":id/private-notes")
  createPrivateNote(
    @Param("id", ParseIntPipe) id: number,
    @Body() createPrivateNoteDto: CreatePrivateNoteDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.charactersService.createPrivateNote(id, createPrivateNoteDto, user.id);
  }

  @Patch(":id/private-notes/:noteId")
  updatePrivateNote(
    @Param("id", ParseIntPipe) id: number,
    @Param("noteId", ParseIntPipe) noteId: number,
    @Body() updatePrivateNoteDto: UpdatePrivateNoteDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.charactersService.updatePrivateNote(id, noteId, updatePrivateNoteDto, user.id);
  }

  @Delete(":id/private-notes/:noteId")
  removePrivateNote(
    @Param("id", ParseIntPipe) id: number,
    @Param("noteId", ParseIntPipe) noteId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.charactersService.removePrivateNote(id, noteId, user.id);
  }

  @Post(":id/migrate-public-notes")
  migratePublicNotes(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.charactersService.migratePublicNotesToPrivate(id, user.id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.charactersService.update(id, updateCharacterDto, user.id, user.role);
  }

  @Post(":id/link-episode")
  linkEpisode(
    @Param("id", ParseIntPipe) id: number,
    @Body() linkEpisodeDto: LinkEpisodeDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.charactersService.linkEpisode(id, linkEpisodeDto.episodeId, user.id);
  }

  @Post(":id/refresh")
  refresh(
    @Param("id", ParseIntPipe) id: number,
    @Body() refreshCharacterDto: RefreshCharacterDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.charactersService.refreshForEpisode(id, refreshCharacterDto, user.id);
  }

  @Post(":id/advance")
  advance(
    @Param("id", ParseIntPipe) id: number,
    @Body() advanceCharacterDto: AdvanceCharacterDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.charactersService.advanceForEpisode(id, advanceCharacterDto, user.id);
  }

  @Post(":id/advance-monk")
  advanceMonk(
    @Param("id", ParseIntPipe) id: number,
    @Body() advanceMonkDto: AdvanceMonkDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.charactersService.advanceAsMonk(id, advanceMonkDto, user.id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.charactersService.remove(id, user.id, user.role);
  }
}
