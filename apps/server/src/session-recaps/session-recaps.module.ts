import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { EpisodePlayersModule } from "../episode-players/episode-players.module";
import { SessionRecapsController } from "./session-recaps.controller";
import { SessionRecapsService } from "./session-recaps.service";

@Module({
  imports: [AuthModule, EpisodePlayersModule],
  controllers: [SessionRecapsController],
  providers: [SessionRecapsService],
})
export class SessionRecapsModule {}
