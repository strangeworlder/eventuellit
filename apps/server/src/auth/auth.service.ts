import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { and, eq, isNotNull, lt, or } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { config } from "../config";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { characters, magicLinkTokens, users } from "../db/schema";
import { MailService } from "./mail.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async requestMagicLink(email: string, baseUrl: string): Promise<void> {
    const isDev = !config.isProduction;
    if (isDev) this.logger.log(`[DEV] requestMagicLink called for: ${email}`);

    // Check if user exists (email allowlist)
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Always return early without revealing whether the email exists
    if (!user) {
      if (isDev) this.logger.log(`[DEV] Email not found in DB — check your users table: ${email}`);
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

    // Cleanup expired/used tokens in the background
    void this.cleanupExpiredTokens().catch(() => {});
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

    // Generate JWT (include username so guards can populate req.user without DB)
    const payload = { sub: user.id, email: user.email, role: user.role, username: user.username };
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

    // Wrap in transaction to prevent partial state
    await this.db.transaction(async (tx) => {
      if (gmUser) {
        // Transfer characters to GM ownership
        await tx
          .update(characters)
          .set({ userId: gmUser.id })
          .where(eq(characters.userId, userId));
      }

      // Delete magic link tokens for this email
      await tx.delete(magicLinkTokens).where(eq(magicLinkTokens.email, user.email));

      // Delete the user record
      await tx.delete(users).where(eq(users.id, userId));
    });
  }

  /** Remove expired and used tokens older than 24 hours */
  private async cleanupExpiredTokens(): Promise<void> {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);
    await this.db.delete(magicLinkTokens).where(
      or(
        lt(magicLinkTokens.expiresAt, new Date()),
        and(isNotNull(magicLinkTokens.usedAt), lt(magicLinkTokens.usedAt, cutoff)),
      ),
    );
  }
}
