import "server-only";

import { cache } from "react";
import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";

/**
 * Permanent superadmins from env (ADMIN_EMAILS / ADMIN_EMAIL). These can NOT
 * be removed through the UI, so the team can never lock itself out.
 *
 * `||` not `??`: an env var set to "" is a real misconfiguration — `??` only
 * catches null/undefined, so `ADMIN_EMAIL=""` would empty the allowlist.
 */
export const ENV_ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ||
  process.env.ADMIN_EMAIL ||
  "shawon221b@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/** Admin emails stored in the DB (added via the admin UI), lowercased. */
const getDbAdminEmails = cache(async (): Promise<string[]> => {
  try {
    const rows = await db.select({ email: adminUsers.email }).from(adminUsers);
    return rows.map((r) => r.email.toLowerCase());
  } catch (err) {
    // Defensive: env admins must keep working even if this query fails.
    console.error("getDbAdminEmails failed", err);
    return [];
  }
});

/** Full allowlist = permanent env admins ∪ DB-managed admins. */
export async function getAllowlistedEmails(): Promise<Set<string>> {
  const dbEmails = await getDbAdminEmails();
  return new Set([...ENV_ADMIN_EMAILS, ...dbEmails]);
}

export interface AdminListItem {
  id: string | null; // null for permanent (env) admins
  email: string;
  source: "env" | "db";
  addedBy?: string | null;
}

/** Combined list for the admin UI — permanent first, then DB-added. */
export async function listAdmins(): Promise<AdminListItem[]> {
  const rows = await db.select().from(adminUsers).orderBy(asc(adminUsers.email));

  const env: AdminListItem[] = ENV_ADMIN_EMAILS.map((email) => ({
    id: null,
    email,
    source: "env",
  }));

  const dbList: AdminListItem[] = rows
    .filter((r) => !ENV_ADMIN_EMAILS.includes(r.email.toLowerCase()))
    .map((r) => ({
      id: r.id,
      email: r.email.toLowerCase(),
      source: "db",
      addedBy: r.addedBy,
    }));

  return [...env, ...dbList];
}
