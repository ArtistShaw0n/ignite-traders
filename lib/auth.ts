import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";

export type AdminUser = { userId: string; email: string };

/**
 * The signed-in admin, or null. The email is re-checked against admin_users on
 * EVERY call (not just at login) so that removing an admin revokes access
 * immediately — a stale JWT is never trusted on its own. cache() dedupes the
 * lookup within a single request.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;

  const [row] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (!row) return null;

  return { userId: email, email };
});

/**
 * Server-only — call at the top of every admin page / server action.
 * Not signed in (or no longer an admin) → redirect to the sign-in page.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/sign-in");
  return user;
}
