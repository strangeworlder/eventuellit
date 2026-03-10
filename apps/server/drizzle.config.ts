import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL || "postgresql://root:password123@localhost:5432/eventuellit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
