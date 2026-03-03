import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { characters } from '../db/schema';

@Controller('characters')
export class CharactersController {
    constructor(private readonly charactersService: CharactersService) { }

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

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCharacterDto: Partial<typeof characters.$inferInsert>) {
        return this.charactersService.update(+id, updateCharacterDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.charactersService.remove(+id);
    }
}
