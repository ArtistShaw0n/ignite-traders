import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit config — drives schema migrations + studio.
 *
 *   npm run db:generate   # diff schema.ts → SQL migration file
 *   npm run db:migrate    # apply pending migrations to DATABASE_URL
 *   npm run db:push       # skip migrations; sync schema directly (dev only)
 *   npm run db:studio     # browse the DB in a local UI
 */
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
