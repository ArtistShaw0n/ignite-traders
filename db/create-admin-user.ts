import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "./client";
import { adminUsers } from "./schema";

/**
 * Bootstrap / reset an admin login (self-contained auth, email + password).
 *
 *   npx tsx db/create-admin-user.ts <email> <password>
 *
 * Idempotent: ensures the password_hash column exists (migration 0004), then
 * upserts the admin by email — so it also doubles as a password reset. Run with
 * NO args to just apply the column. The password is bcrypt-hashed; the plain
 * text is never stored and (when you run this) never leaves your machine.
 */
async function main() {
  await db.execute(sql`ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "password_hash" text;`);

  const [emailArg, password] = process.argv.slice(2);
  if (!emailArg || !password) {
    console.log(
      "password_hash column ensured.\nTo create/reset an admin: npx tsx db/create-admin-user.ts <email> <password>",
    );
    return;
  }

  const email = emailArg.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Invalid email address.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db
    .insert(adminUsers)
    .values({ email, passwordHash, addedBy: "bootstrap" })
    .onConflictDoUpdate({ target: adminUsers.email, set: { passwordHash } });

  console.log(`✓ Admin ready: ${email}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
