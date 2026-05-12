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
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { CastVoteDto } from "./dto/cast-vote.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreateOptionDto } from "./dto/create-option.dto";
import { CreateRoundDto } from "./dto/create-round.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";
import { UpdateRoundDto } from "./dto/update-round.dto";
import { MissionVotesService } from "./mission-votes.service";

function requireUser(req: Request) {
  const user = (req as any).user;
  if (!user) throw new ForbiddenException("Authentication required");
  return user;
}

function requireGm(req: Request) {
  const user = requireUser(req);
  if (user.role !== "gm") throw new ForbiddenException("Only GMs can perform this action");
  return user;
}

@Controller("voting")
export class MissionVotesController {
  constructor(private readonly service: MissionVotesService) {}

  // ─── Active round (player) ─────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get("active")
  getActive(@Req() req: Request) {
    const user = requireUser(req);
    return this.service.getActiveRound(user.id);
  }

  // ─── Round management (GM) ─────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post()
  createRound(@Body() dto: CreateRoundDto, @Req() req: Request) {
    const user = requireGm(req);
    return this.service.createRound(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":roundId")
  updateRound(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Body() dto: UpdateRoundDto,
    @Req() req: Request,
  ) {
    requireGm(req);
    return this.service.updateRound(roundId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":roundId")
  deleteRound(@Param("roundId", ParseIntPipe) roundId: number, @Req() req: Request) {
    requireGm(req);
    return this.service.deleteRound(roundId);
  }

  // ─── Options (GM) ──────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post(":roundId/options")
  addOption(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Body() dto: CreateOptionDto,
    @Req() req: Request,
  ) {
    requireGm(req);
    return this.service.addOption(roundId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":roundId/options/:optionId")
  updateOption(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Param("optionId", ParseIntPipe) optionId: number,
    @Body() dto: UpdateOptionDto,
    @Req() req: Request,
  ) {
    requireGm(req);
    return this.service.updateOption(roundId, optionId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":roundId/options/:optionId")
  deleteOption(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Param("optionId", ParseIntPipe) optionId: number,
    @Req() req: Request,
  ) {
    requireGm(req);
    return this.service.deleteOption(roundId, optionId);
  }

  // ─── Voting (player) ───────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post(":roundId/vote")
  castVote(
    @Param("roundId", ParseIntPipe) roundId: number,
    @Body() dto: CastVoteDto,
    @Req() req: Request,
  ) {
    const user = requireUser(req);
    return this.service.castVote(roundId, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":roundId/vote")
  deleteVote(@Param("roundId", ParseIntPipe) roundId: number, @Req() req: Request) {
    const user = requireUser(req);
    return this.service.deleteVote(roundId, user.id);
  }

  // ─── Results ───────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get(":roundId/results")
  getResults(@Param("roundId", ParseIntPipe) roundId: number, @Req() req: Request) {
    requireUser(req);
    return this.service.getResults(roundId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":roundId/results/full")
  getFullResults(@Param("roundId", ParseIntPipe) roundId: number, @Req() req: Request) {
    requireGm(req);
    return this.service.getFullResults(roundId);
  }

  // ─── Comments ──────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get(":roundId/options/:optionId/comments")
  getComments(
    @Param("optionId", ParseIntPipe) optionId: number,
    @Req() req: Request,
  ) {
    requireUser(req);
    return this.service.getComments(optionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":roundId/options/:optionId/comments")
  addComment(
    @Param("optionId", ParseIntPipe) optionId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const user = requireUser(req);
    return this.service.addComment(optionId, user.id, dto);
  }
}
