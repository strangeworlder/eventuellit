import { Global, Inject, Logger, Module, type OnModuleInit } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "../config";
import * as schema from "./schema";

export const DATABASE_CONNECTION = "DATABASE_CONNECTION";

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: () => {
        const pool = new Pool({
          connectionString: config.databaseUrl,
          // Railway Postgres has a 20-connection limit; 5 is safe for this app
          max: 5,
          // Release idle connections after 30 s instead of holding them forever
          idleTimeoutMillis: 30_000,
          // Fail fast rather than queuing requests indefinitely
          connectionTimeoutMillis: 5_000,
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DbModule implements OnModuleInit {
  private readonly logger = new Logger(DbModule.name);

  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async onModuleInit() {
    try {
      await this.db.execute(
        sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS rebellion_level INTEGER NOT NULL DEFAULT 0`,
      );
    } catch (error) {
      this.logger.warn(
        `Could not auto-ensure users.rebellion_level column on startup: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
