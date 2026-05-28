import { Global, Module } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
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
export class DbModule {}
