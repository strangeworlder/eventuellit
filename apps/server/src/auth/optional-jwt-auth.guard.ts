import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { AuthService } from "./auth.service";

/**
 * Validates a JWT token if one is present and attaches the user to the request.
 * Unlike JwtAuthGuard, this guard never throws — unauthenticated requests pass through
 * with req.user left undefined.
 */
@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromRequest(request);

    if (!token) return true;

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.authService.validateUser(payload.sub);
      if (user) {
        (request as any).user = user;
      }
    } catch {
      // Invalid token — treat as anonymous, don't throw
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return request.cookies?.auth_token || null;
  }
}
