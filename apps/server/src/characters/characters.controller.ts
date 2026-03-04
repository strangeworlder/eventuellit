import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import type { characters } from "../db/schema";
import type { CharactersService } from "./characters.service";

@Controller("characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
    create(@Body() createCharacterDto: typeof characters.$inferInsert) {
        return this.charactersService.create(createCharacterDto);
    }

  @Get()
  findAll() {
    return this.charactersService.findAll();
  }

  @Get(':id')
    findOne(@Param('id') id: string) {
        return this.charactersService.findOne(+id);
    }

  @Patch(":id")
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: Partial<typeof characters.$inferInsert>,
  ) {
    return this.charactersService.update(+id, updateCharacterDto);
  }

  @Delete(':id')
    remove(@Param('id') id: string) {
        return this.charactersService.remove(+id);
    }
}
