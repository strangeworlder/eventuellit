import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CharactersModule } from "./characters/characters.module";
import { DbModule } from "./db/db.module";
import { EpisodesModule } from "./episodes/episodes.module";

@Module({
  imports: [DbModule, AuthModule, CharactersModule, EpisodesModule],
})
export class AppModule {}
