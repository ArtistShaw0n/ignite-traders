import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { sql } from "drizzle-orm";
import { db } from "./client";

/**
 * Applies the `admin_users` table (migration 0003) to Neon.
 *
 * drizzle-kit migrate hangs on Neon's serverless connection (see NOTES.md),
 * so we run the DDL through the neon-http driver. Idempotent (IF NOT EXISTS).
 * No seed — permanent admins come from the ADMIN_EMAILS env var.
 */
async function main() {
  console.log("Ensuring admin_users table exists…");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "admin_users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "email" text NOT NULL,
      "added_by" text,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "admin_users_email_unique" UNIQUE("email")
    );
  `);
  console.log("admin_users table ready.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
