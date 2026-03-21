import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CharactersController } from "./characters.controller";
import { CharactersService } from "./characters.service";

@Module({
  imports: [AuthModule],
  providers: [CharactersService],
  controllers: [CharactersController],
})
export class CharactersModule {}
