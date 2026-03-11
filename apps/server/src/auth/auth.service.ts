import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { users, magicLinkTokens } from "../db/schema";
import { MailService } from "./mail.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async requestMagicLink(email: string, baseUrl: string): Promise<void> {
    // Check if user exists (email allowlist)
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Always return 200 to prevent email enumeration
    if (!user) {
      return;
    }

    // Generate token
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minute expiry

    // Store token
    await this.db.insert(magicLinkTokens).values({
      email,
      token,
      expiresAt,
    });

    // Send magic link
    const verifyUrl = `${baseUrl}/auth/vahvista?token=${token}`;
    await this.mailService.sendMagicLink(email, verifyUrl);
  }

  async verifyToken(token: string): Promise<{ user: typeof users.$inferSelect; jwt: string }> {
    // Find token
    const tokenRecord = await this.db.query.magicLinkTokens.findFirst({
      where: eq(magicLinkTokens.token, token),
    });

    if (!tokenRecord) {
      throw new UnauthorizedException("Invalid token");
    }

    // Check if expired
    if (new Date() > tokenRecord.expiresAt) {
      throw new UnauthorizedException("Token expired");
    }

    // Check if already used
    if (tokenRecord.usedAt) {
      throw new UnauthorizedException("Token already used");
    }

    // Mark token as used
    await this.db
      .update(magicLinkTokens)
      .set({ usedAt: new Date() })
      .where(eq(magicLinkTokens.id, tokenRecord.id));

    // Get user
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, tokenRecord.email),
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const jwt = this.jwtService.sign(payload);

    return { user, jwt };
  }

  async validateUser(userId: number): Promise<typeof users.$inferSelect | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return user || null;
  }
}
