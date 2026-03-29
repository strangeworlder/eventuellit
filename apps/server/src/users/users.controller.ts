import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UsersService } from "./users.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findByRole(@Query("role") role: string = "player", @Req() req: Request) {
    const user = (req as any).user;
    return this.usersService.findByRole(role, user.role);
  }
}
