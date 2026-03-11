import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./auth.guard";
import { RequestLinkDto } from "./dto/request-link.dto";
import { VerifyTokenDto } from "./dto/verify-token.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("request-link")
  async requestLink(
    @Body() dto: RequestLinkDto,
    @Res() res: Response,
  ): Promise<void> {
    const baseUrl =
      process.env.MAGIC_LINK_BASE_URL || "http://localhost:3003";
    await this.authService.requestMagicLink(dto.email, baseUrl);
    // Always return 200 to prevent email enumeration
    res.status(200).json({ message: "If the email exists, a magic link has been sent" });
  }

  @Post("verify")
  async verify(
    @Body() dto: VerifyTokenDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { user, jwt } = await this.authService.verifyToken(dto.token);

      // Set httpOnly cookie
      res.cookie("auth_token", jwt, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
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
    res.clearCookie("auth_token");
    res.status(200).json({ message: "Logged out successfully" });
  }
}
