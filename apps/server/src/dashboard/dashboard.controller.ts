import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { type AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { DashboardService } from "./dashboard.service";

@UseGuards(JwtAuthGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@CurrentUser() user: AuthUser) {
    return this.dashboardService.getDashboard(user.id);
  }

  @UseGuards(RolesGuard)
  @Roles("gm")
  @Get("gm-overview")
  getGmOverview(
    @Query("episodeId", ParseIntPipe) episodeId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.dashboardService.getGmOverview(episodeId, user.role);
  }
}
