import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { config } from "../config";
import { JwtAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { type AuthUser, CurrentUser } from "./current-user.decorator";
import { RequestLinkDto } from "./dto/request-link.dto";
import { VerifyTokenDto } from "./dto/verify-token.dto";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("request-link")
  async requestLink(@Body() dto: RequestLinkDto, @Res() res: Response): Promise<void> {
    try {
      await this.authService.requestMagicLink(dto.email, config.magicLinkBaseUrl);
    } catch (error) {
      // Log the error server-side so dev can see it, but never reveal it to the client.
      this.logger.error(
        `requestMagicLink failed for ${dto.email}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
    // Always return 200 to prevent email enumeration
    res.status(200).json({ message: "If the email exists, a magic link has been sent" });
  }

  @Post("verify")
  async verify(@Body() dto: VerifyTokenDto, @Res() res: Response): Promise<void> {
    try {
      const { user, jwt } = await this.authService.verifyToken(dto.token);

      // Set httpOnly cookie
      res.cookie("auth_token", jwt, {
        httpOnly: true,
        sameSite: config.isProduction ? "none" : "lax",
        secure: config.isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        token: jwt,
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Token verification failed");
    }
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: AuthUser) {
    // Fetch fresh data from DB for the profile endpoint
    const fullUser = await this.authService.validateUser(user.id);
    if (!fullUser) throw new UnauthorizedException("User not found");
    return {
      id: fullUser.id,
      email: fullUser.email,
      username: fullUser.username,
      role: fullUser.role,
      avatarUrl: fullUser.avatarUrl,
    };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response): Promise<void> {
    res.clearCookie("auth_token", {
      httpOnly: true,
      sameSite: config.isProduction ? "none" : "lax",
      secure: config.isProduction,
    });
    res.status(200).json({ message: "Logged out successfully" });
  }

  @Get("my-data")
  @UseGuards(JwtAuthGuard)
  async exportMyData(@CurrentUser() user: AuthUser) {
    return this.authService.exportUserData(user.id);
  }

  @Delete("my-account")
  @UseGuards(JwtAuthGuard)
  async deleteMyAccount(@CurrentUser() user: AuthUser, @Res() res: Response): Promise<void> {
    await this.authService.deleteUserAccount(user.id);

    res.clearCookie("auth_token", {
      httpOnly: true,
      sameSite: config.isProduction ? "none" : "lax",
      secure: config.isProduction,
    });
    res.status(200).json({ message: "Account deleted successfully" });
  }
}
