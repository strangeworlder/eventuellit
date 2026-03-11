import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendMagicLink(email: string, link: string): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      // TODO: Implement actual SMTP email sending in production
      // For now, log the link in production too until SMTP is configured
      this.logger.log(`[PRODUCTION] Magic link for ${email}: ${link}`);
      this.logger.warn(
        "SMTP email sending not yet implemented. Magic link logged to console.",
      );
    } else {
      // In development, log to console for easy testing
      this.logger.log(`Magic link for ${email}: ${link}`);
    }
  }
}
