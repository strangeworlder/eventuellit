import {
  Body,
  Controller,
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
import { DismissNotificationDto } from "./dto/dismiss-notification.dto";
import { NotificationsService } from "./notifications.service";

interface JwtUser {
  id: number;
  role: string;
}

@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getActive(@Req() req: Request) {
    const user = (req as Request & { user: JwtUser }).user;
    return this.notificationsService.getActiveForUser(user.id);
  }

  @Patch(":id/dismiss")
  dismiss(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const user = (req as Request & { user: JwtUser }).user;
    return this.notificationsService.dismiss(id, user.id);
  }

  @Post("dismiss-by-type")
  dismissByType(@Body() dto: DismissNotificationDto, @Req() req: Request) {
    const user = (req as Request & { user: JwtUser }).user;
    return this.notificationsService.dismissByType(user.id, dto.type, dto.referenceId);
  }
}
