import "server-only";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Email allowlist — only these addresses count as admins. Set via
 * `ADMIN_EMAILS` env var as a comma-separated list. Falls back to
 * `ADMIN_EMAIL` (singular, also used by the email-notification flow)
 * and then a hardcoded default so dev environments aren't locked out.
 *
 * NOTE: `||` not `??` — an env var set to an empty string ("") is a real
 * (and easy-to-hit) misconfiguration. `??` only falls through on
 * null/undefined, so `ADMIN_EMAIL=""` would yield an EMPTY allowlist and
 * lock everyone out. `||` treats "" as absent and falls back correctly.
 */
const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ||
  process.env.ADMIN_EMAIL ||
  "shawon221b@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export type AdminUser = { userId: string; email: string };

type AdminResolution =
  | { status: "signed-out" }
  | { status: "forbidden" }
  | { status: "ok"; user: AdminUser };

async function resolveAdmin(): Promise<AdminResolution> {
  const user = await currentUser();
  if (!user) return { status: "signed-out" };

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

  const allEmails = user.emailAddresses.map((e) =>
    e.emailAddress.toLowerCase(),
  );
  const isAdmin = allEmails.some((e) => ADMIN_EMAILS.includes(e));
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
