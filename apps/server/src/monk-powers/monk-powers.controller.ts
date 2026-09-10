import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { CreateMonkPowerDto } from "./dto/create-monk-power.dto";
import { UpdateMonkPowerDto } from "./dto/update-monk-power.dto";
import { MonkPowersService } from "./monk-powers.service";

@Controller("monk-powers")
export class MonkPowersController {
  constructor(private readonly monkPowersService: MonkPowersService) {}

  @Get()
  findAll(@Query("tier") tier?: string) {
    const parsedTier = tier !== undefined && tier !== "" ? Number.parseInt(tier, 10) : undefined;
    return this.monkPowersService.findAll(Number.isNaN(parsedTier) ? undefined : parsedTier);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.monkPowersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Post()
  create(@Body() dto: CreateMonkPowerDto) {
    return this.monkPowersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateMonkPowerDto) {
    return this.monkPowersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("gm")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.monkPowersService.remove(id);
  }
}
