import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { users, magicLinkTokens, characters } from "../db/schema";
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

  /** GDPR: Export all personal data for the authenticated user */
  async exportUserData(userId: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const userCharacters = await this.db.query.characters.findMany({
      where: eq(characters.userId, userId),
    });

    return {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      characters: userCharacters,
    };
  }

  /** GDPR: Delete user account, transferring characters to GM */
  async deleteUserAccount(userId: number): Promise<void> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Find the GM user to transfer characters to
    const gmUser = await this.db.query.users.findFirst({
      where: eq(users.role, "gm"),
    });

    if (gmUser) {
      // Transfer characters to GM ownership
      await this.db
        .update(characters)
        .set({ userId: gmUser.id })
        .where(eq(characters.userId, userId));
    }

    // Delete magic link tokens for this email
    await this.db
      .delete(magicLinkTokens)
      .where(eq(magicLinkTokens.email, user.email));

    // Delete the user record
    await this.db
      .delete(users)
      .where(eq(users.id, userId));
  }
}
