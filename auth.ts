import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { authConfig } from "./auth.config";

// Fixed bcrypt hash (cost 10) compared against on the "no such admin" path so
// login timing doesn't reveal which emails are registered admins.
const DUMMY_HASH = "$2b$10$eGDsGpy4.ZLvl7EW7sORk.5oZupAQvt0fkrJhmaMqY/vWbuyFJyue";

// Lightweight in-process rate limiter (per Fluid Compute instance). Stops
// brute-force / credential-stuffing BEFORE the DB + bcrypt work — which also
// removes the bcrypt CPU-exhaustion vector. For limiting that spans instances,
// swap this for @upstash/ratelimit once Upstash Redis is provisioned (NOTES.md).
const RL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RL_MAX = 10; // attempts per window per IP
const rlHits = new Map<string, { count: number; resetAt: number }>();

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  if (rlHits.size > 10_000) rlHits.clear(); // crude memory bound
  const rec = rlHits.get(ip);
  if (!rec || now > rec.resetAt) {
    rlHits.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > RL_MAX;
}

/**
 * Self-contained admin auth. A login succeeds only if the email exists in the
 * admin_users table AND the bcrypt password matches — the table IS the
 * allowlist. JWT sessions, so the middleware can authorize without a DB hit.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const fwd = request.headers.get("x-forwarded-for");
        const ip = fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
        if (tooManyAttempts(ip)) return null;

        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const [row] = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.email, email))
          .limit(1);
        if (!row?.passwordHash) {
          // Equalize timing with the success path (avoid user enumeration).
          await bcrypt.compare(password, DUMMY_HASH);
          return null;
        }

        const ok = await bcrypt.compare(password, row.passwordHash);
        if (!ok) return null;

        return { id: row.id, email: row.email };
      },
    }),
  ],
});
