import "server-only";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getAllowlistedEmails } from "./admins";

export type AdminUser = { userId: string; email: string };

type AdminResolution =
  | { status: "signed-out" }
  | { status: "forbidden" }
  | { status: "ok"; user: AdminUser };

async function resolveAdmin(): Promise<AdminResolution> {
  const user = await currentUser();
  if (!user) return { status: "signed-out" };

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  const allEmails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  const allowlist = await getAllowlistedEmails();
  const isAdmin = allEmails.some((e) => allowlist.has(e));
  if (!isAdmin) return { status: "forbidden" };

  return {
    status: "ok",
    user: { userId: user.id, email: primaryEmail ?? "" },
  };
}

/**
 * Non-redirecting variant — returns the admin user or `null`. Use in
 * route handlers (where you want to return a 403 Response) or anywhere a
 * redirect would be the wrong control-flow.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const res = await resolveAdmin();
  return res.status === "ok" ? res.user : null;
}

/**
 * Server-only — call this at the top of every admin page or server action.
 *
 *  1. Not signed in → redirect to /admin/sign-in.
 *  2. Signed in but not allowlisted → redirect to /. We deliberately don't
 *     show a "403 Forbidden" page — silently pretending the admin area
 *     doesn't exist is friendlier to accidental visitors and harder for an
 *     attacker to enumerate.
 *  3. Otherwise returns { userId, email }.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const res = await resolveAdmin();
  if (res.status === "signed-out") redirect("/admin/sign-in");
  if (res.status === "forbidden") redirect("/");
  return res.user;
}
