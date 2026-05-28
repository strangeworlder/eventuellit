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
import { CastVoteDto } from "./dto/cast-vote.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreateOptionDto } from "./dto/create-option.dto";
import { CreateRoundDto } from "./dto/create-round.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";
import { UpdateRoundDto } from "./dto/update-round.dto";
import { MissionVotesService } from "./mission-votes.service";

@Controller("voting")
export class MissionVotesController {
  constructor(private readonly service: MissionVotesService) {}

  // ─── Active round (player) ─────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get("active")
  getActive(@CurrentUser() user: AuthUser) {
    return this.service.getActiveRound(user.id);
  }

  // ─── Round management (GM) ─────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Post()
  createRound(@Body() dto: CreateRoundDto, @CurrentUser() user: AuthUser) {
    return this.service.createRound(dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch(":roundId")
  updateRound(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Body() dto: UpdateRoundDto,
  ) {
    return this.service.updateRound(roundId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Delete(":roundId")
  deleteRound(@Param("roundId", ParseIntPipe) roundId: number) {
    return this.service.deleteRound(roundId);
  }

  // ─── Options (GM) ──────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Post(":roundId/options")
  addOption(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Body() dto: CreateOptionDto,
  ) {
    return this.service.addOption(roundId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch(":roundId/options/:optionId")
  updateOption(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Param("optionId", ParseIntPipe) optionId: number,
    @Body() dto: UpdateOptionDto,
  ) {
    return this.service.updateOption(roundId, optionId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Delete(":roundId/options/:optionId")
  deleteOption(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Param("optionId", ParseIntPipe) optionId: number,
  ) {
    return this.service.deleteOption(roundId, optionId);
  }

  // ─── Voting (player) ───────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post(":roundId/vote")
  castVote(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Body() dto: CastVoteDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.castVote(roundId, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":roundId/vote")
  deleteVote(@Param("roundId", ParseIntPipe) roundId: number, @CurrentUser() user: AuthUser) {
    return this.service.deleteVote(roundId, user.id);
  }

  // ─── Results ───────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get(":roundId/results")
  getResults(@Param("roundId", ParseIntPipe) roundId: number) {
    return this.service.getResults(roundId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Get(":roundId/results/full")
  getFullResults(@Param("roundId", ParseIntPipe) roundId: number) {
    return this.service.getFullResults(roundId);
  }

  // ─── Comments ──────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get(":roundId/options/:optionId/comments")
  getComments(@Param("optionId", ParseIntPipe) optionId: number) {
    return this.service.getComments(optionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":roundId/options/:optionId/comments")
  addComment(
    @Param("optionId", ParseIntPipe) optionId: number,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.addComment(optionId, user.id, dto);
  }
}
