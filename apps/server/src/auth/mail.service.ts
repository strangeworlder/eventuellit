import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendMagicLink(email: string, link: string): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        this.logger.warn("RESEND_API_KEY is not set. Falling back to console logging.");
        this.logger.log(`[PRODUCTION] Magic link for ${email}: ${link}`);
        return;
      }

      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: "noreply@eventuell.it",
        to: email,
        subject: "Kirjautumislinkki - Eventuellit",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Kirjaudu sisään Eventuellit-sovellukseen</h2>
            <p>Klikkaa alla olevaa linkkiä kirjautuaksesi sisään. Linkki on voimassa 15 minuuttia.</p>
            <p style="margin: 32px 0;">
              <a href="${link}" style="background-color: #1a1a2e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Kirjaudu sisään
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">
              Jos et pyytänyt tätä linkkiä, voit jättää tämän viestin huomiotta.
            </p>
            <p style="color: #666; font-size: 14px;">
              Tai kopioi tämä osoite selaimesi osoitekenttään:<br />
              <a href="${link}" style="color: #666;">${link}</a>
            </p>
          </div>
        `,
      });

      if (error) {
        this.logger.error(`Failed to send magic link email to ${email}: ${error.message}`);
        throw new Error(`Email sending failed: ${error.message}`);
      }

      this.logger.log(`Magic link sent to ${email}`);
    } else {
      // In development, log to console for easy testing
      this.logger.log(`Magic link for ${email}: ${link}`);
    }
  }
}
