import { Module } from "@nestjs/common";
import { MonkPowersController } from "./monk-powers.controller";
import { MonkPowersService } from "./monk-powers.service";

@Module({
  controllers: [MonkPowersController],
  providers: [MonkPowersService],
  exports: [MonkPowersService],
})
export class MonkPowersModule {}
