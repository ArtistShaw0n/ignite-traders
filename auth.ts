import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { authConfig } from "./auth.config";

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
      authorize: async (credentials) => {
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
        if (!row?.passwordHash) return null;

        const ok = await bcrypt.compare(password, row.passwordHash);
        if (!ok) return null;

        return { id: row.id, email: row.email };
      },
    }),
  ],
});
