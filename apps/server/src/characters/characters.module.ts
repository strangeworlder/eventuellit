import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { CharactersController } from "./characters.controller";
import { CharactersService } from "./characters.service";

@Module({
  imports: [AuthModule, NotificationsModule],
  providers: [CharactersService],
  controllers: [CharactersController],
})
export class CharactersModule {}
