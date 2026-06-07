import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type AdminUser = { userId: string; email: string };

/**
 * The signed-in admin, or null. With self-contained auth a session can only
 * exist for an email in admin_users (the Credentials provider IS the
 * allowlist), so any session = a valid admin.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return { userId: email, email };
}

/**
 * Server-only — call at the top of every admin page / server action.
 * Not signed in → redirect to the sign-in page.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/sign-in");
  return user;
}
