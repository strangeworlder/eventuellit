import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ShipController } from "./ship.controller";
import { ShipService } from "./ship.service";

@Module({
  imports: [AuthModule],
  providers: [ShipService],
  controllers: [ShipController],
})
export class ShipModule {}
