import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { CreateReadingProgressDto } from "./dto/create-reading-progress.dto";
import { ReadingProgressService } from "./reading-progress.service";

@UseGuards(JwtAuthGuard)
@Controller("reading-progress")
export class ReadingProgressController {
  constructor(private readonly readingProgressService: ReadingProgressService) {}

  @Post()
  markRead(@Body() dto: CreateReadingProgressDto, @Req() req: Request) {
    const user = (req as any).user;
    return this.readingProgressService.markRead(dto, user.id);
  }

  @Delete(":readingItemId")
  unmarkRead(@Param("readingItemId", ParseIntPipe) readingItemId: number, @Req() req: Request) {
    const user = (req as any).user;
    return this.readingProgressService.unmarkRead(readingItemId, user.id);
  }

  @Get("episode/:episodeId")
  getEpisodeProgress(@Param("episodeId", ParseIntPipe) episodeId: number, @Req() req: Request) {
    const user = (req as any).user;
    if (user.role !== "gm") {
      throw new ForbiddenException("Only GMs can view player progress");
    }
    return this.readingProgressService.getEpisodeProgress(episodeId);
  }
}
