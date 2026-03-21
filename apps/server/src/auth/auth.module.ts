import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MailService } from "./mail.service";
import { JwtAuthGuard } from "./auth.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "dev-secret-change-in-production",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
