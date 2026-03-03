import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DbModule } from './db/db.module';
import { CharactersModule } from './characters/characters.module';

@Module({
  imports: [DbModule, CharactersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
