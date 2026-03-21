import {
  Body,
  Controller,
  Delete,
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
import { CharactersService } from "./characters.service";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";

@UseGuards(JwtAuthGuard)
@Controller("characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto, @Req() req: Request) {
    const user = (req as any).user;
    return this.charactersService.create(createCharacterDto, user.id);
  }

  @Get()
  findAll() {
    return this.charactersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.charactersService.update(id, updateCharacterDto, user.id, user.role);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    const user = (req as any).user;
    return this.charactersService.remove(id, user.id, user.role);
  }
}
