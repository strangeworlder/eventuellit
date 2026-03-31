import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { EpisodeInvitesController } from "./episode-invites.controller";
import { EpisodeInvitesService } from "./episode-invites.service";

@Module({
  imports: [AuthModule],
  controllers: [EpisodeInvitesController],
  providers: [EpisodeInvitesService],
  exports: [EpisodeInvitesService],
})
export class EpisodeInvitesModule {}
