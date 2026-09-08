import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MonkPowersController } from "./monk-powers.controller";
import { MonkPowersService } from "./monk-powers.service";

@Module({
  imports: [AuthModule],
  controllers: [MonkPowersController],
  providers: [MonkPowersService],
  exports: [MonkPowersService],
})
export class MonkPowersModule {}
