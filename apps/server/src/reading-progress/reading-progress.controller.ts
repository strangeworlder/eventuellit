import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { type AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { CreateReadingProgressDto } from "./dto/create-reading-progress.dto";
import { ReadingProgressService } from "./reading-progress.service";

@UseGuards(JwtAuthGuard)
@Controller("reading-progress")
export class ReadingProgressController {
  constructor(private readonly readingProgressService: ReadingProgressService) {}

  @Post()
  markRead(@Body() dto: CreateReadingProgressDto, @CurrentUser() user: AuthUser) {
    return this.readingProgressService.markRead(dto, user.id);
  }

  @Delete(":readingItemId")
  unmarkRead(@Param("readingItemId", ParseIntPipe) readingItemId: number, @CurrentUser() user: AuthUser) {
    return this.readingProgressService.unmarkRead(readingItemId, user.id);
  }

  @UseGuards(RolesGuard)
  @Roles("gm")
  @Get("episode/:episodeId")
  getEpisodeProgress(@Param("episodeId", ParseIntPipe) episodeId: number) {
    return this.readingProgressService.getEpisodeProgress(episodeId);
  }
}
