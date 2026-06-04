import "server-only";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Email allowlist — only these addresses can pass `requireAdmin`. Set
 * via `ADMIN_EMAILS` env var as a comma-separated list. Falls back to
 * `ADMIN_EMAIL` (singular, already used by the email-notification flow)
 * and then a hardcoded default so dev environments aren't completely
 * locked out.
 */
// NOTE: `||` not `??` — an env var set to an empty string ("") is a real
// (and easy-to-hit) misconfiguration. `??` only falls through on
// null/undefined, so `ADMIN_EMAIL=""` would yield an EMPTY allowlist and
// lock everyone out. `||` treats "" as absent and falls back correctly.
const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ||
  process.env.ADMIN_EMAIL ||
  "shawon221b@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Server-only — call this at the top of every admin page or server action.
 *
 * Flow:
 *  1. If not signed in → redirect to /admin/sign-in.
 *  2. If signed in but the email isn't in ADMIN_EMAILS → redirect to /.
 *     We deliberately don't show a "403 Forbidden" page — silently
 *     pretending the admin doesn't exist is friendlier to anyone who
 *     wandered in by accident, and harder for an attacker to enumerate.
 *  3. Otherwise returns { userId, email } for the caller's use.
 */
export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const user = await currentUser();
  if (!user) {
    redirect("/admin/sign-in");
  }

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

  const allEmails = user.emailAddresses.map((e) =>
    e.emailAddress.toLowerCase(),
  );
  const isAdmin = allEmails.some((e) => ADMIN_EMAILS.includes(e));

  if (!isAdmin) {
    redirect("/");
  }

  return {
    userId: user.id,
    email: primaryEmail ?? "",
  };
}
