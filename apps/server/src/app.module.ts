import { Module } from "@nestjs/common";
import { CharactersModule } from "./characters/characters.module";
import { DbModule } from "./db/db.module";

@Module({
  imports: [DbModule, CharactersModule],
})
export class AppModule {}
