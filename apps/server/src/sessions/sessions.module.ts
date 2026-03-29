import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { EpisodePlayersModule } from "../episode-players/episode-players.module";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [AuthModule, EpisodePlayersModule],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
