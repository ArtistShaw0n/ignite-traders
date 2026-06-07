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
