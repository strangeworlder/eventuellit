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
import type { Request, Response } from "express";
import { JwtAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { RequestLinkDto } from "./dto/request-link.dto";
import { VerifyTokenDto } from "./dto/verify-token.dto";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("request-link")
  async requestLink(@Body() dto: RequestLinkDto, @Res() res: Response): Promise<void> {
    const baseUrl = process.env.MAGIC_LINK_BASE_URL || "http://localhost:3003";
    try {
      await this.authService.requestMagicLink(dto.email, baseUrl);
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
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("auth_token", jwt, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
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
  async getMe(@Req() req: Request) {
    const user = (req as any).user;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response): Promise<void> {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("auth_token", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    res.status(200).json({ message: "Logged out successfully" });
  }

  @Get("my-data")
  @UseGuards(JwtAuthGuard)
  async exportMyData(@Req() req: Request) {
    const user = (req as any).user;
    return this.authService.exportUserData(user.id);
  }

  @Delete("my-account")
  @UseGuards(JwtAuthGuard)
  async deleteMyAccount(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = (req as any).user;
    await this.authService.deleteUserAccount(user.id);

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("auth_token", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    res.status(200).json({ message: "Account deleted successfully" });
  }
}
