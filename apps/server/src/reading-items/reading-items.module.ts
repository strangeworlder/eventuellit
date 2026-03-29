import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ContentRegistryModule } from "../content-registry/content-registry.module";
import { EpisodePlayersModule } from "../episode-players/episode-players.module";
import { ReadingItemsController } from "./reading-items.controller";
import { ReadingItemsService } from "./reading-items.service";

@Module({
  imports: [AuthModule, ContentRegistryModule, EpisodePlayersModule],
  controllers: [ReadingItemsController],
  providers: [ReadingItemsService],
})
export class ReadingItemsModule {}
