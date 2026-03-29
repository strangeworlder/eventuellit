import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { EpisodePlayersController } from "./episode-players.controller";
import { EpisodePlayersService } from "./episode-players.service";

@Module({
  imports: [AuthModule],
  controllers: [EpisodePlayersController],
  providers: [EpisodePlayersService],
  exports: [EpisodePlayersService],
})
export class EpisodePlayersModule {}
