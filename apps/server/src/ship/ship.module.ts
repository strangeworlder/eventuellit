import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ShipController } from "./ship.controller";
import { ShipService } from "./ship.service";

@Module({
  imports: [AuthModule],
  controllers: [ShipController],
  providers: [ShipService],
  exports: [ShipService],
})
export class ShipModule {}
