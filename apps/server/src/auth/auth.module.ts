import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { config } from "../config";
import { AuthController } from "./auth.controller";
import { JwtAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { MailService } from "./mail.service";
import { OptionalJwtAuthGuard } from "./optional-jwt-auth.guard";
import { RolesGuard } from "./roles.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, OptionalJwtAuthGuard, JwtModule, RolesGuard],
})
export class AuthModule {}
