import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MissionVotesController } from "./mission-votes.controller";
import { MissionVotesService } from "./mission-votes.service";

@Module({
  imports: [AuthModule],
  controllers: [MissionVotesController],
  providers: [MissionVotesService],
  exports: [MissionVotesService],
})
export class MissionVotesModule {}
