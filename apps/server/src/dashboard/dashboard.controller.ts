import { Controller, Get, ParseIntPipe, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { DashboardService } from "./dashboard.service";

@UseGuards(JwtAuthGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Req() req: Request) {
    const user = (req as any).user;
    return this.dashboardService.getDashboard(user.id);
  }

  @Get("gm-overview")
  getGmOverview(@Query("episodeId", ParseIntPipe) episodeId: number, @Req() req: Request) {
    const user = (req as any).user;
    return this.dashboardService.getGmOverview(episodeId, user.role);
  }
}
